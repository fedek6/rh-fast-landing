module.exports = function (grunt) {
    const mozjpeg = require('imagemin-mozjpeg');
    let config = grunt.file.readJSON('config.json');
    let pkg = grunt.file.readJSON('package.json');
    let replacements = [
        {
            match: '{version}',
            replacement: pkg.version
        }
    ];

    // Generate replacements using config.json file
    Object.keys(config).forEach(function(key) {
        replacements.push({ match: '{' + key + '}', replacement: config[key] });
    });

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,
        // config: grunt.file.readJSON('config.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> ' +
            '<%= grunt.template.today("yyyy-mm-dd h:MM:ss") %>' +
            '*/' + "\n",
        /**
         * Paths
         */
        packages_src: 'node_modules',
        packages_dst: 'public/vendor',
        deploy_dst: 'public',

        src: 'src',

        /**
         * Copy files & strip down packages
         */
        copy: {

            /**
             * Copy only nedded files for packages dir
             */
            packages: {
                files: [
                    // jquery
                    { expand: true, cwd: '<%= packages_src %>/jquery/dist/', src: '*.js', dest: '<%= packages_dst %>/jquery/' },

                    // wowjs
                    { expand: true, cwd: '<%= packages_src %>/wowjs/', src: ['dist/*.js', 'css/**'], dest: '<%= packages_dst %>/wowjs/' },

                    // jquery.typographer
                    { expand: true, cwd: '<%= packages_src %>/jquery.typographer/dist/', src: '*.js', dest: '<%= packages_dst %>/jquery.typographer/' },

                    // js-cookie
                    { expand: true, cwd: '<%= packages_src %>/js-cookie/src/', src: '*.js', dest: '<%= packages_dst %>/js-cookie/' },

                    // Bootstrap 4
                    { expand: true, cwd: '<%= packages_src %>/bootstrap/dist/', src: '**', dest: '<%= packages_dst %>/bootstrap/' },

                    // Popper.js
                    { expand: true, cwd: '<%= packages_src %>/popper.js/dist/umd/', src: '**', dest: '<%= packages_dst %>/popper.js/' }

                    
                ]
            },

            fonts: {
                files: [
                    // Fonts
                    { expand: true, cwd: '<%= src %>/fonts/', src: '**', dest: '<%= deploy_dst %>/fonts/' }
                ]
            }
        },

        sass: {
            dist: {
                files: {
                    // Main CSS file
                    '<%= deploy_dst %>/css/main.css': '<%= src %>/scss/main.scss'
                }
            }
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    // Main CSS
                    '<%= deploy_dst %>/css/main.min.css': '<%= deploy_dst %>/css/main.css',
                }
            }
        },
        /**
         * Join JS files
         */
        concat: {
            dist: {
                options: {
                    banner: '<%= banner %>',
                    expand: true
                },
                files: {
                    '<%= deploy_dst %>/js/site.js': ['<%= src %>/js/*']

                }
            }
        },

        uglify: {
            dist: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    // Główny js
                    '<%= deploy_dst %>/js/site.min.js': '<%= deploy_dst %>/js/site.js'
                }
            }
        },

        /**
         * Imagemin
         */
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 6,
                    use: [mozjpeg({quality: 70})] // Example plugin usage                   
                },
                files: [{
                    expand: true,
                    cwd: '<%= src %>/img/',
                    src: ['*.{png,gif,jpg,svg}'],
                    dest: '<%= deploy_dst %>/img/'
                }]
            }
        },

        /**
         * Responsive images based on Bootstrap 4
         */
        responsive_images: {
            other: {
                options: {
                    quality: 70,
                    sizes: [
                        {
                            name: 'xs',
                            width: 576,
                        }, {
                            name: 'sm',
                            width: 768,
                        }, {
                            name: 'md',
                            width: 992,
                        }, {
                            name: 'lg',
                            width: 1200,
                        }, {
                            name: 'xl',
                            width: 1920,
                        }, {
                            name: 'hd',
                            width: 2560,
                        },
                        {
                            name: 'full',
                            width: 2560,
                        }
                    ]
                },
                files: [{
                    expand: true,
                    src: ['<%= src %>/img/bg/*.jpg'],
                    // cwd: 'img/bg/',
                    custom_dest: '<%= deploy_dst %>/img/bg/{%= name %}/'
                }]
            }
        },

        /**
         * Include for html
         */
        includes: {
            files: {
                src: '<%= src %>/html/index.html', // Source files
                dest: '<%= deploy_dst %>', // Destination directory
                flatten: true,
                cwd: '.',
                options: {
                    silent: true
                }
            }
        },

        /**
         * Replace tags in html
         */
        replace: {
            options: {
                patterns:  replacements
            },
            dist: {
                files: [
                    { expand: true, flatten: true, src: ['<%= deploy_dst %>/index.html'], dest: '<%= deploy_dst %>/' }
                ]
            }
        },

        /**
         * Generate favicons
         */
        favicons: {
            options: {
                // Task-specific options go here.
            },
            icons: {
                src: '<%= src %>/favicon/favicon.png',
                dest: '<%= deploy_dst %>/img/favicon/'
            },
        },

        /**
         * Watch
         */
        watch: {
            src: {
                files: ['**/*.html', '<%= src %>/scss/**/*.scss'],
                tasks: ['assets'],
                options: {
                    spawn: false,
                },
            },
        },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-favicons');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('assets', ['sass', 'concat', 'uglify', 'cssmin', 'includes', 'replace:dist']);

    grunt.registerTask('images', ['imagemin', 'responsive_images', 'favicons:icons']);

    grunt.registerTask('packages', ['copy:packages', 'copy:fonts']);

};
