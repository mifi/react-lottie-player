// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

export const propTypes = {
  // You can use either animationData OR path
  animationData: PropTypes.object,
  path: PropTypes.string,

  play: PropTypes.bool,
  goTo: PropTypes.number,
  speed: PropTypes.number,
  direction: PropTypes.number,
  loop: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  useSubframes: PropTypes.bool,

  segments: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.bool]),

  rendererSettings: PropTypes.object,

  renderer: PropTypes.string,

  audioFactory: PropTypes.func,

  onComplete: PropTypes.func,
  onLoopComplete: PropTypes.func,
  onEnterFrame: PropTypes.func,
  onSegmentStart: PropTypes.func,
};

export const defaultProps = {
  animationData: null,
  path: null,

  play: null,
  segments: null,
  goTo: null,
  useSubframes: true,

  speed: 1,
  direction: 1,
  loop: true,

  rendererSettings: {},
  renderer: 'svg',

  audioFactory: null,

  onLoad: () => {},
  onComplete: () => {},
  onLoopComplete: () => {},
  onEnterFrame: () => {},
  onSegmentStart: () => {},
};
