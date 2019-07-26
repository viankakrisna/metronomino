import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import colors from "material-colors";
import Tone from "tone";

import "./styles.css";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Input = props => (
  <input
    {...props}
    style={{
      display: "block",
      flex: 1,
      padding: 8,
      lineHeight: "24px",
      fontSize: 16,
      ...props.style,
      height: 32,
      minWidth: 0,
      width: "auto"
    }}
  />
);

const synth = new Tone.Synth().toMaster();
const synth2 = new Tone.Synth().toMaster();

function App() {
  const [beatTop, setBeatTop] = useState(4);
  const [beatBottom, setBeatBottom] = useState(4);
  const [BPM, setBPM] = useState(120);
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(current => ((current || 0) + 1) % beatTop);
  }, (60 * 1000) / BPM);
  useEffect(() => {
    if (count) {
      synth.triggerAttackRelease("C4", "64n");
      navigator.vibrate(60);
    } else {
      synth2.triggerAttackRelease("G4", "64n");
      navigator.vibrate(90);
    }
  }, [count]);
  const size = `calc(50vw - ${(50 * count) / beatTop}vw)`;
  return (
    <div style={{ background: "black", color: "white" }}>
      <div
        style={{
          display: "flex",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0
        }}
      >
        <Input
          onChange={e => setBeatTop(e.target.value)}
          value={beatTop}
          type="number"
        />
        <Input
          onChange={e => setBeatBottom(e.target.value)}
          value={beatBottom}
          type="number"
        />
        <Input
          onChange={e => setBPM(e.target.value)}
          type="number"
          value={BPM}
        />
      </div>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            background: colors.yellow[400],
            color: "white",
            margin: "auto"
          }}
        >
          <h1
            style={{ margin: 0, color: "black", fontSize: size, lineHeight: 1 }}
          >
            {count + 1}
          </h1>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
