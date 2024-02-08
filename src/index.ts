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
const EASING_STANDARD = "cubic-bezier(0.2, 0.0, 0, 1.0)";

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
enum State {
	/**
	 * Initial state of the control, no touch in progress.
	 *
	 * Transitions:
	 *   - on touch down: transition to `TOUCH_DELAY`.
	 *   - on mouse down: transition to `WAITING_FOR_CLICK`.
	 */
	INACTIVE,

	/**
	 * Touch down has been received, waiting to determine if it's a swipe or
	 * scroll.
	 *
	 * Transitions:
	 *   - on touch up: begin press; transition to `WAITING_FOR_CLICK`.
	 *   - on cancel: transition to `INACTIVE`.
	 *   - after `TOUCH_DELAY_MS`: begin press; transition to `HOLDING`.
	 */
	TOUCH_DELAY,

	/**
	 * A touch has been deemed to be a press
	 *
	 * Transitions:
	 *  - on up: transition to `WAITING_FOR_CLICK`.
	 */
	HOLDING,

	/**
	 * The user touch has finished, transition into rest state.
	 *
	 * Transitions:
	 *   - on click end press; transition to `INACTIVE`.
	 */
	WAITING_FOR_CLICK,
}

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

export class Ripple {
	private rippleSize = "";
	private rippleScale = 0;
	private initialSize = 0;
	private growAnimation?: Animation;
	private state = State.INACTIVE;
	private rippleStartEvent?: PointerEvent;
	private checkBoundsAfterContextMenu = false;

	private node: HTMLElement;
	private parentNode: HTMLElement;

	constructor(node: HTMLElement) {
		const parentNode = node.parentElement;
		if (!parentNode) {
			throw new Error("Ripple element must have a parent");
		}

		this.node = node;
		this.parentNode = parentNode;

		node.classList.add("ripple");
		node.setAttribute("aria-hidden", "true");

		for (const event of EVENTS) {
			parentNode.addEventListener(event, this);
		}
	}

	get disabled(): boolean {
		return this.node.hasAttribute("data-disabled");
	}

	set disabled(disabled: boolean) {
		this.node.toggleAttribute("data-disabled", disabled);
	}

	private handlePointerEnter(event: PointerEvent) {
		if (!this.shouldReactToEvent(event)) {
			return;
		}

		this.setHovered(true);
	}

	private handlePointerLeave(event: PointerEvent) {
		if (!this.shouldReactToEvent(event)) {
			return;
		}

		this.setHovered(false);

		// Release a held mouse or pen press that moves outside the element
		if (this.state !== State.INACTIVE) {
			this.endPressAnimation();
		}
	}

	private handlePointerUp(event: PointerEvent) {
		if (!this.shouldReactToEvent(event)) {
			return;
		}

		if (this.state === State.HOLDING) {
			this.state = State.WAITING_FOR_CLICK;
			return;
		}

		if (this.state === State.TOUCH_DELAY) {
			this.state = State.WAITING_FOR_CLICK;
			this.startPressAnimation(this.rippleStartEvent);
		}
	}

	private handlePointerDown(event: PointerEvent) {
		if (!this.shouldReactToEvent(event)) {
			return;
		}

		this.rippleStartEvent = event;
		if (!this.isTouch(event)) {
			this.state = State.WAITING_FOR_CLICK;
			this.startPressAnimation(event);
			return;
		}

		// After a longpress contextmenu event, an extra `pointerdown` can be
		// dispatched to the pressed element. Check that the down is within
		// bounds of the element in this case.
		if (this.checkBoundsAfterContextMenu && !this.inBounds(event)) {
			return;
		}

		this.checkBoundsAfterContextMenu = false;

		// Wait for a hold after touch delay
		this.state = State.TOUCH_DELAY;
		setTimeout(() => {
			if (this.state !== State.TOUCH_DELAY) {
				return;
			}

			this.state = State.HOLDING;
			this.startPressAnimation(event);
		}, TOUCH_DELAY_MS);
	}

	private handleClick() {
		if (this.state === State.WAITING_FOR_CLICK) {
			this.endPressAnimation();
			return;
		}

		if (this.state === State.INACTIVE) {
			// Keyboard synthesized click event
			this.startPressAnimation();
			this.endPressAnimation();
		}
	}

	private handlePointerCancel(event: PointerEvent) {
		if (!this.shouldReactToEvent(event)) {
			return;
		}

		this.endPressAnimation();
	}

	private handleContextMenu() {
		this.checkBoundsAfterContextMenu = true;
		this.endPressAnimation();
	}

	private setHovered(hovered: boolean) {
		this.node.toggleAttribute("data-hovered", hovered);
	}

	private setPressed(pressed: boolean) {
		this.node.toggleAttribute("data-pressed", pressed);
	}

	private determineRippleSize() {
		const { height, width } = this.node.getBoundingClientRect();
		const maxDim = Math.max(height, width);
		const softEdgeSize = Math.max(
			SOFT_EDGE_CONTAINER_RATIO * maxDim,
			SOFT_EDGE_MINIMUM_SIZE,
		);

		const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
		const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
		const maxRadius = hypotenuse + PADDING;

		this.initialSize = initialSize;
		this.rippleScale = (maxRadius + softEdgeSize) / initialSize;
		this.rippleSize = `${initialSize}px`;
	}

