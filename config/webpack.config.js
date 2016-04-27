'use strict';

const fs = require('fs');
const path = require('path');

const webpack = require('webpack');

var getEntries = (dir) => {
	try{
		let files = fs.readdirSync(dir);
		if(!files.length) return;
		let regexp = /(.*)\.js$/;
		let result = files.reduce((memo, file) => {
			let matched = file.match(regexp);
			if(matched){
				memo[matched[1]] = path.join(dir, file);
			}
			return memo;
		}, {});
		return result;
	}catch(e){
		return {};
	}
};

module.exports = (project) => {
	let dir = path.join(project.repo, project.dir);
	return {
		// context: project.repo,
		entry: getEntries(path.join(dir, project.paths.es6)),
		output: {
			path: path.join(dir, project.paths.js),
			filename: '[name].js'
		},
		resolve: {
			extensions: ['','.js','.json', '.jsx', '.es6', 'css'],
			alias: {
				libs: project.lib
			},
			// root: [path.join(project.repo, project.dir, 'assets')]
		},
		plugin:[
			// new webpack.optimize.CommonsChunkPlugin({
			// 	name: ['jQuery', 'React', 'Vue'],
			// 	minChunk:Infinity
			// })
	       // new webpack.ResosverPlugin(
	       //     new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('package.json', ['dependencies'])
	       // )
	   ],
		module: {
			loaders: [{
					test: /\.js$/,
					loader: 'babel',
					query: {
						presets: ['es2015']
					}
				}
				// { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
				// { test: /\.css$/, loader: 'style-loader!css-loader' },
				// { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
			]
		},
		devtool: "#inline-source-map"
	};
};
