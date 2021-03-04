declare module 'react-lottie-player' {
    import React from 'react';
  
    interface LottieProps {
      animationData?: any;
      path?: string;
      play?: boolean;
      goTo?: number;
      speed?: number;
      direction?: number;
      loop?: number | boolean;
      segments?: number[] | boolean;
      rendererSettings?: any;
      renderer?: string;
      audioFactory?: any;
      onComplete?: () => void;
      onLoopComplete?: () => void;
      onEnterFrame?: () => void;
      onSegmentStart?: () => void;
      style?: React.CSSProperties;
    }
  
    export default class Lottie extends React.Component<LottieProps> {}
  }