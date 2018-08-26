module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		concat: {
			options : {
				banner : "/**\n" +
				" * <%= pkg.description %>\n" +
				" *\n" +
				" * @author <%= pkg.author %>\n" +
				" * @copyright <%= grunt.template.today('yyyy') %>\n" +
				" * @license <%= pkg.license %>\n" +
				" * @version <%= pkg.version %>\n" +
				" */\n"
				},
				dist: {
					src : [
						"<banner>",
						"src/intro.js",
						"src/cast.js",
						"src/coerce.js",
						"src/decode.js",
						"src/encode.js",
						"src/iterate.js",
						"src/keys.js",
						"src/parse.js",
						"src/prepare.js",
						"src/trim.js",
						"src/interface.js",
						"src/outro.js"
					],
					dest : "lib/csv.es6.js"
				}
		},
		babel: {
			options: {
				sourceMap: false,
				presets: ["env"]
			},
			dist: {
				files: {
					"lib/<%= pkg.name %>": "lib/csv.es6.js"
				}
			}
		},
		nodeunit: {
			all : ["test/*.js"]
		},
		eslint: {
			target: [
				"lib/<%= pkg.name %>.es6.js",
				"test/*.js"
			]
		},
		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: /{{VERSION}}/,
							replacement: '<%= pkg.version %>'
						}
					]
				},
				files: [
					{
						expand: true,
						flatten: true,
						src: [
							"lib/csv.es6.js"
						],
						dest: 'lib/'
					}
				]
			}
		},
		watch : {
			js : {
				files : "<%= concat.dist.src %>",
				tasks : "default"
			},
			pkg: {
				files : "package.json",
				tasks : "default"
			}
		},
		uglify: {
			options: {
				banner: '/* <%= grunt.template.today("yyyy") %> <%= pkg.author %> */\n',
				sourceMap: true,
				sourceMapIncludeSources: true,
				mangle: {
					reserved: ["csv"]
				}
			},
			target: {
				files: {
					"lib/csv.min.js" : ["lib/<%= pkg.name %>"]
				}
			}
		}
	});

	// tasks
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-babel");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-replace");

	// aliases
	grunt.registerTask("test", ["eslint", "nodeunit"]);
	grunt.registerTask("build", ["concat", "replace", "babel", "uglify"]);
	grunt.registerTask("default", ["build", "test"]);
};
