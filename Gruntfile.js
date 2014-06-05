module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-hull-components');

  var config = grunt.file.readYAML('config.yml');
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({

    hull_components: {
      options: {
        sourceName: pkg.hull.componentSourceName,
        config: config,
        optimize: !grunt.option('dev')
      },
      src: {
        src: 'src',
        dest: 'dist'
      }
    },

    watch: {
      components: {
        files: ['src/**/**', 'config.yml'],
        tasks: ['hull_components']
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: 'dist/'
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
    }

  });
  grunt.registerTask('build', ['hull_components']);
  grunt.registerTask('default', ['connect:server', 'hull_components', 'watch']);
  grunt.registerTask('dist', ['hull_components', 'gh-pages']);
};