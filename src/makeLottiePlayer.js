// @ts-check
/// <reference types="./index" />
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, {
  memo, useRef, useEffect, useState, forwardRef, useCallback,
} from 'react';
import equal from 'fast-deep-equal/es6/react';
// @ts-expect-error todo
import clone from 'rfdc/default';

const emptyObject = {};
const noOp = () => undefined;

/**
 * @param {import('lottie-web').LottiePlayer} args
 * @returns {React.FC<import('react-lottie-player').LottieProps>}
 */
const makeLottiePlayer = ({ loadAnimation }) => {
  const Lottie = memo(forwardRef((
    /** @type {import('react-lottie-player').LottieProps} */
    params,
    /** @type {React.ForwardedRef<import('lottie-web').AnimationItem | undefined>} */
    forwardedRef,
  ) => {
    const {
      play = null,
      speed = 1,
      direction = 1,
      segments: segmentsIn = null,
      goTo = null,
      useSubframes = true,

      // props picked to match from Lottie's config
      renderer = 'svg',
      loop = true,
      rendererSettings: rendererSettingsIn = emptyObject,
      audioFactory,

      onLoad = noOp,
      onComplete = noOp,
      onLoopComplete = noOp,
      onEnterFrame = noOp,
      onSegmentStart = noOp,

      // htmlProps remain and will pass on to the div element
      ...props
    } = params;

    /** @type {import('react-lottie-player').LottieProps} */
    let propsFiltered = props;
    /** @type {object | undefined} */
    let animationData;
    /** @type {string | undefined} */
    let path;
    /** @type {string | undefined} */
    let assetsPath;

    if ('animationData' in props) {
      ({ animationData, ...propsFiltered } = props);
    }
    if ('path' in props) {
      ({ path, ...propsFiltered } = props);
    }
    if ('assetsPath' in props) {
      ({ assetsPath, ...propsFiltered } = props);
    }

    /** @type {React.MutableRefObject<HTMLDivElement | null>} */
    const animElementRef = useRef(null);
    /** @type {React.MutableRefObject<import('lottie-web').AnimationItem | undefined>} */
    const animRef = useRef();

    const getAnim = useCallback(() => {
      if (animRef.current == null) throw new Error('Lottie ref is not set');
      return animRef.current;
    }, []);

    const [ready, setReady] = useState(false);

    const [segments, setSegments] = useState(segmentsIn);

    // Prevent re-init
    useEffect(() => {
      if (!equal(segments, segmentsIn)) setSegments(segmentsIn);
    }, [segmentsIn, segments]);

    const [rendererSettings, setRendererSettings] = useState(rendererSettingsIn);

    // Prevent re-init
    useEffect(() => {
      if (!equal(rendererSettings, rendererSettingsIn)) setRendererSettings(rendererSettingsIn);
    }, [rendererSettingsIn, rendererSettings]);

    // In order to remove listeners before animRef gets destroyed:
    useEffect(() => () => getAnim().removeEventListener('complete', onComplete), [getAnim, onComplete]);
    useEffect(() => () => getAnim().removeEventListener('loopComplete', onLoopComplete), [getAnim, onLoopComplete]);
    useEffect(() => () => getAnim().removeEventListener('enterFrame', onEnterFrame), [getAnim, onEnterFrame]);
    useEffect(() => () => getAnim().removeEventListener('segmentStart', onSegmentStart), [getAnim, onSegmentStart]);
    useEffect(() => () => getAnim().removeEventListener('DOMLoaded', onLoad), [getAnim, onLoad]);

    const setLottieRefs = useCallback((/** @type {import('lottie-web').AnimationItem | undefined} */ newRef) => {
      animRef.current = newRef;
      if (typeof forwardedRef === 'function') {
        forwardedRef(newRef);
      } else if (forwardedRef !== undefined && forwardedRef !== null) {
        // eslint-disable-next-line no-param-reassign -- mutating a ref is intended
        forwardedRef.current = newRef;
      }
    }, [forwardedRef]);

    useEffect(() => {
      function parseAnimationData() {
        if (animationData == null || typeof animationData !== 'object') return animationData;

        // https://github.com/mifi/react-lottie-player/issues/11#issuecomment-879310039
        // https://github.com/chenqingspring/vue-lottie/issues/20
        if ('default' in animationData && typeof animationData.default === 'object') {
          return clone(animationData.default);
        }
        // cloneDeep to prevent memory leak. See #35
        return clone(animationData);
      }

      if (animElementRef.current == null) throw new Error('animElementRef is not set');

      // console.log('init')
      const lottie = loadAnimation({
        animationData: parseAnimationData(),
        path,
        assetsPath,
        container: animElementRef.current,
        renderer,
        loop: false,
        autoplay: false, // We want to explicitly control playback
        rendererSettings,
        ...(audioFactory ? { audioFactory } : {}),
      });
      setLottieRefs(lottie);

      const onDomLoaded = () => setReady(true);

      getAnim().addEventListener('DOMLoaded', onDomLoaded);

      return () => {
        getAnim().removeEventListener('DOMLoaded', onDomLoaded);
        setReady(false);
        getAnim().destroy();
        setLottieRefs(undefined);
      };
    }, [loop, renderer, rendererSettings, animationData, path, assetsPath, audioFactory, setLottieRefs, getAnim]);

    useEffect(() => {
      getAnim().addEventListener('DOMLoaded', onLoad);
    }, [getAnim, onLoad]);

    useEffect(() => {
      getAnim().addEventListener('complete', onComplete);
    }, [getAnim, onComplete]);

    useEffect(() => {
      getAnim().addEventListener('loopComplete', onLoopComplete);
    }, [getAnim, onLoopComplete]);

    useEffect(() => {
      getAnim().addEventListener('enterFrame', onEnterFrame);
    }, [getAnim, onEnterFrame]);

    useEffect(() => {
      getAnim().addEventListener('segmentStart', onSegmentStart);
    }, [getAnim, onSegmentStart]);

    useEffect(() => {
      if (!ready) return;
      getAnim().loop = loop;
    }, [ready, loop, getAnim]);

    const wasPlayingSegmentsRef = useRef(false);

    useEffect(() => {
      if (!ready) return;

      // Without this code, when playback restarts, it will not play in reverse:
      // https://github.com/mifi/react-lottie-player/issues/19
      function playReverse(/** @type {number} */ lastFrame) {
        getAnim().goToAndPlay(lastFrame, true);
        getAnim().setDirection(direction);
      }

      if (play === true) {
        const force = true;
        if (segments) {
          getAnim().playSegments(segments, force);
          wasPlayingSegmentsRef.current = true;

          // This needs to be called after playSegments or it will not play backwards
          if (direction === -1) {
            // TODO What if more than one segment
            const lastFrame = typeof segments[1] === 'number' ? segments[1] : segments[1][1];
            playReverse(lastFrame);
          }
        } else {
          // If we called playSegments last time, the segments are stored as a state in the lottie object
          // Need to reset segments or else it will still play the old segments also when calling play()
          // wasPlayingSegmentsRef: Only reset segments if playSegments last time, because resetSegments will also reset playback position
          // https://github.com/airbnb/lottie-web/blob/master/index.d.ts
          if (wasPlayingSegmentsRef.current) getAnim().resetSegments(force);
          wasPlayingSegmentsRef.current = false;

          if (direction === -1) {
            const lastFrame = getAnim().getDuration(true);
            playReverse(lastFrame);
          } else {
            getAnim().play();
          }
        }
      } else if (play === false) {
        getAnim().pause();
      }
    }, [play, segments, ready, direction, getAnim]);

    useEffect(() => {
      if (!ready) return;
      if (Number.isNaN(speed)) return;
      getAnim().setSpeed(speed);
    }, [speed, ready, getAnim]);

    // This handles the case where only direction has changed (direction is not a dependency of the other effect that calls setDirection)
    useEffect(() => {
      if (!ready) return;
      getAnim().setDirection(direction);
    }, [direction, getAnim, ready]);

    useEffect(() => {
      if (!ready) return;
      if (goTo == null) return;
      const isFrame = true; // TODO
      if (play) getAnim().goToAndPlay(goTo, isFrame);
      else getAnim().goToAndStop(goTo, isFrame);
    }, [getAnim, goTo, play, ready]);

    useEffect(() => {
      if (getAnim().setSubframe) getAnim().setSubframe(useSubframes);
      // console.log(getAnim().isSubframeEnabled)
    }, [getAnim, useSubframes]);

    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <div
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...propsFiltered}
        ref={animElementRef}
      />
    );
  }));

  return Lottie;
};

export default makeLottiePlayer;
