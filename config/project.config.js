
exports.templates = {
	static: {
		assets: {
			css: null,
			font: null,
			js: null,
			img: null
		},
		templates: null,
		views: null
	},
	node: {
		assets: {
			css: null,
			font: null,
			js: null,
			img: null
		},
		controllers: null,
		filters: null,
		models: null,
		services: null,
		utils: null,
		views: null
	}
};

exports.paths = {
	css: 'assets/css',
	es6: 'assets/es6',
	html: 'views',
	img: 'assets/img',
	js: 'assets/js',
	less: 'assets/less',
	sass: 'assets/sass',
	release: [
		'!*.log',
		'!(dev|npm|temp)**',
		'!(dev|npm|temp)*/!(es6|less|sass)*',
		'!(dev|npm|temp)*/!(es6|less|sass)*/**'
	]
};
