module.exports = function(grunt){
	
	//Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['src/**/*.js'],
				dest: 'dist/<%=pkg.name%>.js'
			}
		},
		
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				mangle: {
					except: ['jQuery', 'Backbone']
				},
				compress: {
					drop_console: true
				}
			},
			dist: {
				files: {
					'dist/<%=pkg.name%>.min.js': ['<%=concat.dist.dest%>']
				}
			}
		},
		
		qunit: {
			files: ['test/**/*.html']
		},
		
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
			options: {
				globals: {
				  jQuery: true,
				  console: true,
				  module: true,
				  document: true
				}
			}
		},
		
		watch: {
			files: ['<%=jshint.files%>'],
			tasks: ['jshint', 'qunit']
		}
	});
	
	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
  
	grunt.registerTask('test', ['jshint', 'qunit']);
	grunt.registerTask('test2', ['concat', 'uglify']);
	
	//Default task(s).
	grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
};
