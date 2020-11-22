import "./styles.scss";
import { select } from "./utilities";
import Product from "./product";
import Cart from "./cart";
import { Notification } from "./ui";

const App = {
	init() {
		select("main.product-page") && Product.setup("PROD-1");
		Notification.setup();
		Cart.setup();
	},
};

App.init();
