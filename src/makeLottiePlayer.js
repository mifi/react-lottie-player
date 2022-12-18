// eslint-disable-next-line no-unused-vars
import React, {
  memo, useRef, useEffect, useState, forwardRef, useCallback,
} from 'react';
import equal from 'fast-deep-equal/es6/react';
import clone from 'rfdc/default';

import { propTypes, defaultProps } from './props';

const makeLottiePlayer = ({ loadAnimation }) => {
  const Lottie = memo(forwardRef(({
    animationData,
    path,

    play,
    speed,
    direction,
    segments: segmentsIn,
    goTo,
    useSubframes,

    renderer,
    loop,
    rendererSettings: rendererSettingsIn,

    audioFactory,

    onLoad,
    onComplete,
    onLoopComplete,
    onEnterFrame,
    onSegmentStart,

    ...props
  }, forwardedRef) => {
    const animElementRef = useRef();
    const animRef = useRef();

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
    useEffect(() => () => animRef.current.removeEventListener('complete', onComplete), [onComplete]);
    useEffect(() => () => animRef.current.removeEventListener('loopComplete', onLoopComplete), [onLoopComplete]);
    useEffect(() => () => animRef.current.removeEventListener('enterFrame', onEnterFrame), [onEnterFrame]);
    useEffect(() => () => animRef.current.removeEventListener('segmentStart', onSegmentStart), [onSegmentStart]);
    useEffect(() => () => animRef.current.removeEventListener('DOMLoaded', onLoad), [onLoad]);

    const setLottieRefs = useCallback((newRef) => {
      animRef.current = newRef;
      // eslint-disable-next-line no-param-reassign
      if (forwardedRef) forwardedRef.current = newRef;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      function parseAnimationData() {
        if (animationData == null || typeof animationData !== 'object') return animationData;

        // https://github.com/mifi/react-lottie-player/issues/11#issuecomment-879310039
        // https://github.com/chenqingspring/vue-lottie/issues/20
        if (typeof animationData.default === 'object') {
          return clone(animationData.default);
        }
        // cloneDeep to prevent memory leak. See #35
        return clone(animationData);
      }

      // console.log('init')
      const lottie = loadAnimation({
        animationData: parseAnimationData(),
        path,
        container: animElementRef.current,
        renderer,
        loop: false,
        autoplay: false, // We want to explicitly control playback
        rendererSettings,
        audioFactory,
      });
      setLottieRefs(lottie);

      const onDomLoaded = () => setReady(true);

      animRef.current.addEventListener('DOMLoaded', onDomLoaded);

      return () => {
        animRef.current.removeEventListener('DOMLoaded', onDomLoaded);
        setReady(false);
        animRef.current.destroy();
        setLottieRefs(undefined);
      };
    }, [loop, renderer, rendererSettings, animationData, path, audioFactory, setLottieRefs]);

    useEffect(() => {
      animRef.current.addEventListener('DOMLoaded', onLoad);
    }, [onLoad]);

    useEffect(() => {
      animRef.current.addEventListener('complete', onComplete);
    }, [onComplete]);

    useEffect(() => {
      animRef.current.addEventListener('loopComplete', onLoopComplete);
    }, [onLoopComplete]);

    useEffect(() => {
      animRef.current.addEventListener('enterFrame', onEnterFrame);
    }, [onEnterFrame]);

    useEffect(() => {
      animRef.current.addEventListener('segmentStart', onSegmentStart);
    }, [onSegmentStart]);

    useEffect(() => {
      if (!ready) return;
      animRef.current.loop = loop;
    }, [ready, loop]);

    const wasPlayingSegmentsRef = useRef(false);

    useEffect(() => {
      if (!ready) return;

      // Without this code, when playback restarts, it will not play in reverse:
      // https://github.com/mifi/react-lottie-player/issues/19
      function playReverse(lastFrame) {
        animRef.current.goToAndPlay(lastFrame, true);
        animRef.current.setDirection(direction);
      }

      if (play === true) {
        const force = true;
        if (segments) {
          animRef.current.playSegments(segments, force);
          wasPlayingSegmentsRef.current = true;

          // This needs to be called after playSegments or it will not play backwards
          if (direction === -1) {
            // TODO What if more than one segment
            const lastFrame = segments[1];
            playReverse(lastFrame);
          }
        } else {
          // If we called playSegments last time, the segments are stored as a state in the lottie object
          // Need to reset segments or else it will still play the old segments also when calling play()
          // wasPlayingSegmentsRef: Only reset segments if playSegments last time, because resetSegments will also reset playback position
          // https://github.com/airbnb/lottie-web/blob/master/index.d.ts
          if (wasPlayingSegmentsRef.current) animRef.current.resetSegments(force);
          wasPlayingSegmentsRef.current = false;

          if (direction === -1) {
            const lastFrame = animRef.current.getDuration(true);
            playReverse(lastFrame);
          } else {
            animRef.current.play();
          }
        }
      } else if (play === false) {
        animRef.current.pause();
      }
    }, [play, segments, ready, direction]);

    useEffect(() => {
      if (!ready) return;
      if (Number.isNaN(speed)) return;
      animRef.current.setSpeed(speed);
    }, [speed, ready]);

    // This handles the case where only direction has changed (direction is not a dependency of the other effect that calls setDirection)
    useEffect(() => {
      if (!ready) return;
      animRef.current.setDirection(direction);
    }, [direction, ready]);

    useEffect(() => {
      if (!ready) return;
      if (goTo == null) return;
      const isFrame = true; // TODO
      if (play) animRef.current.goToAndPlay(goTo, isFrame);
      else animRef.current.goToAndStop(goTo, isFrame);
    }, [goTo, play, ready]);

    useEffect(() => {
      if (animRef.current.setSubframe) animRef.current.setSubframe(useSubframes);
      // console.log(animRef.current.isSubframeEnabled)
    }, [useSubframes]);

    return (
      <div
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        ref={animElementRef}
      />
    );
  }));

  Lottie.propTypes = propTypes;
  Lottie.defaultProps = defaultProps;

  return Lottie;
};

export default makeLottiePlayer;
