/* jshint node:true */

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: true
      },
      all: ['Gruntfile.js', 'hours.js', 'test/*.js']
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
      },
      build: {
        src: 'hours.js',
        dest: 'dest/<%= pkg.name %>.min.js'
      }
    },

    nodeunit: {
      all: ['test/*.js']
    }

  });

  // Plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Tasks
  grunt.registerTask('default', ['jshint', 'uglify']);
  grunt.registerTask('test', ['default', 'nodeunit']);

};
