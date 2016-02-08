module.exports = {
	entry: "./src/sprite-sheet-builder.js",
	output: {
		libraryTarget: "umd",
		path: __dirname + "/dist",
		filename: "sprite-sheet-builder.js"
	},
	module: {
	  loaders: [
	    {
	      test: /\.js?$/,
	      exclude: /(dist|lib|node_modules)/,
	      loader: 'babel-loader'
	    }
	  ]
	}
}