	private getNormalizedPointerEventCoords(pointerEvent: PointerEvent) {
		const { left, top } = this.node.getBoundingClientRect();
		const { scrollX, scrollY } = window;
		const { pageX, pageY } = pointerEvent;

		const documentX = scrollX + left;
		const documentY = scrollY + top;
		return {
			x: pageX - documentX,
			y: pageY - documentY,
		};
	}

	private getTranslationCoordinates(positionEvent?: Event) {
		const { height, width } = this.node.getBoundingClientRect();

		// End in the center
		const endPoint = {
			x: (width - this.initialSize) / 2,
			y: (height - this.initialSize) / 2,
		};

		const startPoint =
			positionEvent instanceof PointerEvent
				? this.getNormalizedPointerEventCoords(positionEvent)
				: { x: width / 2, y: height / 2 };

		// Center around start point
		startPoint.x -= this.initialSize / 2;
		startPoint.y -= this.initialSize / 2;

		return { startPoint, endPoint };
	}

	private startPressAnimation(positionEvent?: Event) {
		this.setPressed(true);
		this.growAnimation?.cancel();
		this.determineRippleSize();

		const { startPoint, endPoint } =
			this.getTranslationCoordinates(positionEvent);
		const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
		const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;

		this.growAnimation = this.node.animate(
			{
				top: [0, 0],
				left: [0, 0],
				height: [this.rippleSize, this.rippleSize],
				width: [this.rippleSize, this.rippleSize],
				transform: [
					`translate(${translateStart}) scale(1)`,
					`translate(${translateEnd}) scale(${this.rippleScale})`,
				],
			},
			{
				pseudoElement: PRESS_PSEUDO,
				duration: PRESS_GROW_MS,
				easing: EASING_STANDARD,
				fill: ANIMATION_FILL,
			},
		);
	}

	private endPressAnimation() {
		this.rippleStartEvent = undefined;
		this.state = State.INACTIVE;

		const animation = this.growAnimation;

		let pressAnimationPlayState = Infinity;
		if (typeof animation?.currentTime === "number") {
			pressAnimationPlayState = animation.currentTime;
		} else if (animation?.currentTime) {
			pressAnimationPlayState = animation.currentTime.to("ms").value;
		}

		if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
			this.setPressed(false);
			return;
		}

		setTimeout(() => {
			if (this.growAnimation !== animation) {
				// A new press animation was started. The old animation was canceled and
				// should not finish the pressed state.
				return;
			}

			this.setPressed(false);
		}, MINIMUM_PRESS_MS - pressAnimationPlayState);
	}

	/**
	 * Returns `true` if
	 *  - the ripple element is enabled
	 *  - the pointer is primary for the input type
	 *  - the pointer is the pointer that started the interaction, or will start
	 * the interaction
	 *  - the pointer is a touch, or the pointer state has the primary button
	 * held, or the pointer is hovering
	 */
	private shouldReactToEvent(event: PointerEvent) {
		if (!event.isPrimary) {
			return false;
		}

		if (
			this.rippleStartEvent &&
			this.rippleStartEvent.pointerId !== event.pointerId
		) {
			return false;
		}

		if (event.type === "pointerenter" || event.type === "pointerleave") {
			return !this.isTouch(event);
		}

		const isPrimaryButton = event.buttons === 1;
		return this.isTouch(event) || isPrimaryButton;
	}

	/**
	 * Check if the event is within the bounds of the element.
	 *
	 * This is only needed for the "stuck" contextmenu longpress on Chrome.
	 */
	private inBounds({ x, y }: PointerEvent) {
		const { top, left, bottom, right } = this.node.getBoundingClientRect();
		return left <= x && x <= right && top <= y && y <= bottom;
	}

	private isTouch({ pointerType }: PointerEvent) {
		return pointerType === "touch";
	}

	/**
	 * Used internally to handle ripple events.
	 *
	 * @private
	 */
	handleEvent(event: Event) {
		if (this.disabled || window.matchMedia("(forced-colors: active)").matches) {
			return;
		}

		switch (event.type) {
			case "click":
				this.handleClick();
				break;
			case "contextmenu":
				this.handleContextMenu();
				break;
			case "pointercancel":
				this.handlePointerCancel(event as PointerEvent);
				break;
			case "pointerdown":
				this.handlePointerDown(event as PointerEvent);
				break;
			case "pointerenter":
				this.handlePointerEnter(event as PointerEvent);
				break;
			case "pointerleave":
				this.handlePointerLeave(event as PointerEvent);
				break;
			case "pointerup":
				this.handlePointerUp(event as PointerEvent);
				break;
		}
	}

	/**
	 * Removes the event listeners added by the ripple.
	 */
	destroy() {
		for (const event of EVENTS) {
			this.parentNode.removeEventListener(event, this);
		}
	}
}
