const path = require("path");

module.exports = {
	entry: "./src/index.jsx",
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
		],
	},
	output: {
		path: path.join(__dirname + "/public"),
		publicPath: "/",
		filename: "bundle.js",
	},
};
