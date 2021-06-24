import Lottie from 'react-lottie-player'

import React, { useState, memo, useRef, useEffect } from 'react';
import Test from './Test';

import lottieJson from './26514-check-success-animation.json';

const boxStyle = { boxShadow: '0 0 10px 10px rgba(0,0,0,0.03)', width: 200, maxWidth: '100%', margin: 30, padding: 30, borderRadius: 7, display: 'flex', flexDirection: 'column' };

const ScrollTest = memo(() => {
  const scrollRef = useRef();
  const [animationPosition, setAnimationPosition] = useState(0);

  useEffect(() => {
    function handleScroll(e) {
      setAnimationPosition(Math.max((0, e.target.scrollTop - 50) * 0.3));
    }
    const scroller = scrollRef.current
    scroller.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scroller.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={scrollRef} style={{ ...boxStyle, height: 400, overflowY: 'scroll' }}>
      <div style={{ textAlign: 'center' }}>
        <div>Scroll down</div>
        <span style={{ fontSize: 40 }} role="img" aria-label="Scroll down">⬇️</span>
      </div>

      <Lottie
        animationData={lottieJson}
        goTo={animationPosition}
        style={{ width: 150, height: 150, alignSelf: 'center', marginTop: 200, marginBottom: 300 }}
      />
    </div>
  )
});

const MainTest = memo(() => {
  const [segmentFrom, setSegmentFrom] = useState(0);
  const [segmentTo, setSegmentTo] = useState(70);
  const [segmentsEnabled, setSegmentsEnabled] = useState(false);
  const [play, setPlay] = useState(true);
  const [loop, setLoop] = useState(true);
  const [loopTimes, setLoopTimes] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [direction, setDirection] = useState(1);
  const segments = [segmentFrom, segmentTo];

  const [log, setLog] = useState([]);
  const addLog = (v) => setLog(l => [v, ...l]);

  function handleLoopTimesChange(e) {
    const { value } = e.target;
    setLoopTimes(value);
    const n = parseInt(value, 10);
    if (!Number.isInteger(n)) return;
    setLoop(n);
  }

  function getLoopVal() {
    if (loop === true) return '';
    if (loop === false) return 0;
    return loopTimes;
  }

  return (
    <div style={boxStyle}>
      <Lottie
        loop={loop}
        speed={speed}
        play={play}
        animationData={lottieJson}
        direction={direction}
        segments={segmentsEnabled && segments}
        style={{ width: 150, height: 150, marginBottom: 10, alignSelf: 'center' }}
        onComplete={() => addLog('complete')}
        onLoopComplete={() => addLog('loopComplete')}
        onEnterFrame={() => { /* addLog('enterFrame') */ }}
        onSegmentStart={() => addLog('segmentStart')}
        onLoad={() => addLog('load')}
      />

      <div style={{ margin: '7px 0' }}><input type="checkbox" checked={loop} onChange={e => setLoop(e.target.checked)} id="loop" /> <label htmlFor="loop">Loop</label></div>

      <div style={{ margin: '7px 0' }}>
        Loop times<br />
        <input type="number" value={getLoopVal()} onChange={handleLoopTimesChange} />
      </div>

      <div style={{ margin: '7px 0' }}><input type="checkbox" checked={play} onChange={e => setPlay(e.target.checked)} id="playing1" /> <label htmlFor="playing1">Playing</label></div>

      <div style={{ margin: '7px 0' }}>
        <div style={{ marginBottom: 5 }}><input type="checkbox" checked={segmentsEnabled} onChange={e => setSegmentsEnabled(e.target.checked)} id="segmentsEnabled" /><label htmlFor="segmentsEnabled">Segments enabled</label></div>
        <div style={{ marginLeft: 10 }}>
          Segment from<br />
          <input disabled={!segmentsEnabled} type="number" value={segmentFrom} onChange={e => setSegmentFrom(parseInt(e.target.value, 10))} />
        </div>
        <div style={{ marginLeft: 10 }}>
          Segment to<br />
          <input disabled={!segmentsEnabled} type="number" value={segmentTo} onChange={e => setSegmentTo(parseInt(e.target.value, 10))} />
        </div>
      </div>

      <div style={{ margin: '10px 0' }}>
        Speed
        <input
          style={{ width: '100%' }}
          type="range"
          min="0"
          max="100"
          value={speed * 20}
          onChange={(e) => setSpeed(parseInt(e.target.value, 10) / 20)}
          step="1"
        />
      </div>

      <div style={{ margin: '10px 0' }}>
        Direction<br />
        <input style={{ padding: 5, margin: 5, border: direction === -1 ? '2px solid black' : undefined }} type="button" value="-1" onClick={() => setDirection(-1)} />
        <input style={{ padding: 5, margin: 5, border: direction === 1 ? '2px solid black' : undefined }} type="button" value="1" onClick={() => setDirection(1)} />
      </div>

      <div>Event log</div>
      <div style={{ height: 100, overflowY: 'scroll', background: 'rgba(0,0,0,0.03)', borderRadius: 5, padding: 10 }}>
        {log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
});

const RangeText = memo(() => {
  const [goTo, setGoTo] = useState(55);
  const [play, setPlay] = useState(false);
  const [mounted, setMounted] = useState(true);

  return (
    <div style={boxStyle}>
      <div style={{ margin: '7px 0' }}><input type="checkbox" checked={mounted} onChange={e => setMounted(e.target.checked)} id="mounted1" /> <label htmlFor="mounted1">Mounted</label></div>

      {mounted && (
        <>
          <Lottie
            play={play}
            goTo={goTo}
            animationData={lottieJson}
            style={{ width: 150, height: 150, marginBottom: 10 }}
          />

          <div style={{ margin: '10px 0' }}><input type="checkbox" checked={play} onChange={e => setPlay(e.target.checked)} id="playing2" /><label htmlFor="playing2">Playing</label></div>

          <div style={{ margin: '10px 0' }}>
            Controlled position<br />
            <input
              style={{ width: '100%' }}
              type="range"
              min="0"
              max="108"
              value={goTo}
              onChange={(e) => setGoTo(parseInt(e.target.value, 10))}
              step="1"
            />
          </div>
        </>
      )}
    </div>
  );
});


const App = () => {
  if (window.location.pathname.startsWith('/test')) return <Test />;

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>react-lottie-player Live Demo</h1>
      <p style={{ textAlign: 'center' }}><a href="https://github.com/mifi/react-lottie-player/blob/master/example/src/index.js">View source here</a></p>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <MainTest />
        <RangeText />
        <ScrollTest />
      </div>
    </>
  );  
}

export default App
