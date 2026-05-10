/* Utility clock — tuned to stay inside the dial and match the reference better */
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&display=swap');

.utility-clock-shell {
  position: relative;
  background: #000000;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.utility-clock-shell .dial {
  position: absolute;
  inset: 4%;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: inset 0 0 0 2px #000;
}

.utility-clock { position: relative; width: 100%; height: 100%; }
.utility-clock .clock { position: absolute; opacity: 1; left: 50%; top: 50%; }
.utility-clock .centre { position: absolute; top: 50%; left: 50%; width: 0; height: 0; }
.utility-clock .expand { position: absolute; top: 0; left: 0; transform: translate(-50%, -50%); }
.utility-clock .anchor { position: absolute; top: 0; left: 0; width: 0; height: 0; }
.utility-clock .element { position: absolute; top: 0; left: 0; }
.utility-clock .round { border-radius: 999px; }

/* Centre caps */
.utility-clock .circle-1 {
  width: 8px;
  height: 8px;
  border: 3px solid #000;
  background: #000;
}

.utility-clock .circle-2 {
  width: 5px;
  height: 5px;
  border: 2px solid #FA9F22;
  background: #FA9F22;
}

/* Hands */
.utility-clock .second-hand-front {
  width: 2px;
  height: 137px;
  background: #FA9F22;
  transform: translate(-50%,-100%) translateY(-3px);
}

.utility-clock .second-hand-back {
  width: 2px;
  height: 21px;
  background: #FA9F22;
  opacity: 1;
  transform: translate(-50%,-100%) translateY(24px);
}

.utility-clock .thin-hand {
  width: 4px;
  height: 50px;
  background: #000;
  transform: translate(-50%,-100%) translateY(-5px);
}

.utility-clock .fat-hand {
  box-sizing: border-box;
  width: 10px;
  height: 57px;
  border-radius: 99px;
  background: #000;
  transform: translate(-50%,-100%) translateY(-18px);
}

.utility-clock .minute-hand { height: 112px; }

/* Tick marks */
.utility-clock .minute-line {
  background: #9a9a9a;
  width: 1px;
  height: 7px;
  transform: translate(-50%,-100%) translateY(-131px);
  opacity: 0.42;
}

.utility-clock .major.minute-line {
  opacity: 0.72;
  width: 2px;
  height: 10px;
}

/* Labels */
.utility-clock .minute-text {
  font-family: "Quicksand", sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #222;
  top: -135px;
}

.utility-clock .hour-pill {
  background: #000;
  width: 4px;
  height: 22px;
  border-radius: 99px;
  transform: translate(-50%,-100%) translateY(-78px);
  opacity: 0.8;
}

.utility-clock .hour-text {
  font-family: "Quicksand", sans-serif;
  font-size: 34px;
  font-weight: 600;
  color: #111;
  letter-spacing: -0.02em;
  top: -112px;
  line-height: 1;
}

.utility-clock .hour-10 .content { padding-left: 0.35ex; }
.utility-clock .hour-11 .content { padding-left: 0.20ex; }

/* Style toggles */
.utility-clock.hour-style-text .hour-pill {
  opacity: 0;
}

.utility-clock.hour-text-style-large .hour-text {
  font-size: 34px;
  top: -112px;
}

.utility-clock.hour-text-style-small .hour-text {
  font-size: 24px;
  top: -113px;
}

.utility-clock.minute-display-style-coarse .part.minute-line {
  opacity: 0;
}

.utility-clock.minute-text-style-none .minute-text {
  opacity: 0;
}
