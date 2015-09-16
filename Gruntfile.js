module.exports = function (grunt) {
	var path = require('path');
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		notify: {
			surge: {
				options: {
					title: 'Deployment of <%= pkg.name %> successful!',
					message: 'Deployment complete.'
				}
			},
		},
		surge: {
			'jquery-ajax-contact-form': {
				options: {
					project: path.resolve(),
					domain: '<%= pkg.homepage %>'
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-surge');
	grunt.loadNpmTasks('grunt-notify');
	grunt.registerTask('deploy', [
		'surge',
		'notify:surge'
	]);
};