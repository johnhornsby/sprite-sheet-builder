"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = (function () {
	function Point(x, y) {
		_classCallCheck(this, Point);

		this.x = x;
		this.y = y;
	}

	_createClass(Point, [{
		key: "toString",
		value: function toString() {
			return "Point x:" + this.x + " y:" + this.y;
		}
	}], [{
		key: "distance",
		value: function value(p1, p2) {
			return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
		},
		enumerable: true
	}]);

	return Point;
})();

exports["default"] = Point;
module.exports = exports["default"];