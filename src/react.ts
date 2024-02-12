import { useRef, useEffect } from "react";
import { Ripple } from "./index.js";

export type UseRippleRefParams = {
	disabled?: boolean;
};

export function useRippleRef<Element extends HTMLElement = HTMLElement>({
	disabled = false,
}: UseRippleRefParams) {
	const ref = useRef<Element>(null);
	const rippleRef = useRef<Ripple | null>(null);

	useEffect(() => {
		if (ref.current === null) return;

		const ripple = new Ripple(ref.current);
		rippleRef.current = ripple;

		return () => {
			ripple.destroy();
			rippleRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (rippleRef.current !== null) {
			rippleRef.current.disabled = disabled;
		}
	}, [disabled]);

	return ref;
}
