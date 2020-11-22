const webpack = require("webpack");
const path = require("path");

const config = {
	entry: "./src/app.js",
	output: {
		path: path.resolve(__dirname, "public"),
		filename: "app.js",
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader?url=false", "sass-loader"],
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	devServer: {
		port: 8088,
		contentBase: path.resolve(__dirname, "./public"),
		hot: true,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		clientLogLevel: "silent",
	},
};

module.exports = config;
