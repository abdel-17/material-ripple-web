// Source code copied and modified from the material-web repository.
// https://github.com/material-components/material-web/blob/main/ripple/internal/ripple.ts

const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const PRESS_PSEUDO = "::after";
const ANIMATION_FILL = "forwards";

/**
 * Interaction states for the ripple.
 *
 * On Touch:
 *  - `INACTIVE -> TOUCH_DELAY -> WAITING_FOR_CLICK -> INACTIVE`
 *  - `INACTIVE -> TOUCH_DELAY -> HOLDING -> WAITING_FOR_CLICK -> INACTIVE`
 *
 * On Mouse or Pen:
 *   - `INACTIVE -> WAITING_FOR_CLICK -> INACTIVE`
 */
type State =
	/**
	 * Initial state of the control, no touch in progress.
	 *
	 * Transitions:
	 *   - on touch down: transition to `TOUCH_DELAY`.
	 *   - on mouse down: transition to `WAITING_FOR_CLICK`.
	 */
	| "INACTIVE"

	/**
	 * Touch down has been received, waiting to determine if it's a swipe or
	 * scroll.
	 *
	 * Transitions:
	 *   - on touch up: begin press; transition to `WAITING_FOR_CLICK`.
	 *   - on cancel: transition to `INACTIVE`.
	 *   - after `TOUCH_DELAY_MS`: begin press; transition to `HOLDING`.
	 */
	| "TOUCH_DELAY"

	/**
	 * A touch has been deemed to be a press
	 *
	 * Transitions:
	 *  - on up: transition to `WAITING_FOR_CLICK`.
	 */
	| "HOLDING"

	/**
	 * The user touch has finished, transition into rest state.
	 *
	 * Transitions:
	 *   - on click end press; transition to `INACTIVE`.
	 */
	| "WAITING_FOR_CLICK";

/**
 * Events that the ripple listens to.
 */
const EVENTS = [
	"click",
	"contextmenu",
	"pointercancel",
	"pointerdown",
	"pointerenter",
	"pointerleave",
	"pointerup",
];

/**
 * Delay reacting to touch so that we do not show the ripple for a swipe or
 * scroll interaction.
 */
const TOUCH_DELAY_MS = 150;

export type RippleProps = {
	/**
	 * The easing function used for the ripple animation.
	 *
	 * @default "cubic-bezier(0.2, 0, 0, 1)"
	 */
	easing?: string;

	/**
	 * Whether or not the ripple is initially disabled.
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Attaches this ripple to the given target, or to
	 * the parent element if no target is provided.
	 */
	target?: EventTarget | null;
};

export class Ripple {
	static readonly defaultEasing = "cubic-bezier(0.2, 0, 0, 1)";

	#growAnimation?: Animation;
	#state: State = "INACTIVE";
	#rippleStartEvent?: PointerEvent;
	#checkBoundsAfterContextMenu = false;
	#target: EventTarget | null = null;

	readonly #element: HTMLElement;

	constructor(element: HTMLElement, props: RippleProps = {}) {
		this.#element = element;

		element.classList.add("ripple");
		element.setAttribute("aria-hidden", "true");

		const { easing = Ripple.defaultEasing, disabled = false, target } = props;
		this.easing = easing;
		this.disabled = disabled;
		this.attach(target);
	}

	/**
	 * The ripple element.
	 */
	get element(): HTMLElement {
		return this.#element;
	}

	/**
	 * The element the ripple is currently attached to.
	 */
	get target(): EventTarget | null {
		return this.#target;
	}

	/**
	 * The easing function used for the ripple animation.
	 *
	 * @default "cubic-bezier(0.2, 0, 0, 1)"
	 */
	get easing(): string {
		return (
			this.element.getAttribute("data-ripple-easing") ?? Ripple.defaultEasing
		);
	}

	set easing(easing: string) {
		this.element.setAttribute("data-ripple-easing", easing);
	}

	/**
	 * Whether or not the ripple is disabled.
	 *
	 * @default false
	 */
	get disabled(): boolean {
		return this.element.hasAttribute("data-disabled");
	}

	set disabled(disabled: boolean) {
		this.element.toggleAttribute("data-disabled", disabled);
	}

