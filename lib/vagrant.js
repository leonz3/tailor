'use strict';

const path = require('path');
const shell = require('shelljs');
const profile = require('./profile');

/**
 * proxy the vagrant order
 * @param  {String} order
 * @param  {String} target
 */
module.exports = (order, target) => {
	if(target){
		let vagrant_repo = profile.get('vagrant', 'repo');
		if(!vagrant_repo){
			return console.log('Error: vagrant repository path is not set');
		}
		shell.cd(vagrant_repo);
		if(order.includes('init')){
			shell.mkdir(target);
		}
		shell.cd(target);
		shell.exec(order, () => {
			shell.exit(0);
		})
	}else{
		shell.exec(order, () => {
			shell.exit(0);
		});
	}
};
