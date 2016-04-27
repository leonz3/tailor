#!/usr/bin/env node

'use strict';

const yargs = require('yargs');

const profile = require('../lib/profile');
const project = require('../lib/project');
const vagrant = require('../lib/vagrant');
const nginx = require('../lib/nginx');


yargs
	.command(
		'set',
		'set the tailor',
		{},
		(argv) => {
			let item = argv._[1];
			let content = argv._[2];
			profile.set(item, content);
		}
	)
	.command(
		'unset',
		'cancel set',
		{},
		(argv) => {
			let item = argv._[1];
			let key = argv._[2];
			profile.remove(item, key)
		}
	)
	.command(
		'log',
		'log settings',
		{},
		(argv) => {
			let item = argv._[1];
			let key = argv._[2];
			profile.log(item, key);
		}
	)
	.command(
		'vagrant',
		'proxy the vagrant',
		{},
		(argv) => {
			let order = argv._.join(' ');
			let target = argv.t;
			vagrant(order, target);
		}
	)
	.command(
		'nginx',
		'proxy the nginx',
		(argv) => {
			let order = process.argv.splice(2).join(' ');
			nginx(order);
		}
	)
	.command(
		'create',
		'create new project',
		{},
		(argv) => {
			let name = argv._[1];
			let tmpl = argv.static ? 'static'
				: argv.node ? 'node'
				: '';
			let css = argv.sass ? 'sass'
				: argv.less ? 'less'
				: '';
			let js = argv.es6 ? 'es6' : '';
			project.create(name, tmpl, css, js);
		}
	)
	.command(
		'add',
		'add existed project from local or remote',
		{},
		(argv) => {
			let name = argv._[1];
			let url = argv._[2] || '';
			project.add(name, url);
		}
	)
	.command(
		'remove',
		'remove project',
		{},
		(argv) => {
			let name = argv._[1];
			let isForce = argv.f === true;
			project.remove(name, isForce);
		}
	)
	.command(
		'use',
		'use a project',
		{},
		(argv) => {
			let name = argv._[1];
			project.use(name);
		}
	)
	.command(
		'sass',
		'compile sass to css',
		{},
		(argv) => {
			//output style [nested | expanded | compact | compressed]
			let style = argv.style || 'nested';
			project.sass(style);
		}
	)
	.command(
		'less',
		'compile less to css',
		{},
		project.less
	)
	.command(
		'webpack',
		'compile js(eg: es6)',
		{},
		project.webpack
	)
	.command(
		'compress',
		'compress css or js or both',
		{},
		(argv) => {
			let type = argv.css ? 'css'
				: argv.js ? 'js'
				: 'both';
			project.compress(type);
		}
	)
	.command(
		'zip',
		'pack the project to zip file',
		{},
		(argv) => {
			project.zip(argv._[1]);
		}
	)
	.command(
		'watch',
		'watch project file change',
		{},
		(argv) => {
			project.watch(argv._[1]);
		}
	)
	.command(
		'server',
		'run a local server',
		{},
		(argv) => {
			project.server(argv._[1]);
		}
	)
	.argv;
