/* Utility clock — clean dial / larger numerals */
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&display=swap');

.utility-clock-shell {
  position: relative;
  background: #000000;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
}

.utility-clock-shell .dial {
  position: absolute;
  inset: 4%;
  border-radius: 50%;
  background: #f8f8f8;
  box-shadow: inset 0 0 0 2px #111;
}

.utility-clock { position: relative; width: 100%; height: 100%; }
.utility-clock .clock { position: absolute; left: 50%; top: 50%; opacity: 1; }
.utility-clock .centre { position: absolute; top: 50%; left: 50%; width: 0; height: 0; }
.utility-clock .expand { position: absolute; top: 0; left: 0; transform: translate(-50%, -50%); }
.utility-clock .anchor { position: absolute; top: 0; left: 0; width: 0; height: 0; }
.utility-clock .element { position: absolute; top: 0; left: 0; }
.utility-clock .round { border-radius: 999px; }

/* Centre caps */
.utility-clock .circle-1 {
  width: 8px;
  height: 8px;
  border: 3px solid #111;
  background: #111;
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
  height: 132px;
  background: #FA9F22;
  transform: translate(-50%,-100%) translateY(-2px);
}

.utility-clock .second-hand-back {
  width: 2px;
  height: 18px;
  background: #FA9F22;
  transform: translate(-50%,-100%) translateY(20px);
}

.utility-clock .thin-hand {
  width: 4px;
  height: 48px;
  background: #000;
  transform: translate(-50%,-100%) translateY(-4px);
}

.utility-clock .fat-hand {
  width: 10px;
  height: 52px;
  background: #000;
  border-radius: 999px;
  transform: translate(-50%,-100%) translateY(-15px);
}

.utility-clock .minute-hand {
  height: 100px;
}

/* REMOVE dial lines completely */
.utility-clock .minute-line,
.utility-clock .major.minute-line,
.utility-clock .minute-text {
  display: none;
}

/* Hour markers */
.utility-clock .hour-pill {
  background: #000;
  width: 4px;
  height: 20px;
  border-radius: 999px;
  transform: translate(-50%,-100%) translateY(-70px);
  opacity: 0.8;
}

/* Larger hour numbers */
.utility-clock .hour-text {
  font-family: "Quicksand", sans-serif;
  font-size: 40px;
  font-weight: 600;
  color: #111;
  letter-spacing: -0.02em;
  top: -108px;
  line-height: 1;
}

.utility-clock .hour-10 .content { padding-left: 0.35ex; }
.utility-clock .hour-11 .content { padding-left: 0.20ex; }

/* Style toggles */
.utility-clock.hour-style-text .hour-pill {
  opacity: 0;
}

.utility-clock.hour-text-style-large .hour-text {
  font-size: 40px;
  top: -108px;
}

.utility-clock.hour-text-style-small .hour-text {
  font-size: 28px;
  top: -110px;
}

.utility-clock.minute-display-style-coarse .part.minute-line {
  opacity: 0;
}

.utility-clock.minute-text-style-none .minute-text {
  opacity: 0;
}
