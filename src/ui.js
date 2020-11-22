import { select, wait } from "./utilities";

// UI module
export const View = {
	render(model, renderIn) {
		return new Promise((resolve) => {
			// all elements that match this key
			let dataElements = renderIn.querySelectorAll(`[data-var]`);

			/**
			 * Get value from object using string property accessor
			 *
			 * @param obj Object from which to get property
			 * @param str String property accessor
			 *
			 * @returns {any}
			 */
			function ref(obj, str) {
				return str.split(".").reduce(function (o, x) {
					return o ? o[x] : "";
				}, obj);
			}

			dataElements.forEach((element) => {
				const value = ref(model, element.dataset.var);
				this.insertContentIntoDOM(renderIn, [element], value);
			});

			resolve(model);
		});
	},

	async renderList(array, component, config) {
		config = Object.assign(
			{
				onDataAttr: false,
			},
			config
		);

		return new Promise((resolve) => {
			array.forEach((item, index) => {
				// create a copy of the component and insert in its parent node
				let copy = component.cloneNode(true);
				copy.classList.remove("template");

				// set values to data attributes
				if (config.assignDataAttr) {
					for (const key in item) {
						if (item.hasOwnProperty(key)) {
							const value = item[key];
							copy.setAttribute(`data-${key}`, value);
						}
					}
				}

				this.render(item, copy).then(() => {
					component.parentNode.insertAdjacentElement("beforeend", copy);

					if (config.mounted && typeof config.mounted == "function") {
						// call mounted hook
						config.mounted.call(copy, item, index);
					}
				});
			});

			resolve(array);
		});
	},

	insertContentIntoDOM(renderIn, toElements, value) {
		toElements.forEach((toElement) => {
			if (toElement.matches("input, textarea, select")) {
				// set values for form elements
				toElement.value = value;
			} else {
				// set innertext
				toElement.innerText = value;
			}
		});
	},

	update(key, value, component) {
		let toElements = component.querySelectorAll(`[data-var=${key}]`);

		this.insertContentIntoDOM(component, toElements, value);
	},

	getVar(key, component = null) {
		component = component || select("body");
		const element = component.querySelector(`[data-var=${key}]`);

		if (element) {
			return element.matches("input, textarea, select")
				? element.value
				: element.innerText;
		}
		return element;
	},

	getRef(key, component = null) {
		return component
			? component.querySelector(`[data-var=${key}]`)
			: select(`[data-var=${key}]`);
	},
};

export const Notification = {
	setup() {
		!select(".notification") &&
			document.body.insertAdjacentHTML(
				"beforeend",
				"<div class='notification'></div>"
			);
	},

	send(message) {
		const component = select(".notification");
		component.innerText = message;

		component.classList.add("show");

		wait(3500).then(() => {
			component.classList.remove("show");
		});
	},
};
