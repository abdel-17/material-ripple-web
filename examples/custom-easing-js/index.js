import { Ripple } from "../../dist/index.js";

const ripple = new Ripple(document.getElementById("ripple"));
ripple.easing = "ease-in-out";
ripple.attach();
