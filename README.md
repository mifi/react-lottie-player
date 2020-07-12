# react-lottie-player

> Fully declarative React Lottie player

Inspired by [several](https://github.com/felippenardi/lottie-react-web) [existing](https://github.com/chenqingspring/react-lottie) [packages](https://github.com/Gamote/lottie-react) wrapping [lottie-web](https://github.com/airbnb/lottie-web) for React, I created this package because I wanted something that just works and is simple to use. None of the alternatives properly handle changes of props like playing/pausing/segments. This lead to lots of hacks to get the animations to play correctly.

`react-lottie-player` is a complete rewrite using modern hooks 🎣 for more readable code, an easy to use, seamless and **fully declarative control of the lottie player**.

[![NPM](https://img.shields.io/npm/v/react-lottie-player.svg)](https://www.npmjs.com/package/react-lottie-player) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-lottie-player
```

## Usage

```jsx
import React, { Component } from 'react'
import Lottie from 'react-lottie-player'

import lottieJson from './my-lottie.json'

class Example extends Component {
  render() {
    return (
      <Lottie
        loop
        animationData={lottieJson}
        play
        style={{ width: 150, height: 150 }}
      />
    )
  }
}
```

## Live example


## API

See https://github.com/airbnb/lottie-web

## Credits

- https://lottiefiles.com/26514-check-success-animation
- Published with [create-react-library](https://github.com/transitive-bullshit/create-react-library) 😎

## License

MIT © [mifi](https://github.com/mifi)
