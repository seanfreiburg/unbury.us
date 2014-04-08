// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function (grunt) {

    // ===========================================================================
    // CONFIGURE GRUNT ===========================================================
    // ===========================================================================
    grunt.initConfig({

        // get the configuration info from package.json ----------------------------
        // this way we can use things like name and version (pkg.name)
        pkg: grunt.file.readJSON('package.json'),

        // configure jshint to validate js files -----------------------------------
        jshint: {
            options: {
                reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
            },

            // when this task is run, lint the Gruntfile and all js files in src
            build: ['Gruntfile.js', 'assets/src/js/*.js']
        },

        uglify: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'assets/dist/js/unburyus.min.js': 'assets/src/js/*.js'
                }
            }
        },

        // compile less stylesheets to css -----------------------------------------
        sass: {
            build: {
                files: {
                    'assets/src/css/style.css': 'assets/src/css/*.scss'
                }
            }
        },

        // configure cssmin to minify css files ------------------------------------
        cssmin: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'assets/dist/css/style.min.css': 'assets/src/css/style.css'
                }
            }
        },

        clean:  {
            build: ["assets/src/css/*.css"]
        },

        // configure watch to auto update ------------------------------------------
        watch: {

            // for stylesheets, watch css and less files
            // only run less and cssmin
            stylesheets: {
                files: ['assets/dist/css/style.css', 'assets/src/css/*.scss'],
                tasks: ['sass', 'cssmin','clean']
            },

            // for scripts, run jshint and uglify
            scripts: {
                files: 'assets/src/js/*.js',
                tasks: ['jshint', 'uglify']
            }
        }

    });

    // ===========================================================================
    // LOAD GRUNT PLUGINS ========================================================
    // ===========================================================================
    // we can only load these if they are in our package.json
    // make sure you have run npm install so our app can find these
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');


    grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'cssmin','clean']);

};


