import { Ripple } from "../dist/index.js";

document.addEventListener("DOMContentLoaded", () => {
	const ripple = new Ripple(document.getElementById("ripple"));
	ripple.attach();

	document.getElementById("toggle").addEventListener("change", function () {
		ripple.disabled = this.checked;
	});
});
