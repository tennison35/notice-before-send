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
    pkg: 'package.json',
    manifest: 'manifest.json',
    testFolder: 'test',
    src: 'extension',
    dest: 'ext',
    tmp: '.tmp',

    clean: [ '<%=tmp %>' ],

    jshint: {
      files: ['Gruntfile.js', '<%=src %>/js/**/*.js', '!<%=src %>/js/jquery.js' ],
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
      all: {
        src: [
          // 'test/onPageMessagePage-noReply-notActive-noContact.html',
          '<%=testFolder %>/test.html',
        ],
        options: {
          reporter: 'Spec',
          run: true,
          log: true
        },
      },
    },

    copy: {
      copy_assets: {
        expand: true,
        flatten: true,
        src: [ '<%=src %>/assets/*.png' ],
        dest: '<%=dest %>/assets'
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
          '<%=dest %>/nbs.js': [ '<%=tmp %>/nbs.js' ]
        }
      }
    },

    concat: {
      basic_and_extras: {
        files: {
          '<%=tmp %>/nbs.js': [ '<%=src %>/js/jquery.js', '<%=src %>/js/app.js' ],
        }
      },
    },

    cssmin: {
      compile: {
        expand: true,
        flatten: true,
        files: {
          '<%=dest %>/nbs.css' : '<%=src %>/css/*.css'
        }
      }
    }
  });

  grunt.registerTask('updateRev', function (key, value) {
    var manifestPath = grunt.config.get('src') + '/' + grunt.config.get('manifest');
    var pkgPath = grunt.config.get('pkg');
    var manifest = grunt.file.readJSON( manifestPath );
    var pkg = grunt.file.readJSON( pkgPath );

    var verison = manifest.version;
    grunt.config('verison', verison);

    pkg.version = verison;

    grunt.file.write(pkgPath, JSON.stringify(pkg, null, 2));
  });

  grunt.registerTask('updateManifest', function (key, value) {
    var src = grunt.config.get('src') + '/' + grunt.config.get('manifest');
    var dest = grunt.config.get('dest') + '/' + grunt.config.get('manifest');

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
      // Arrange
      'copy', 'concat',
      // Minify
      'uglify', 'cssmin',
      //Build
      'updateManifest',
      'updateRev',
      'clean'
    ]);
};
