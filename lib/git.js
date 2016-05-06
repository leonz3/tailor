'use strict';

const path = require('path');
const shell = require('shelljs');
const profile = require('./profile');

/**
 * proxy the git
 * @param  {String} order
 */
module.exports = (order) => {
	let config = profile.get('project', ['repo', 'dir']);
	shell.cd(path.join(config.repo, config.dir));
	shell.exec(order);
};
