 interface ColliderListener {

	/**
	 * Handle a collision event, called when two interactable HitBoxes
	 * collide.
	 * @param evt The collision event.
	 */
	collision(evt:ColliderEvent);

	/**
	 * Handle a separation event, called when two interactable HitBoxes
	 * separate.
	 * @param evt The separation event.
	 */
	separation(evt:ColliderEvent);
}