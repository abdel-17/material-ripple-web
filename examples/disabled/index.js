import { Ripple } from "../../dist/index.js";

const ripple = new Ripple(document.getElementById("ripple"));
ripple.attach();

const btn = document.getElementById("btn");
const disabled = document.getElementById("disabled");

disabled.addEventListener("change", () => {
	btn.disabled = disabled.checked;
	ripple.disabled = disabled.checked;
});
