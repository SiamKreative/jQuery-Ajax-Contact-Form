module.exports = function (grunt) {
	var path = require('path');
	var banner = '/*!\n* <%= pkg.name %> - v<%= pkg.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'* <%= pkg.repository.url %>\n' +
		'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
		'<%= pkg.author %>; Licensed MIT\n*/\n';

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
		},
		uglify: {
			options: {
				mangle: true,
				banner: banner
			},
			'jquery-ajax-contact-form': {
				files: {
					'js/<%= pkg.name %>.min.js': ['<%= pkg.main %>']
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-surge');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['uglify']);
	grunt.registerTask('deploy', [
		'uglify',
		'surge',
		'notify:surge'
	]);
};