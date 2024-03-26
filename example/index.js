import { Ripple } from "../dist/index.js";

document.addEventListener("DOMContentLoaded", () => {
	const ripple = new Ripple(document.getElementById("ripple"));
	ripple.attach();

	document.getElementById("easing").addEventListener("change", function () {
		ripple.easing = this.value;
	});

	document.getElementById("disabled").addEventListener("change", function () {
		ripple.disabled = this.checked;
	});
});
