"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _pixiJsBinPixi = require("pixi.js/bin/pixi");

var _pixiJsBinPixi2 = _interopRequireDefault(_pixiJsBinPixi);

var InteractiveSprite = (function (_PIXI$Sprite) {
	_inherits(InteractiveSprite, _PIXI$Sprite);

	function InteractiveSprite(texture, interactiveTimeline) {
		_classCallCheck(this, InteractiveSprite);

		_get(Object.getPrototypeOf(InteractiveSprite.prototype), "constructor", this).call(this, texture);

		this._interactiveTimeline = null;
		this._currentTime = null;
		this._isPlaying = false;
		this._interactiveTimeline = interactiveTimeline;

		this._init();
	}

	/*_______________________________________________
 	PUBLIC
 _______________________________________________*/

	_createClass(InteractiveSprite, [{
		key: "play",
		value: function play() {
			this._play();
		}
	}, {
		key: "stop",
		value: function stop() {
			this._stop();
		}

		/*_______________________________________________
  	PRIVATE
  _______________________________________________*/

	}, {
		key: "_init",
		value: function _init() {
			var state = this._interactiveTimeline.getState(0);
			var frame = state.get("frames").frame.split(",").map(function (value) {
				return parseInt(value);
			});

			this._texture.frame = new _pixiJsBinPixi2["default"].Rectangle(frame[0], frame[1], frame[2], frame[3]);
		}
	}, {
		key: "_play",
		value: function _play() {
			if (this._isPlaying) {
				return;
			}

			this._isPlaying = true;

			_pixiJsBinPixi2["default"].ticker.shared.add(this._update, this);
		}
	}, {
		key: "_stop",
		value: function _stop() {
			if (this._isPlaying === false) {
				return;
			}

			this._isPlaying = false;

			_pixiJsBinPixi2["default"].ticker.shared.remove(this._update, this);
		}
	}, {
		key: "_update",
		value: function _update(deltaTime) {
			var state = this._interactiveTimeline.increment(deltaTime / _pixiJsBinPixi2["default"].TARGET_FPMS);
			var frame = state.get("frames").frame.split(",").map(function (value) {
				return parseInt(value);
			});

			this._texture.frame = new _pixiJsBinPixi2["default"].Rectangle(frame[0], frame[1], frame[2], frame[3]);
			// console.log(deltaTime / 0.06);
		}
	}]);

	return InteractiveSprite;
})(_pixiJsBinPixi2["default"].Sprite);

exports["default"] = InteractiveSprite;
module.exports = exports["default"];