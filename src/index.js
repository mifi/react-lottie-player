import React, { memo, useRef, useEffect, useState } from 'react';
import lottie from 'lottie-web';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

const Lottie = memo(({
  animationData,

  play,
  speed,
  direction,
  segments: segmentsIn,
  goTo,

  renderer,
  loop,
  rendererSettings: rendererSettingsIn,

  onComplete,
  onLoopComplete,
  onEnterFrame,
  onSegmentStart,

  ...props
}) => {
  const animElementRef = useRef();
  const animRef = useRef();

  const [ready, setReady] = useState(false);

  const [segments, setSegments] = useState(segmentsIn);

  // Prevent re-init
  useEffect(() => {
    if (!isEqual(segments, segmentsIn)) setSegments(segmentsIn);
  }, [segmentsIn, segments]);

  const [rendererSettings, setRendererSettings] = useState(rendererSettingsIn);

  // Prevent re-init
  useEffect(() => {
    if (!isEqual(rendererSettings, rendererSettingsIn)) setRendererSettings(rendererSettingsIn);
  }, [rendererSettingsIn, rendererSettings]);


  // In order to remove listeners before animRef gets destroyed:
  useEffect(() => () => animRef.current.removeEventListener('complete', onComplete), [onComplete]);
  useEffect(() => () => animRef.current.removeEventListener('loopComplete', onLoopComplete), [onLoopComplete]);
  useEffect(() => () => animRef.current.removeEventListener('enterFrame', onEnterFrame), [onEnterFrame]);
  useEffect(() => () => animRef.current.removeEventListener('segmentStart', onSegmentStart), [onSegmentStart]);

  useEffect(() => {
    // console.log('init')
    animRef.current = lottie.loadAnimation({
      animationData,
      container: animElementRef.current,
      renderer,
      loop: false,
      autoplay: false, // We want to explicitly control playback
      rendererSettings,
    });

    const onReady = () => setReady(true);
    animRef.current.addEventListener('DOMLoaded', onReady);

    return () => {
      animRef.current.removeEventListener('DOMLoaded', onReady);
      setReady(false);
      animRef.current.destroy();
      animRef.current = undefined;
    };
  }, [loop, renderer, rendererSettings, animationData]);

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

  useEffect(() => {
    if (!ready) return;

    if (play === true) {
      const force = true;
      if (segments) {
        animRef.current.playSegments(segments, force);
      } else {
        // https://github.com/airbnb/lottie-web/blob/master/index.d.ts
        animRef.current.resetSegments(force);
        animRef.current.play();
      }
      animRef.current.setDirection(direction);
    } else if (play === false) {
      animRef.current.pause();
    }
  }, [play, segments, ready]);

  useEffect(() => {
    if (!ready) return;
    if (Number.isNaN(speed)) return;
    animRef.current.setSpeed(speed);
  }, [speed, ready]);

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

  return (
    <div
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      ref={animElementRef}
    />
  );
});


Lottie.propTypes = {
  animationData: PropTypes.object.isRequired,

  play: PropTypes.bool,
  goTo: PropTypes.number,
  speed: PropTypes.number,
  direction: PropTypes.number,
  loop: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),

  segments: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.bool]),

  props: PropTypes.object,

  rendererSettings: PropTypes.object,

  renderer: PropTypes.string,

  onComplete: PropTypes.func,
  onLoopComplete: PropTypes.func,
  onEnterFrame: PropTypes.func,
  onSegmentStart: PropTypes.func,
};

Lottie.defaultProps = {
  play: null,
  segments: null,
  goTo: null,

  speed: 1,
  direction: 1,
  loop: true,

  props: {},

  rendererSettings: {},
  renderer: 'svg',

  onComplete: () => {},
  onLoopComplete: () => {},
  onEnterFrame: () => {},
  onSegmentStart: () => {},
};

export default Lottie;
