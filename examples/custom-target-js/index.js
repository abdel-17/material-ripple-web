import { Ripple } from "../../dist/index.js";

const ripple = new Ripple(document.getElementById("ripple"));
const rippleTarget = document.getElementById("ripple-target");
ripple.attach(rippleTarget);
