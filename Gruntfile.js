var path = require('path');

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-obfuscator');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    manifest: grunt.file.readJSON('extension/manifest.json'),

    clean: [ '.tmp' ],

    jshint: {
      files: ['Gruntfile.js', 'extension/js/**/*.js', '!extension/js/jquery.js' ],
      options: {
        curly: false,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        expr: true,
        globals: {
          // AMD
          module: true,
          require: true,
          // Environments
          console: true,
          // General Purpose Libraries
          $: true,
          jQuery: true,
          fabric: true,
          // Extension
          chrome: true
        }
      }
    },

    mocha: {
      test: {
        src: ['tests/**/*.html'],
      },
    },

    copy: {
      copy_assets: {
        expand: true,
        flatten: true,
        src: [ 'extension/assets/*.png' ],
        dest: 'ext/assets'
      }
    },

    uglify: {
      js: {
        options: {
          mangle: true,
          compress: {
            drop_console: true
          }
        },
        files: {
          'ext/nbs.js': [ '.tmp/nbs.js' ]
        }
      }
    },

    concat: {
      basic_and_extras: {
        files: {
          '.tmp/nbs.js': [ 'extension/js/jquery.js', 'extension/js/app.js' ],
        }
      },
    },

    cssmin: {
      compile: {
        expand: true,
        flatten: true,
        files: {
          'ext/nbs.css' : 'extension/css/*.css'
        }
      }
    },

    imagemin: {
      png: {
        options: {
          optimizationLevel: 7
        },
        files: [
          {
            expand: true,
            cwd: './assets/',
            src: ['**/*.png'],
            dest: './ext/assets/',
            ext: '.png'
          }
        ]
      }
    }
  });

  grunt.registerTask('updateManifest', function (key, value) {
    var src = 'extension/manifest.json';
    var dest = 'ext/manifest.json';

    if (!grunt.file.exists(src)) {
      grunt.log.error("file " + src + " not found");
      return true;
    }
    var manifest = grunt.file.readJSON(src);
    grunt.log.error('version: ' + manifest.version);
    // content_scripts/js
    manifest.content_scripts[0].js = ["nbs.js"];
    // content_scripts/css
    manifest.content_scripts[0].css = ["nbs.css"];

    // web_accessible_resources
    manifest.web_accessible_resources = ["nbs.js"];

    grunt.file.write(dest, JSON.stringify(manifest, null, 2));
  });

  grunt.registerTask('test', [ 'jshint', 'mocha' ]);

  grunt.registerTask('default',
    [
      // Test
      'jshint', 'mocha',
      // Arrange
      'copy', 'concat',
      // Minify
      'uglify', 'cssmin',
      //Build
      'updateManifest',
      'clean'
    ]);
};
