'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const util = require('util');
const shell = require('shelljs');
const moment = require('moment');
const lodash = require('lodash');
const gulp = require('gulp');
const zip = require('gulp-zip');
const sass = require('gulp-sass');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const tinypng = require('gulp-tinypng');
const cleancss = require('gulp-clean-css');
const sourcemap = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const webpack = require('webpack');

const profile = require('./profile');

require('babel-loader');

var project_config = Object.assign(require('../config/project.config'), profile.get('project', ['repo', 'lib', 'dir']));
if(!project_config.repo){
	project_config.repo = process.env.USERPROFILE;
}
var webpack_config = require('../config/webpack.config')(project_config);

/**
 * is the project existed
 * @param  {String} name
 * @return {Boolean}
 */
var isProjectExisted = (name) => {
	let data = profile.read();
	let regexp = new RegExp(`\\[project_list\\]\\s+([\\S\\s]*?)\\n(?:\\[|$)`);
	let matched = data.match(regexp);
	if(matched){
		let list = matched[1].split('\n\t');
		return !!~list.indexOf(name);
	}
	return false;
};

/**
 * create new project
 * @param  {String} name
 * @return {String} tmpl
 * @return {String} css
 * @return {String} js
 */
exports.create = (name, tmpl, css, js) => {
	if(!name){
		return console.log('Error: hasn\'t input project name!');
	}
	if(!tmpl){
		return console.log('Error: hasn\'t input project template type');
	}
	let project_path = path.join(project_config.repo, name);
	let template = project_config.templates[tmpl];
	if(css) lodash.merge(template, JSON.parse(`{
		"assets": {
			"${css}": {
				"partials": null
			}
		}
	}`));
	if(js) lodash.merge(template, JSON.parse(`{
		"assets": {
			"${js}": {
				"plugins": null
			}
		}
	}`));
	fs.stat(project_path, (err, stat) => {
		if(stat && stat.isDirectory()){
			return console.log(`Error: there is existed a project named ${name}!`);
		}
		let touch = (dirs, pwd) => {
			if(util.isArray(dirs)){
				dirs.forEach((file) => {
					fs.writeFile(path.join(pwd, file), '', (err) => {
						if(err){
							console.log(`Error: touch ${item} failed!`);
						}
					});
				});
			}else{
				for(let k of Object.keys(dirs)){
					((name, content) => {
						fs.mkdir(path.join(pwd, name), (err) => {
							if(err) return console.log(`Error: mkdir ${name} failed!`);
							if(content) touch(content, path.join(pwd, name));
						});
					})(k, dirs[k]);
				}
			}
		};
		fs.mkdir(project_path, (err) => {
			if(err){
				return console.log('Error: create project failed!');
			}
			touch(template, project_path);
			profile.set('project_list', name);
		});
	});
};

/**
 * add project
 * @param {String} name
 * @param {String} url
 */
exports.add = (name, url) => {
	if(isProjectExisted(name)){
		return console.log(`Error: there is existed a project named ${name}!`);
	}
	if(url){
		shell.cd(project_config.repo);
		shell.exec(`git clone ${url} ${name}`, () => {
			profile.set('project_list', name);
			shell.exit(0);
		});
	}else{
		profile.set('project_list', name);
	}
};

/**
 * remove
 * @param {String} name
 * @param {Boolean} isForce
 */
exports.remove = (name, isForce) => {
	profile.remove('project_list', name);
	if(isForce){
		shell.cd(project_config.repo);
		shell.exec(`rm -rf ${name}`);
		shell.exit(0);
	}
};

/**
 * use project
 * @param  {String} name
 */
exports.use = (name) => {
	if(!isProjectExisted(name)){
		return console.log(`Error: there is no project named ${name}`);
	}
	profile.set('project', `dir=${name}`);
	project_config.dir = name;
	this.log();
};

/**
 * log current project
 */
exports.log = () => {
	console.log(`Info: current project is ${profile.get('project', 'dir')}`);
};

/**
 * sass to css
 */
exports.sass = (style) => {
	let dir = path.join(project_config.repo, project_config.dir);
	return gulp.src(path.join(dir, project_config.paths.sass, '*.scss'))
		.pipe(sourcemap.init())
		.pipe(sass({
			includePaths: project_config.lib,
			// outputStyle: style
		}).on('error', sass.logError))
		.pipe(postcss([autoprefixer]))
		.pipe(sourcemap.write())
		.pipe(gulp.dest(path.join(dir, project_config.paths.css)));
};

