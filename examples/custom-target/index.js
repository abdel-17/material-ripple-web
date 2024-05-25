import { Ripple } from "https://cdn.jsdelivr.net/npm/material-ripple-web@latest/dist/index.min.js";

document.addEventListener("DOMContentLoaded", () => {
	new Ripple(document.getElementById("ripple"), {
		target: document.getElementById("ripple-target"),
	});
});
