'use strict';

const shell = require('shelljs');
const profile = require('./profile');

/**
 * proxy the nginx
 * @param  {String} order
 */
module.exports = (order) => {
	let nginx_path = profile.get('nginx', 'path');
	if(!nginx_path){
		return console.log('Error: nginx path is not set');
	}
	shell.cd(nginx_path);
	shell.exec(order, () => {
		shell.exit(0);
	});
};
