module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		concat: {
			options : {
				banner : "/**\n" + 
				         " * <%= pkg.name %>\n" +
				         " *\n" +
				         " * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
				         " * @copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
				         " * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n" +
				         " * @link <%= pkg.homepage %>\n" +
				         " * @module <%= pkg.name %>\n" +
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
						"src/outro.js",
					],
					dest : "lib/<%= pkg.name %>"
				}
		},
		nodeunit: {
			all : ["test/*.js"]
		},
		jshint : {
			options : {
				jshintrc : ".jshintrc"
			},
			src : "<%= concat.dist.dest %>"
		},
		sed : {
			version : {
				pattern : "{{VERSION}}",
				replacement : "<%= pkg.version %>",
				path : ["<%= concat.dist.dest %>"]
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
				banner : "/**\n" + 
				         " * <%= pkg.name %>\n" +
				         " *\n" +
				         " * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
				         " * @copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
				         " * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n" +
				         " * @link <%= pkg.homepage %>\n" +
				         " * @module <%= pkg.name %>\n" +
				         " * @version <%= pkg.version %>\n" +
				         " */\n",
				mangle: {
					except: ["csv"]
				}
			},
			target: {
				files: {
					"lib/<%= pkg.name.replace('.js', '') %>.min.js" : ["<%= concat.dist.dest %>"]
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-sed");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.registerTask("build", ["concat", "sed", "uglify"]);
	grunt.registerTask("test", ["jshint", "nodeunit"]);
	grunt.registerTask("default", ["build", "test"]);
};
