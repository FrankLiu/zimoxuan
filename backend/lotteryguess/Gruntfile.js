module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		transport: {
		
		},
		
		concat: {
		
		},
		
		uglify: {
		
		},
		
		clean: {
			build : ['.build'] //Çå³ý.buildÎÄ¼þ
		}
	});
	
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('build',['transport','concat','uglify','clean'])
};
