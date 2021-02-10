import Lottie from 'react-lottie-player'

import React from 'react';

import lottieJson from './26514-check-success-animation.json';

const Test = () => {
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
  }
}

export default Test;
