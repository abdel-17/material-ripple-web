import React from "react";
import { Ripple as MaterialRipple } from "./index.js";

export interface RippleProps extends React.ComponentPropsWithRef<"div"> {
	disabled?: boolean;
}

export function Ripple({ disabled = false, ...props }: RippleProps) {
	const ref = React.useRef<HTMLDivElement | null>(null);
	const rippleRef = React.useRef<MaterialRipple | null>(null);

	React.useEffect(() => {
		if (ref.current === null) {
			return;
		}

		rippleRef.current = new MaterialRipple(ref.current);

		return () => {
			rippleRef.current?.destroy();
			rippleRef.current = null;
		};
	}, []);

	React.useEffect(() => {
		if (rippleRef.current !== null) {
			rippleRef.current.disabled = disabled;
		}
	}, [disabled]);

	return <div ref={ref} {...props} />;
}
