module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    simplemocha: {
      options: {
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'tap'
      },
      all: {
        src: [
          'test/test-component-helper.js',
          'test/test-component-extensions.js',
        ]
      }
    },
  });

  grunt.registerTask('test',  ['simplemocha']);
};