	set #hovered(hovered: boolean) {
		this.element.toggleAttribute("data-hovered", hovered);
	}

	set #pressed(pressed: boolean) {
		this.element.toggleAttribute("data-pressed", pressed);
	}

	/**
	 * Attaches this ripple to the given target, or to
	 * the parent element if no target is provided.
	 *
	 * @param target The target to attach the ripple to.
	 *
	 * Passing `null` is equivalent to calling `detach()`.
	 */
	attach(target: EventTarget | null = this.element.parentElement): void {
		if (this.#target === target) {
			return;
		}

		this.detach();
		this.#target = target;

		if (this.#target === null) {
			return;
		}

		for (const event of EVENTS) {
			this.#target.addEventListener(event, this);
		}
	}

	/**
	 * Detaches this ripple from the target and
	 * removes any event listeners added to it.
	 */
	detach(): void {
		if (this.#target === null) {
			return;
		}

		for (const event of EVENTS) {
			this.#target.removeEventListener(event, this);
		}

		this.#target = null;
	}

	/** @internal */
	handleEvent(event: Event): void {
		// If the ripple is disabled or the user is using forced colors,
		// the ripple is hidden, so we don't need to handle any events.
		if (this.disabled || window.matchMedia("(forced-colors: active)").matches) {
			return;
		}

		switch (event.type) {
			case "click":
				this.#handleClick();
				break;
			case "contextmenu":
				this.#handleContextMenu();
				break;
			case "pointercancel":
				this.#handlePointerCancel(event as PointerEvent);
				break;
			case "pointerdown":
				this.#handlePointerDown(event as PointerEvent);
				break;
			case "pointerenter":
				this.#handlePointerEnter(event as PointerEvent);
				break;
			case "pointerleave":
				this.#handlePointerLeave(event as PointerEvent);
				break;
			case "pointerup":
				this.#handlePointerUp(event as PointerEvent);
				break;
		}
	}

	#handlePointerEnter(event: PointerEvent) {
		if (!this.#shouldReactToEvent(event)) {
			return;
		}

		this.#hovered = true;
	}

	#handlePointerLeave(event: PointerEvent) {
		if (!this.#shouldReactToEvent(event)) {
			return;
		}

		this.#hovered = false;

		// Release a held mouse or pen press that moves outside the element
		if (this.#state !== "INACTIVE") {
			this.#endPressAnimation();
		}
	}

	#handlePointerUp(event: PointerEvent) {
		if (!this.#shouldReactToEvent(event)) {
			return;
		}

		if (this.#state === "HOLDING") {
			this.#state = "WAITING_FOR_CLICK";
			return;
		}

		if (this.#state === "TOUCH_DELAY") {
			this.#state = "WAITING_FOR_CLICK";
			this.#startPressAnimation(this.#rippleStartEvent);
		}
	}

	#handlePointerDown(event: PointerEvent) {
		if (!this.#shouldReactToEvent(event)) {
			return;
		}

		this.#rippleStartEvent = event;

		if (!isTouch(event)) {
			this.#state = "WAITING_FOR_CLICK";
			this.#startPressAnimation(event);
			return;
		}

		// After a longpress contextmenu event, an extra `pointerdown` can be
		// dispatched to the pressed element. Check that the down is within
		// bounds of the element in this case.
		if (this.#checkBoundsAfterContextMenu && !this.#inBounds(event)) {
			return;
		}

		this.#checkBoundsAfterContextMenu = false;

		// Wait for a hold after touch delay
		this.#state = "TOUCH_DELAY";

		setTimeout(() => {
			if (this.#state !== "TOUCH_DELAY") {
				return;
			}

			this.#state = "HOLDING";
			this.#startPressAnimation(event);
		}, TOUCH_DELAY_MS);
	}

	#handleClick() {
		if (this.#state === "WAITING_FOR_CLICK") {
			this.#endPressAnimation();
			return;
		}

		if (this.#state === "INACTIVE") {
			// Keyboard synthesized click event
			this.#startPressAnimation();
			this.#endPressAnimation();
		}
	}

	#handlePointerCancel(event: PointerEvent) {
		if (!this.#shouldReactToEvent(event)) {
			return;
		}

		this.#endPressAnimation();
	}

	#handleContextMenu() {
		this.#checkBoundsAfterContextMenu = true;
		this.#endPressAnimation();
	}

	#determineRippleSize() {
		const { height, width } = this.element.getBoundingClientRect();

		const maxDim = Math.max(height, width);
		const softEdgeSize = Math.max(
			SOFT_EDGE_CONTAINER_RATIO * maxDim,
			SOFT_EDGE_MINIMUM_SIZE,
		);
		const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
		const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
		const maxRadius = hypotenuse + PADDING;

		return {
			initialSize,
			rippleScale: (maxRadius + softEdgeSize) / initialSize,
			rippleSize: `${initialSize}px`,
		};
	}

	#getNormalizedPointerEventCoords(pointerEvent: PointerEvent) {
		const { left, top } = this.element.getBoundingClientRect();
		const { scrollX, scrollY } = window;
		const { pageX, pageY } = pointerEvent;

		const documentX = scrollX + left;
		const documentY = scrollY + top;

		return {
			x: pageX - documentX,
			y: pageY - documentY,
		};
	}

	#getTranslationCoordinates(
		positionEvent: Event | undefined,
		initialSize: number,
	) {
		const { height, width } = this.element.getBoundingClientRect();

		// End in the center
		const endPoint = {
			x: (width - initialSize) / 2,
			y: (height - initialSize) / 2,
		};

		let startPoint: { x: number; y: number };
		if (positionEvent instanceof PointerEvent) {
			startPoint = this.#getNormalizedPointerEventCoords(positionEvent);
		} else {
			startPoint = { x: width / 2, y: height / 2 };
		}

		// Center around start point
		startPoint.x -= initialSize / 2;
		startPoint.y -= initialSize / 2;

		return { startPoint, endPoint };
	}

	#startPressAnimation(positionEvent?: Event) {
		this.#pressed = true;
		this.#growAnimation?.cancel();

		const { initialSize, rippleScale, rippleSize } =
			this.#determineRippleSize();

		const { startPoint, endPoint } = this.#getTranslationCoordinates(
			positionEvent,
			initialSize,
		);

		this.#growAnimation = this.element.animate(
			{
				top: [0, 0],
				left: [0, 0],
				height: [rippleSize, rippleSize],
				width: [rippleSize, rippleSize],
				transform: [
					`translate(${startPoint.x}px, ${startPoint.y}px) scale(1)`,
					`translate(${endPoint.x}px, ${endPoint.y}px) scale(${rippleScale})`,
				],
			},
			{
				pseudoElement: PRESS_PSEUDO,
				duration: PRESS_GROW_MS,
				easing: this.easing,
				fill: ANIMATION_FILL,
			},
		);
	}

	#endPressAnimation() {
		this.#rippleStartEvent = undefined;
		this.#state = "INACTIVE";

		const animation = this.#growAnimation;

		let pressAnimationPlayState = Number.POSITIVE_INFINITY;
		if (typeof animation?.currentTime === "number") {
			pressAnimationPlayState = animation.currentTime;
		} else if (animation?.currentTime != null) {
			pressAnimationPlayState = animation.currentTime.to("ms").value;
		}

		if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
			this.#pressed = false;
			return;
		}

		setTimeout(() => {
			if (this.#growAnimation !== animation) {
				// A new press animation was started. The old animation was canceled and
				// should not finish the pressed state.
				return;
			}

			this.#pressed = false;
		}, MINIMUM_PRESS_MS - pressAnimationPlayState);
	}

	/**
	 * Returns `true` if
	 *  - the pointer is primary for the input type
	 *  - the pointer is the pointer that started the interaction, or will start
	 * the interaction
	 *  - the pointer is a touch, or the pointer state has the primary button
	 * held, or the pointer is hovering
	 */
	#shouldReactToEvent(event: PointerEvent) {
		if (!event.isPrimary) {
			return false;
		}

		if (
			this.#rippleStartEvent !== undefined &&
			this.#rippleStartEvent.pointerId !== event.pointerId
		) {
			return false;
		}

		if (event.type === "pointerenter" || event.type === "pointerleave") {
			return !isTouch(event);
		}

		const isPrimaryButton = event.buttons === 1;
		return isTouch(event) || isPrimaryButton;
	}

	/**
	 * Check if the event is within the bounds of the element.
	 *
	 * This is only needed for the "stuck" contextmenu longpress on Chrome.
	 */
	#inBounds({ x, y }: PointerEvent) {
		const { top, left, bottom, right } = this.element.getBoundingClientRect();
		return left <= x && x <= right && top <= y && y <= bottom;
	}
}

function isTouch(event: PointerEvent) {
	return event.pointerType === "touch";
}