/**
 * less to css
 */
exports.less = () => {
	let dir = path.join(project_config.repo, project_config.dir);
	return gulp.src(path.join(dir, project_config.paths.less, '*.less'))
		.pipe(sourcemap.init())
		.pipe(less({
			paths: project_config.lib
		}))
		.pipe(postcss([autoprefixer]))
		.pipe(sourcemap.write())
		.pipe(gulp.dest(path.join(dir, project_config.paths.css)));
};

/**
 * es6 to es5
 */
exports.webpack = () => {
	return webpack(webpack_config, (err) => {
		if(err) console.log(err);
	});
};

/**
 * compress file(css or js or both)
 * @param {String} type [css | js | both]
 */
exports.compress = (type) => {
	this.log();
	let dir = path.join(project_config.repo, project_config.dir);
	if(type === 'css' || type === 'both'){
		gulp.src(path.join(dir, project_config.paths.css, '*.css'))
			.pipe(cleancss({
				keepBreaks: true
			}))
			.pipe(gulp.dest(path.join(dir, project_config.paths.css)));
	}
	if(type === 'js' || type === 'both'){
		gulp.src(path.join(dir, project_config.paths.js, '*.js'))
			.pipe(uglify())
			.pipe(gulp.dest(path.join(dir, project_config.paths.js)));
	}
};

/**
 * compress img by tinypng
 */
exports.tinypng = () => {
	let tinykey = profile.get('tinypng', 'key');
	let dir = path.join(project_config.repo, project_config.dir);
	return gulp.src(path.join(dir, project_config.paths.img))
		.pipe(tinypng(tinykey))
		.pipe(gulp.dest(path.join(dir, project_config.paths.img)));
};

/**
 * pack project to zip file
 */
exports.zip = (name) => {
	this.log();
	let project = project_config.dir;
	if(name){
		if(!isProjectExisted(name)){
			return console.log(`Error: there is no project named ${name}`);
		}
		project = name;
	}
	return gulp.src(project_config.paths.release.map(i => path.join(project_config.repo, project, i)))
		.pipe(zip(project + moment().format('-YYYYMMDDHHmm') + '.zip'))
		.pipe(gulp.dest(project_config.repo));
};

/**
 * watch project file change
 */
exports.watch = (name) => {
	this.log();
	let project = project_config.dir;
	if(name){
		if(!isProjectExisted(name)){
			return console.log(`Error: there is no project named ${name}`);
		}
		project = name;
	}
	[{
		type: 'sass', handler: this.sass
	}, {
		type: 'less', handler: this.less
	}, {
		type: 'es6', handler: this.webpack
	}
	// , {
	// 	type: 'html', handler: this.reload
	// }
	].forEach((item) => {
		((type, handler) => {
			fs.stat(path.join(project_config.repo, project, project_config.paths[type]), (err) => {
				if(!err){
					gulp.watch(path.join(project_config.repo, project, project_config.paths[type], '**'), handler)
				}
			});
		})(item.type, item.handler);
	});

};

/**
 * run a local server
 * @param  {String} name
 */
exports.server = (name) => {
	this.log();
	let project = project_config.dir;
	if(name){
		if(!isProjectExisted(name)){
			return console.log(`Error: there is no project named ${name}`);
		}
		project = name;
	}
	// let ip = (() => {
	// 	let interfaces = os.networkInterfaces();
	// 	for(let k in interfaces){
	// 		//exclude ip about virtual-machine
	// 		if(!/(host-only)|(virtual)/i.test(k)){
	// 			let inter = interfaces[k];
	// 			console.log(inter);
	// 			for (let i = inter.length - 1; i >= 0; i--) {
	// 				if(inter[i].family === 'IPv4' && inter[i].address !== '127.0.0.1' && !inter.internal){
	// 					return inter[i].address
	// 				}
	// 			}
	// 		}
	// 	}
	// })();
	browserSync.init({
		// proxy: ip,
		server: {
			baseDir: path.join(project_config.repo, project),
			directory: true
		}
	});
};
