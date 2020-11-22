// Cart module
import { select, selectAll, wait } from "./utilities";
import { View, Notification } from "./ui";

const Cart = {
	setup() {
		this.updateCount();
		this.mini.setup();

		const orderSummary = select(".order-summary");

		selectAll("table.cart .cart-item:not(.template)").forEach((node) => {
			node.parentNode.removeChild(node);
		});

		select("table.cart .cart-item") &&
			View.renderList(this.getCart(), select("table.cart .cart-item"), {
				// mounted hook for each item
				mounted(product, index) {
					View.getRef("name", this).href = `/?productId=${product.id}`;

					// update product image
					this.querySelector(
						".img"
					).style.backgroundImage = `url(${product.image})`;

					this.querySelector(".actions .del").addEventListener("click", (e) => {
						e.preventDefault();

						const sure = confirm(
							"Are you sure you want to remove this item from cart ?"
						);
						// if sure remove from cart
						sure && Cart.removeItem(index);
					});

					// Initialize quantity controls
					const quantityField = this.querySelector(".quantity-field");

					this.querySelectorAll(".quantity-selector .ctrl").forEach((ctrl) => {
						ctrl.addEventListener("click", () => {
							let value = parseInt(quantityField.value);

							switch (ctrl.dataset.function) {
								case "add":
									quantityField.value = ++value;
									break;

								case "sub":
									if (value > 1) quantityField.value = --value;
									break;
							}

							// Update item in storage
							Cart.updateItem(index, {
								quantity: quantityField.value,
							});

							if (Cart.appliedPromoCode) {
								wait(800).then(() => {
									// Update discount value
									View.update(
										"discount",
										View.getVar("sub-total") / 2,
										orderSummary
									);

									// Reapply discount
									View.update(
										"total-checkout",
										View.getVar("sub-total") / 2,
										orderSummary
									);
								});
							}
						});
					});
				},
			}).then((products) => {
				console.log("after list render");
				// update sub total value
				View.update(
					"sub-total",
					products.length
						? products
								.map((p) => p.total)
								.reduce((acc, cur) => {
									return acc + cur;
								})
						: 0,
					orderSummary
				);

				// Update total checkout value
				View.update(
					"total-checkout",
					parseFloat(View.getVar("sub-total", orderSummary)),
					orderSummary
				);
			});

		select(".apply-code-btn") &&
			select(".apply-code-btn").addEventListener("click", (e) => {
				e.preventDefault();

				Cart.applyPromoCode(View.getVar("promo-code"))
					.then(() => {
						Notification.send(
							"Promo code applied succefully, you have 50% discount on all products!"
						);
						// reset promo code
						View.update("promo-code", "", orderSummary);

						// Update discount value
						View.update("discount", View.getVar("sub-total") / 2, orderSummary);
					})
					.catch(() => {
						// Get element and add error class
						View.getRef("promo-code").classList.add("error");
						Notification.send("Invalid code");
					});
			});
	},

	updateCount() {
		let storedProducts = JSON.parse(localStorage.getItem("products"));
		select("#cart-count").innerText = storedProducts.length;

		select(".cart-page") &&
			View.update("cart-count", storedProducts.length, select(".cart-page"));
	},

	mini: {
		component: select(".mini-cart"),

		setup() {
			// Intialize close button
			if (this.component) {
				this.component
					.querySelector(".close-cart")
					.addEventListener("click", () => {
						this.component.classList.remove("show");
						select(".overlay").classList.remove("show");
					});
			}
		},

		async show(product) {
			await View.render(product, this.component);

			View.update("prod-total", product.total, this.component);

			// update product image
			this.component.querySelector(
				".img"
			).style.backgroundImage = `url(${product.image})`;

			// show mini cart
			this.component.classList.add("show");
			select(".overlay").classList.add("show");
		},
	},

	getCart() {
		let products = [];
		const storedProducts = localStorage.getItem("products");

		if (storedProducts) {
			products = JSON.parse(storedProducts);
		}

		return products;
	},

	removeItem(index) {
		let storedProducts = JSON.parse(localStorage.getItem("products"));

		storedProducts.splice(index, 1);
		localStorage.setItem("products", JSON.stringify(storedProducts));

		// force cart rerender
		this.setup();
	},

	appliedPromoCode: false,

	async applyPromoCode(code) {
		code = code.trim();

		const regex = /^[a-z0-9]+$/i;
		const valid = code.match(regex); // check validity

		return new Promise((resolve, reject) => {
			if (this.appliedPromoCode) {
				reject(code);
				return;
			}

			if (code.length === 5 && valid) {
				this.appliedPromoCode = true;

				View.update(
					"total-checkout",
					View.getVar("total-checkout") / 2,
					select(".order-summary")
				);

				resolve(code);
			} else {
				reject(code);
			}
		});
	},

	async updateItem(index, config = {}) {
		const products = this.getCart();
		products[index].customization.quantity = config.quantity;

		products[index].total =
			parseFloat(products[index].price.amount) *
			parseInt(products[index].customization.quantity);

		localStorage.setItem("products", JSON.stringify(products));

		// force cart rerender
		this.setup();
	},
};

export default Cart;
