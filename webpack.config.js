const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

  webpack.Utils.addCopyRule('**/*.mp3')

	return webpack.resolveConfig();
};


