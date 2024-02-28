import "../../../dist/ripple.css";
import "./App.css";
import { useState } from "react";
import { Ripple } from "../../../dist/react";

export function App() {
	const [disabled, setDisabled] = useState(false);
	return (
		<>
			<h1>Material Ripple Web</h1>
			<div className="flex items-center">
				<button className="relative btn">
					<Ripple disabled={disabled} />
					<span>Click me</span>
				</button>

				<label htmlFor="toggle" className="ml-2 mr-0.25">
					Disabled
				</label>
				<input
					id="toggle"
					type="checkbox"
					checked={disabled}
					onChange={(e) => setDisabled(e.currentTarget.checked)}
				/>
			</div>
		</>
	);
}
