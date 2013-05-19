"use strict";

var csv  = require("../lib/csv.js"),
    data = [{name: "John Doe"}, {name: "Josh Davis"}];

exports["array1"] = {
	setUp: function (done) {
		this.data = data;
		done();
	},
	test: function (test) {
		test.expect(5);
		test.equal(typeof csv(this.data), "string", "Should be `string`");
		test.equal(csv(this.data).split("\n").length, 3, "Should be `3`");
		test.equal(csv(this.data).split("\n")[0], "name", "Should be `name`");
		test.equal(csv(this.data).split("\n")[1], "John Doe", "Should be `John Doe`");
		test.equal(csv(this.data).split("\n")[2], "Josh Davis", "Should be `Josh Davis`");
		test.done();
	}
};

exports["array2"] = {
	setUp: function (done) {
		this.data   = [1,2,3,4,5];
		this.result = "\"" + this.data.toString() + "\"";
		done();
	},
	test: function (test) {
		test.expect(3);
		test.equal(typeof csv(this.data), "string", "Should be `string`");
		test.equal(csv(this.data).split("\n").length, 1, "Should be `1`");
		test.equal(csv(this.data), this.result, "Should be `" + this.result + "`");
		test.done();
	}
};

exports["object"] = {
	setUp: function (done) {
		this.data = data[0];
		done();
	},
	test: function (test) {
		test.expect(4);
		test.equal(typeof csv(this.data), "string", "Should be `string`");
		test.equal(csv(this.data).split("\n").length, 2, "Should be `3`");
		test.equal(csv(this.data).split("\n")[0], "name", "Should be `name`");
		test.equal(csv(this.data).split("\n")[1], "John Doe", "Should be `John Doe`");
		test.done();
	}
};

exports["json"] = {
	setUp: function (done) {
		this.data = JSON.stringify(data);
		done();
	},
	test: function (test) {
		test.expect(5);
		test.equal(typeof csv(this.data), "string", "Should be `string`");
		test.equal(csv(this.data).split("\n").length, 3, "Should be `3`");
		test.equal(csv(this.data).split("\n")[0], "name", "Should be `name`");
		test.equal(csv(this.data).split("\n")[1], "John Doe", "Should be `John Doe`");
		test.equal(csv(this.data).split("\n")[2], "Josh Davis", "Should be `Josh Davis`");
		test.done();
	}
};
