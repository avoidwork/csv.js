module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concat: {
			options: {
				banner: "/**\n" +
					" * <%= pkg.description %>\n" +
					" *\n" +
					" * @author <%= pkg.author %>\n" +
					" * @copyright <%= grunt.template.today('yyyy') %>\n" +
					" * @license <%= pkg.license %>\n" +
					" * @link <%= pkg.homepage %>\n" +
					" * @version <%= pkg.version %>\n" +
					" */\n"
			},
			dist: {
				src: [
					"<banner>",
					"src/intro.js",
					"src/keys.js",
					"src/iterate.js",
					"src/parse.js",
					"src/trim.js",
					"src/cast.js",
					"src/prepare.js",
					"src/encode.js",
					"src/coerce.js",
					"src/decode.js",
					"src/interface.js",
					"src/outro.js"
				],
				dest: "lib/<%= pkg.name %>"
			}
		},
		nodeunit: {
			all: ["test/*.js"]
		},
		eslint: {
			target: [
				"Gruntfile.js",
				"lib/<%= pkg.name %>",
				"test/*.js"
			]
		},
		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: /{{VERSION}}/,
							replacement: "<%= pkg.version %>"
						}
					]
				},
				files: [
					{
						expand: true,
						flatten: true,
						src: [
							"lib/<%= pkg.name %>"
						],
						dest: "lib/"
					}
				]
			}
		},
		watch: {
			js: {
				files: "<%= concat.dist.src %>",
				tasks: "default"
			},
			pkg: {
				files: "package.json",
				tasks: "default"
			}
		}
	});

	// tasks
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-replace");

	grunt.task.registerTask("babili", "Minifies ES2016+ code", function () {
		const fs = require("fs"),
			path = require("path"),
			data = fs.readFileSync(path.join(__dirname, "lib", "csv.js"), "utf8").replace("\"use strict\";", ""), // Stripping "use strict"; because it's injected
			pkg = require(path.join(__dirname, "package.json")),
			banner = "/*\n " + new Date().getFullYear() + " " + pkg.author + "\n @version " + pkg.version + "\n*/\n\"use strict\";";

		try {
			const minified = require("babel-core").transform(data, {
				sourceFileName: "csv.js",
				sourceMaps: true,
				presets: ["minify"]
			});

			fs.writeFileSync(path.join(__dirname, "lib", "csv.min.js"), banner + minified.code + "\n//# sourceMappingURL=csv.min.js.map", "utf8");
			grunt.log.ok("1 file created.");
			fs.writeFileSync(path.join(__dirname, "lib", "csv.min.js.map"), JSON.stringify(minified.map), "utf8");
			grunt.log.ok("1 sourcemap created.");
		} catch (e) {
			console.error(e.stack || e.message || e);
			throw e;
		}
	});

	// aliases
	grunt.registerTask("test", ["eslint", "nodeunit"]);
	grunt.registerTask("build", ["concat", "replace"]);
	grunt.registerTask("default", ["build", "test", "babili"]);
};
