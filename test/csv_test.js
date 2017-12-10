"use strict";

const csv = require("../lib/csv.js"),
	data = [{name: "John Doe"}, {name: "Josh Davis"}];

let doc;

doc = "a,b,c\n";
doc += "1,2,3\n";
doc += "\"hello, world\",2,3\n";
doc += "1,,3\n";
doc += "\"\"hello, world\"\",2,3\n";
doc += "\"\"hello\", world\",2,3";

exports.decode = {
	setUp: function (done) {
		this.result = csv.decode(doc);
		done();
	},
	test: function (test) {
		test.expect(12);
		test.equal(this.result instanceof Array, true, "Should be `true`");
		test.equal(this.result.length, 5, "Should be `5`");
		test.equal(typeof this.result[0].a, "number", "Should be `number`");
		test.equal(typeof this.result[1].a, "string", "Should be `string`");
		test.equal(this.result[1].a, "\"hello, world\"", "Should be `\"hello, world\"`");
		test.equal(typeof this.result[2].a, "number", "Should be `number`");
		test.equal(typeof this.result[2].b, "string", "Should be `string`");
		test.equal(typeof this.result[2].c, "number", "Should be `number`");
		test.equal(this.result[2].b, "", "Should be ``");
		test.equal(this.result[3].a, "\"\"hello, world\"\"", "Should be `\"\"hello, world\"\"`");
		test.equal(this.result[4].a, "\"\"hello\", world\"", "Should be `\"\"hello\", world\"`");
		test.equal(csv.encode(this.result), doc, "Should be equal to `doc` variable");
		test.done();
	}
};

exports.encode_array1 = {
	setUp: function (done) {
		this.data = data;
		done();
	},
	test: function (test) {
		test.expect(5);
		test.equal(typeof csv.encode(this.data), "string", "Should be `string`");
		test.equal(csv.encode(this.data).split("\n").length, 3, "Should be `3`");
		test.equal(csv.encode(this.data).split("\n")[0], "name", "Should be `name`");
		test.equal(csv.encode(this.data).split("\n")[1], "John Doe", "Should be `John Doe`");
		test.equal(csv.encode(this.data).split("\n")[2], "Josh Davis", "Should be `Josh Davis`");
		test.done();
	}
};

exports.encode_array2 = {
	setUp: function (done) {
		this.data = [1, 2, 3, 4, 5];
		this.result = "\"" + this.data.toString() + "\"";
		done();
	},
	test: function (test) {
		test.expect(3);
		test.equal(typeof csv.encode(this.data), "string", "Should be `string`");
		test.equal(csv.encode(this.data).split("\n").length, 1, "Should be `1`");
		test.equal(csv.encode(this.data), this.result, "Should be `" + this.result + "`");
		test.done();
	}
};

exports.encode_object = {
	setUp: function (done) {
		this.data = data[0];
		done();
	},
	test: function (test) {
		test.expect(4);
		test.equal(typeof csv.encode(this.data), "string", "Should be `string`");
		test.equal(csv.encode(this.data).split("\n").length, 2, "Should be `2`");
		test.equal(csv.encode(this.data).split("\n")[0], "name", "Should be `name`");
		test.equal(csv.encode(this.data).split("\n")[1], "John Doe", "Should be `John Doe`");
		test.done();
	}
};

exports.encode_json = {
	setUp: function (done) {
		this.data = JSON.stringify(data);
		done();
	},
	test: function (test) {
		test.expect(5);
		test.equal(typeof csv.encode(this.data), "string", "Should be `string`");
		test.equal(csv.encode(this.data).split("\n").length, 3, "Should be `3`");
		test.equal(csv.encode(this.data).split("\n")[0], "name", "Should be `name`");
		test.equal(csv.encode(this.data).split("\n")[1], "John Doe", "Should be `John Doe`");
		test.equal(csv.encode(this.data).split("\n")[2], "Josh Davis", "Should be `Josh Davis`");
		test.done();
	}
};

exports.e2e = {
	setUp: function (done) {
		this.data = {a: 3, test: "\"value\" b", b: 5};
		this.encoded = csv.encode(this.data);
		done();
	},
	test: function (test) {
		test.expect(5);
		test.equal(typeof this.encoded, "string", "Should be `string`");
		test.equal(this.encoded.split("\n").length, 2, "Should be `2`");
		test.equal(csv.decode(this.encoded)[0].a, 3, "Should be `3`");
		test.equal(csv.decode(this.encoded)[0].test, "\"value\" b", "Should be `\"value\" b`");
		test.equal(csv.decode(this.encoded)[0].b, 5, "Should be `5`");
		test.done();
	}
};
