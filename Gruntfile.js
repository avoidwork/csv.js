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
						"src/csv.js",
						"src/decode.js",
						"src/iterate.js",
						"src/keys.js",
						"src/prepare.js",
						"src/outro.js",
					],
					dest : "lib/<%= pkg.name %>"
				}
		},
		nodeunit: {
			all : ["test/*.js"]
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

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("test", ["nodeunit"]);

  grunt.registerTask("version", function () {
	var cfg = grunt.config("pkg"),
		ver = cfg.version,
		fn  = "lib/" + cfg.name,
		fp  = grunt.file.read(fn);

	console.log("Setting version to: " + ver);
	grunt.file.write(fn, fp.replace(/\{\{VERSION\}\}/g, ver));
  });

  grunt.registerTask("default", ["concat", "version", "uglify", "test"]);
};