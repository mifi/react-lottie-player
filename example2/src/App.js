import React, { useState } from "react"

// working example of animationControl
// uncomment the next line, and some more down in the return
// import Lottie from 'lottie-react-web'

// uncomment following line when using the above import of Lottie
import Lottie from './Lottie.js'
import faceJoystick from './face.json'

const style = {
  height: 200
}

function App() {
  const [t, setT] = useState(false)
  const [xy, setXY] = useState([0, 0])

  const toggle = () => {
    let x
    if(t){
      x = -200
    } else {
      x = 200
    }
    setT(!t)
    setXY([x, x])

    // console.log("toggle", t, xy)
  }

  return (
    <div>
      <h1>Test</h1>
      <Lottie
        animationData={faceJoystick}
        play={false}
        loop={false}
        style={style}
        animationControl={{
          'Eye2_ctrl,Transform,Position': xy,
        }}
      />
    {/* Uncomment the following and comment the above Lottie component
        for working example with lottie-react-web*/}
      {/*<div style={style}>
        <Lottie
          options={{
            animationData: faceJoystick,
          }}
          animationControl={{
            'Eye2_ctrl,Transform,Position': xy,
          }}
        />
      </div>*/}
      <div>
        <button onClick={toggle}>Click</button>
      </div>
    </div>
  )
}

export default App
