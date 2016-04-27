'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const PROFILE = path.join(process.env.USERPROFILE, '.tailconf');

/**
 * is exists profile
 * @return {Boolean}
 */
exports.isExists = () => {
	try{
		fs.statSync(PROFILE);
		return true;
	}catch(e){
		return false;
	}
}

/**
 * read profile
 * @return {String}
 */
exports.read = () => {
	try{
		let data = fs.readFileSync(PROFILE);
		return data.toString();
	}catch(e){
		return '';
	}
};

/**
 * write profile
 * @param {String} data
 */
exports.write = (data) => {
	try{
		fs.writeFileSync(PROFILE, data);
		return true;
	}catch(e){
		return false;
	}
};

/**
 * get config content
 * @param {String} item
 * @param {String|Array} key
 * @return {String|Object}
 */
exports.get = (item, keys) => {
	if(!this.isExists()){
		return '';
	}
	let data = this.read();
	let getValue = (key) => {
		let regexp = new RegExp(`\\[${item}\\][^\\[]*${key}\\=(\\S+)`);
		let matched = data.match(regexp);
		return matched? matched[1]: '';
	};
	if(util.isArray(keys)){
		return keys.reduce((res, key) => {
			res[key] = getValue(key);
			return res;
		}, {});
	}
	return getValue(keys);
};

/**
 * set config content
 * @param  {String} item
 * @param  {String} content
 */
exports.set = (item, content) => {
	let data = '';
	if(!this.isExists()){
		data = `[${item}]\n\t${content}\n`;
	}else{
		data = this.read();
		if(data.includes(`[${item}]`)){
			let key = content.split('=')[0];
			let regexp = new RegExp(`(\\[${item}\\][^\\[]*)(${key}\\=\\S+)`);
			let has_configured = data.match(regexp);
			if(has_configured){
				data = data.replace(regexp, `$1${content}`);
			}else{
				data = data.replace(`[${item}]`, `[${item}]\n\t${content}`);
			}
		}else{
			data += `[${item}]\n\t${content}\n`;
		}
	}
	this.write(data);
};

/**
 * delete config content
 * @param  {String} item
 * @param  {String} key
 */
exports.remove = (item, key) => {
	if(this.isExists()){
		let data = this.read();
		if(key){
			let regexp = new RegExp(`(\\[${item}\\][^\\[]*)(${key}\\S*\\s+)`);
			data = data.replace(regexp, `$1`);
		}else{
			let regexp = new RegExp(`\\[${item}\\][^\\[]*`);
			data = data.replace(regexp, ``);
		}
		this.write(data);
	}
};

/**
 * log settings
 * @param  {String} item
 * @param  {String} key
 */
exports.log = (item, key) => {
	let data = this.read();
	if(item){
		let matched = data.match(new RegExp(`\\[${item}\\]\\s([^\\[]*)`));
		if(matched){
			data = matched[1];
		}
	}
	if(key){
		let matched = data.match(new RegExp(`${key}\\=(\\S*)`));
		if(matched){
			data = matched[1];
		}
	}
	console.log(data);
};
