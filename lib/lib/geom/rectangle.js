"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rectangle = (function () {
	function Rectangle(left, top, width, height) {
		_classCallCheck(this, Rectangle);

		this._scale = 1;
		this._left = 0;
		this._top = 0;
		this._width = 0;
		this._height = 0;

		this._left = left || 0;
		this._top = top || 0;
		this._width = width || 0;
		this._height = height || 0;
	}

	_createClass(Rectangle, [{
		key: "contains",
		value: function contains(x, y) {
			if (x >= this._left && x < this._left + this._width && y >= this._top && y < this._top + this._height) {
				return true;
			}
			return false;
		}
	}, {
		key: "containsRect",
		value: function containsRect(x, y, w, h) {
			if (x >= this._left && x + w <= this._left + this._width && y >= this._top && y + h <= this._top + this._height) {
				return true;
			}
			return false;
		}
	}, {
		key: "union",
		value: function union(toUnion) {
			var union = new Rectangle();
			union.left = Math.min(this._left, toUnion.left);
			union.top = Math.min(this._top, toUnion.top);
			union.width = Math.max(this._left + this._width, toUnion.left + toUnion.width) - union.left;
			union.height = Math.max(this._top + this._height, toUnion.top + toUnion.height) - union.top;
			return union;
		}
	}, {
		key: "toString",
		value: function toString() {
			return "Rectangle left:" + this._left + " top:" + this._top + " width:" + this._width + " height:" + this._height;
		}
	}, {
		key: "applyScale",
		value: function applyScale(scale) {
			this._left *= scale;
			this._top *= scale;
			this._width *= scale;
			this._height *= scale;
		}
	}, {
		key: "left",
		get: function get() {
			return this._left;
		},
		set: function set(value) {
			this._left = value;
		}
	}, {
		key: "top",
		get: function get() {
			return this._top;
		},
		set: function set(value) {
			this._top = value;
		}
	}, {
		key: "x",
		get: function get() {
			return this._left;
		},
		set: function set(value) {
			this._left = value;
		}
	}, {
		key: "y",
		get: function get() {
			return this._top;
		},
		set: function set(value) {
			this._top = value;
		}
	}, {
		key: "width",
		get: function get() {
			return this._width;
		},
		set: function set(value) {
			this._width = value;
		}
	}, {
		key: "height",
		get: function get() {
			return this._height;
		},
		set: function set(value) {
			this._height = value;
		}
	}, {
		key: "bottom",
		get: function get() {
			return this._top + this._height;
		},
		set: function set(value) {
			this._height = value - this._top;
		}
	}, {
		key: "right",
		get: function get() {
			return this._left + this._width;
		},
		set: function set(value) {
			this._width = value - this._left;
		}
	}], [{
		key: "intersect",
		value: function intersect(rect1, rect2) {
			var rectI = new Rectangle();
			rectI.left = Math.max(rect1.left, rect2.left);
			rectI.top = Math.max(rect1.top, rect2.top);
			rectI.right = Math.min(rect1.right, rect2.right);
			rectI.bottom = Math.min(rect1.bottom, rect2.bottom);
			return rectI;
		}
	}]);

	return Rectangle;
})();

exports["default"] = Rectangle;
module.exports = exports["default"];