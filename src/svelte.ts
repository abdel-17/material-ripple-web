import type { Action } from "svelte/action";
import { Ripple } from "./index.js";

export type RippleActionParams = {
	disabled?: boolean;
};

export const ripple: Action<HTMLElement, RippleActionParams> = (
	node,
	{ disabled = false },
) => {
	const ripple = new Ripple(node);
	ripple.disabled = disabled;

	return {
		update({ disabled = false }) {
			ripple.disabled = disabled;
		},
		destroy() {
			ripple.destroy();
		},
	};
};
