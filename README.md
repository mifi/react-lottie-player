![](https://github.com/mifi/gifs/raw/master/react-lottie-player.gif)

Fully declarative React Lottie player

Inspired by [several](https://github.com/felippenardi/lottie-react-web) [existing](https://github.com/chenqingspring/react-lottie) [packages](https://github.com/Gamote/lottie-react) wrapping [lottie-web](https://github.com/airbnb/lottie-web) for React, I created this package because I wanted something that just works and is simple to use. None of the alternatives properly handle changes of props like playing/pausing/segments. This lead to lots of hacks to get the animations to play correctly.

`react-lottie-player` is a complete rewrite using modern hooks 🎣 for more readable code, an easy to use, seamless and **fully declarative control of the lottie player**.

![Tests](https://github.com/mifi/react-lottie-player/workflows/Tests/badge.svg) [![NPM](https://img.shields.io/npm/v/react-lottie-player.svg)](https://www.npmjs.com/package/react-lottie-player) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-lottie-player
```

## Usage

```jsx
import React from 'react'
import Lottie from 'react-lottie-player'

import lottieJson from './my-lottie.json'

export default function Example() {
  return (
    <Lottie
      loop
      animationData={lottieJson}
      play
      style={{ width: 150, height: 150 }}
    />
  )
}
```

## Example

[![](screenshot.png)](https://mifi.github.io/react-lottie-player/)

[Open live example](https://mifi.github.io/react-lottie-player/)

[View example code](https://github.com/mifi/react-lottie-player/blob/master/example/src/index.js)

## Lazy loading example

```js
const MyComponent = () => {
  const [animationData, setAnimationData] = useState();

  useEffect(() => {
    import('./animation.json').then(setAnimationData);
  }, []);

  if (!animationData) return <div>Loading...</div>;
  return <Lottie animationData={animationData} />;
}
```

See [#11](https://github.com/mifi/react-lottie-player/issues/11)

## API

See https://github.com/airbnb/lottie-web

[View PropTypes](https://github.com/mifi/react-lottie-player/blob/64eac186947be7ee5aad304ca4193c507ace8dc3/src/index.js#L147)

## Credits

- https://lottiefiles.com/26514-check-success-animation
- https://lottiefiles.com/38726-stagger-rainbow
- Published with [create-react-library](https://github.com/transitive-bullshit/create-react-library) 😎

## License

MIT © [mifi](https://github.com/mifi)

---

Made with ❤️ in [🇳🇴](https://www.youtube.com/watch?v=uQIv8Vo9_Jc)

[More apps by mifi.no](https://mifi.no/)

Follow me on [GitHub](https://github.com/mifi/), [YouTube](https://www.youtube.com/channel/UC6XlvVH63g0H54HSJubURQA), [IG](https://www.instagram.com/mifi.no/), [Twitter](https://twitter.com/mifi_no) for more awesome content!