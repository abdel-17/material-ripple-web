import { Ripple } from "https://cdn.jsdelivr.net/npm/material-ripple-web@latest/dist/index.min.js";

document.addEventListener("DOMContentLoaded", () => {
	const ripple = new Ripple(document.getElementById("ripple"));

	document.getElementById("easing").addEventListener("change", function () {
		ripple.easing = this.value;
	});

	document.getElementById("disabled").addEventListener("change", function () {
		ripple.disabled = this.checked;
	});
});
