import { select } from "./utilities";

// UI module
export const View = {
	render(obj, renderIn) {
		return new Promise((resolve) => {
			// loop thru keys and render values as content
			for (const key in obj) {
				if (obj.hasOwnProperty(key)) {
					const value = obj[key];

					// all elements that match this key
					let toElements = renderIn.querySelectorAll(`[data-var=${key}]`);
					this.insertContentIntoDOM(renderIn, toElements, value);
				}
			}

			resolve(obj);
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

				for (const key in item) {
					if (item.hasOwnProperty(key)) {
						const value = item[key];

						// set values to data attributes
						if (config.assignDataAttr) {
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
		// console.log(toElements);

		toElements.forEach((toElement) => {
			if (toElement.matches("input, textarea")) {
				// set values for form elements
				toElement.value = toElement.dataset.pick
					? value[toElement.dataset.pick]
					: value;
			} else {
				// set innertext
				toElement.innerText = toElement.dataset.pick
					? value[toElement.dataset.pick]
					: value;
			}
		});
	},

	update(component, key, value) {
		let toElements = component.querySelectorAll(`[data-var=${key}]`);

		this.insertContentIntoDOM(component, toElements, value);
	},

	getVar(key, component = null) {
		component = component || select("body");

		// dot accessor passed as key, split and construct selector
		const keys = key.split(".");
		const element =
			keys.length > 1
				? component.querySelector(`[data-var=${keys[0]}][data-pick=${keys[1]}]`)
				: component.querySelector(`[data-var=${key}]`);

		if (element) {
			return element.matches("input, textarea")
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
