/**
 * Returns the first Element within the document that matches the specified selector, or group of selectors
 *
 * @param {String} selector The node to activate
 *
 * @return NodeList<HTMLElement> | null
 */
export function select(selector) {
	return document.querySelector(selector);
}

/**
 * Returns a static (not live) NodeList representing a list of the document's elements that match the specified group of selectors.
 *
 * @param {String} selector The node to activate
 *
 * @return NodeList<HTMLElement>
 */
export function selectAll(selector) {
	return document.querySelectorAll(selector);
}

/**
 * Sets a timer which executes a callback once after the timer expires.
 *
 * @param  {Number} time
 * @returns Promise<void>
 */
export function wait(time) {
	return new Promise((resolve, reject) => {
		window.setTimeout(function () {
			resolve();
		}, time);
	});
}

/**
 * Activate a node among its siblings
 *
 * @param {HTMLElement} target The node to activate
 * @param {String} selector Family class name to search
 * @param {String} activeClassName  Class name to use to activate
 *
 * @return void
 */
export function activateThisIn(
	target,
	selector,
	activeClassName,
	parentSelector = null
) {
	var active = getParentNode(target, parentSelector).querySelector(
		selector + "." + (activeClassName || "active")
	);

	if (active) active.classList.remove(activeClassName || "active");
	target.classList.add(activeClassName || "active");
}

/**
 * Get the parent node we need as 'this' if target is a child of 'parent node'
 *
 * @param  {HTMLElement} target
 * @param  {String} selector
 *
 * @return HTMLElement
 */
export function getParentNode(target, selector) {
	var node = target.parentNode;

	if (selector == null) return node;
	else {
		if (node.matches(selector)) return node;
		else return node.matches("body") ? null : getParentNode(node, selector);
	}
}

// Check for empty inputs
export function checkEmptyInputs(nodes) {
	var empty = false;

	nodes.forEach(function (node, index) {
		if (node.value == "") {
			Velocity(node, "callout.shake", {
				duration: 400,
			});
			empty = true;
		}
	});
	return empty;
}

export function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, "+")
		.replace(/_/g, "/");
	const rawData = window.atob(base64);
	return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

// Notify user of message
export function notify(message) {
	M.toast({
		html: message,
	});
}

/**
 * Get the absolute url for a resource
 *
 * @param  {String} action
 *
 * @return String
 */
export function getURL(action) {
	return select("input[data-resource='" + action + "']").value;
}

/**
 * Capitalize the string making first letter uppper case
 *
 * @param {String} string
 *
 * @return String
 */
export function capitalize(string) {
	return string[0].toUpperCase() + string.slice(1);
}
