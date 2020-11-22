import Cart from "./cart";
import { View } from "./ui";
import { select, selectAll, activateThisIn } from "./utilities";
const productsData = require("./products.json");

const Product = {
	product: null,

	async setup(id) {
		// Fetch product
		this.product = this.fetch(id);

		await View.render(this.product, select(".prod-details-wrap .prod-desc"));

		await View.renderList(
			this.product.colors,
			select(".prod-details-wrap .color-picker .cl"),
			{
				assignDataAttr: true,
				mounted(color) {
					this.style.backgroundColor = color.hex;
				},
			}
		);

		await View.renderList(
			this.product.sizes,
			select(".prod-details-wrap .size-picker .sz"),
			{
				assignDataAttr: true,
			}
		);

		// Initialize size picker
		const sizeSelectors = selectAll(".size-picker .sz");

		sizeSelectors.forEach((selector) => {
			selector.addEventListener("click", () => {
				activateThisIn(selector, ".sz");
			});
		});

		// Initialize quantity selector
		const quantityField = select("#quantity-field");

		selectAll(".quantity-selector .ctrl").forEach((ctrl) => {
			ctrl.addEventListener("click", () => {
				let value = new Number(quantityField.value);

				switch (ctrl.dataset.function) {
					case "add":
						quantityField.value = ++value;
						break;

					case "sub":
						if (value > 1) quantityField.value = --value;
						break;
				}
			});
		});

		// Initialize color selector
		const colorSelectors = selectAll(".color-picker .cl");

		colorSelectors.forEach((selector) => {
			selector.addEventListener("click", () => {
				activateThisIn(selector, ".cl");

				select("#prod-color-text").innerText = selector.dataset.text;
			});
		});

		// Initialize add to cart button
		select("#add-to-cart-btn").addEventListener("click", () => {
			this.addToCart();
		});
	},

	fetch(id) {
		// Attempt to fetch product by id from localstorage
		return (productsData || []).find((product) => product.id === id);
	},

	addToCart() {
		const selectedSize = select(".size-picker > .sz.active"),
			selectedColor = select(".color-picker .cl.active");

		if (!selectedColor) {
			window.alert("Please select color");
			return;
		}

		if (!selectedSize) {
			window.alert("Please select size");
			return;
		}

		let products = [];
		const storedProducts = localStorage.getItem("products");

		if (storedProducts) {
			products = JSON.parse(storedProducts);
		}

		// add if only product is not already in cart
		if (!products.find((product) => product.id === this.product.id) || true) {
			this.product.customization = {
				size: select(".size-picker > .sz.active").dataset.text,
				quantity: select("#quantity-field").value,
				color: select(".color-picker .cl.active").dataset.text,
			};

			this.product.total =
				parseFloat(this.product.price.amount) *
				parseInt(this.product.customization.quantity);

			products.push(this.product);
			localStorage.setItem("products", JSON.stringify(products));

			Cart.updateCount();
			Cart.mini.show(this.product);
		}
	},
};

export default Product;
