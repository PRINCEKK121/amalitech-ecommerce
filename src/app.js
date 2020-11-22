import "./styles.scss";
import { select } from "./utilities";
import Product from "./product";
import Cart from "./cart";

const App = {
	init() {
		select("main.product-page") && Product.setup("PROD-1");
		Cart.setup();
	},
};

App.init();
