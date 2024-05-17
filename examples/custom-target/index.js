import { Ripple } from "../../dist/index.js";

document.addEventListener("DOMContentLoaded", () => {
	new Ripple(document.getElementById("ripple"), {
		target: document.getElementById("ripple-target"),
	});
});
