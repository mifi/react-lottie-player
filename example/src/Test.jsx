import Lottie from 'react-lottie-player';
import LottieLight from 'react-lottie-player/dist/LottiePlayerLight.modern';

import React from 'react';

import lottieJson from './26514-check-success-animation.json';

function Test() {
  switch (window.location.pathname) {
    case '/test/1': return (
      <Lottie
        goTo={60}
        animationData={lottieJson}
        style={{ width: 150, height: 150 }}
      />
    );

    case '/test/2': return (
      <Lottie
        goTo={60}
        path="/26514-check-success-animation.json"
        style={{ width: 150, height: 150 }}
      />
    );

    case '/test/3': return (
      <LottieLight
        goTo={60}
        animationData={lottieJson}
        style={{ width: 150, height: 150 }}
      />
    );

    case '/test/4': return (
      <LottieLight
        goTo={60}
        path="/26514-check-success-animation.json"
        style={{ width: 150, height: 150 }}
      />
    );

    default: return null;
  }
}

export default Test;
