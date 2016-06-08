"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _timeline = require("timeline");

var _DEFAULT_OPTIONS = {
	timeline: null,
	frameWidth: null,
	frameHeight: null,
	identifier: "",
	fps: 60,
	draw: function draw(ctx, timelineState) {}
};

var _SHEET_DIMENSIONS = [128, 256, 512, 1024, 2048];

var singleton = Symbol();
var singletonEnforcer = Symbol();

var SpriteSheetBuilder = (function () {
	_createClass(SpriteSheetBuilder, null, [{
		key: "instance",
		get: function get() {
			if (!this[singleton]) {
				this[singleton] = new SpriteSheetBuilder(singletonEnforcer);

				this[singleton]._init();
			}

			return this[singleton];
		}
	}]);

	function SpriteSheetBuilder(enforcer) {
		_classCallCheck(this, SpriteSheetBuilder);

		this._canvasBuffers = [];
		this._frameLength = 0;
		this._sheetData = [];
		this._sheetIndex = -1;
		this._sheetTimeline = null;

		if (enforcer != singletonEnforcer) throw new Exception("Cannot construct singleton");
	}

	/*_______________________________________________
 	PUBLIC
 _______________________________________________*/

	_createClass(SpriteSheetBuilder, [{
		key: "build",
		value: function build(options) {
			this._build(options);
		}
	}, {
		key: "getSpriteSheetJSONData",
		value: function getSpriteSheetJSONData() {
			return this._sheetData;
		}
	}, {
		key: "getSpriteSheetImageData",
		value: function getSpriteSheetImageData() {
			return this._getSpriteSheetImageData();
		}
	}, {
		key: "getSpriteSheetTimeline",
		value: function getSpriteSheetTimeline() {
			return this._sheetTimeline;
		}
	}, {
		key: "getSpriteSheetCanvas",
		value: function getSpriteSheetCanvas() {
			return this._getSpriteSheetCanvas();
		}
	}, {
		key: "_init",

		/*_______________________________________________
  	PRIVATE
  _______________________________________________*/

		value: function _init() {}
	}, {
		key: "_build",
		value: function _build(options) {

			this._options = _extends({}, _DEFAULT_OPTIONS, options);

			// clear and reset ready to rebuild
			this._clearBuffers();

			// compile the json data beforehand, calculate the sheets needed
			this._initiateMetrics();

			// create a timeline with the frames coords set as keyframe, ready for a sprite to read
			this._compileTimeline();

			// call the draw function for every frame
			this._executeDraw();
		}
	}, {
		key: "_initiateMetrics",
		value: function _initiateMetrics() {
			// frameLength will always equal or less timelime
			this._frameLength = Math.floor(this._options.timeline.duration / (1000 / this._options.fps));

			this._sheetData = this._determinMinimumSheetSize(this._frameLength);

			for (var sheetIndex in this._sheetData) {
				if (sheetIndex >= this._canvasBuffers.length) {
					var canvas = document.createElement("canvas");
					canvas.width = _SHEET_DIMENSIONS[_SHEET_DIMENSIONS.length - 1];
					canvas.height = _SHEET_DIMENSIONS[_SHEET_DIMENSIONS.length - 1];

					this._canvasBuffers.push(canvas);
				}
			}
		}
	}, {
		key: "_compileTimeline",
		value: function _compileTimeline() {
			var frameIndex = 0;
			var sheetIndex = 0;
			var frame = undefined,
			    time = undefined;

			var propertyKeyframes = {
				frame: []
			};

			var frames = propertyKeyframes.frame;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this._sheetData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var sheet = _step.value;
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = Object.keys(sheet.frames)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var frameKey = _step2.value;

							time = frameIndex * (1000 / this._options.fps);
							frame = sheet.frames[frameKey].frame;

							frames.push({
								value: frame.x + "," + frame.y + "," + frame.w + "," + frame.h,
								time: time,
								hold: true
							});

							frameIndex += 1;
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
								_iterator2["return"]();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					sheetIndex += 1;
				}

				// const tween = new Tween(propertyKeyframes, `frames`, { loop: false, fillMode: 0 });
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var tween = new _timeline.Tween("frames");
			tween.addKeyframes(propertyKeyframes);

			this._sheetTimeline = new _timeline.InteractiveTimeline("sprite-sheet-timeline");
			this._sheetTimeline.addChild(tween, { loop: false, fillMode: "both" });

			var sequences = this._options.timeline.getSequences();
			if (sequences.length > 0) {
				this._sheetTimeline.setSequences([].concat(_toConsumableArray(sequences)));
			}
		}
	}, {
		key: "_determinMinimumSheetSize",
		value: function _determinMinimumSheetSize(length) {
			var sheetIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

			var maxCells = undefined;
			var sheetData = [];
			var data = undefined;
			var dimension = undefined;
			// @TODO we need to be able to use non square sheets
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = _SHEET_DIMENSIONS[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					dimension = _step3.value;

					maxCells = this._getSheetMaxCells(dimension);
					if (length <= maxCells) {
						break;
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
						_iterator3["return"]();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			if (length <= maxCells) {
				data = this._composeSheetData(dimension, length, sheetIndex);
				sheetData.push(data);
			} else {

				maxCells = this._getSheetMaxCells();

				data = this._composeSheetData(dimension, maxCells, sheetIndex);
				sheetData.push(data);

				length %= maxCells;
				sheetData.concat(this._determinMinimumSheetSize(length), sheetIndex + 1);
			}

			return sheetData;
		}
	}, {
		key: "_composeSheetData",
		value: function _composeSheetData(dimension, frameLength, sheetIndex) {
			var frameData = undefined;

			var frameIndex = sheetIndex * this._getSheetMaxCells();
			var maxIndex = frameIndex + frameLength;
			var maxRows = Math.floor(dimension / this._options.frameHeight);
			var maxCols = Math.floor(dimension / this._options.frameWidth);
			var x = undefined,
			    y = undefined;
			var sheetData = {
				"frames": {},
				"meta": {
					"format": "RGBA8888",
					"size": {
						"w": dimension,
						"h": dimension
					},
					"scale": "1"
				}
			};

			for (var rowIndex = 0; rowIndex < maxRows; rowIndex++) {
				for (var colIndex = 0; colIndex < maxCols; colIndex++) {

					x = colIndex * this._options.frameWidth;
					y = rowIndex * this._options.frameHeight;

					sheetData.frames["" + this._options.identifier + frameIndex] = {
						"frame": { "x": x, "y": y, "w": this._options.frameWidth, "h": this._options.frameHeight },
						"rotated": false,
						"trimmed": false,
						"spriteSourceSize": { "x": 0, "y": 0, "w": this._options.frameWidth, "h": this._options.frameHeight },
						"sourceSize": { "w": this._options.frameWidth, "h": this._options.frameHeight },
						"pivot": { "x": 0.5, "y": 0.5 }
					};

					frameIndex += 1;

					if (frameIndex > maxIndex) {
						return sheetData;
					}
				}
			}

			return sheetData;
		}
	}, {
		key: "_getSheetMaxCells",
		value: function _getSheetMaxCells(dimension) {
			if (dimension == null) {
				dimension = _SHEET_DIMENSIONS[_SHEET_DIMENSIONS.length - 1];
			}
			return Math.floor(dimension / this._options.frameWidth) * Math.floor(dimension / this._options.frameHeight);
		}
	}, {
		key: "_executeDraw",
		value: function _executeDraw() {
			var ctx = undefined,
			    time = undefined,
			    frameData = undefined;
			var frameIndex = 0;
			var sheetIndex = 0;

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this._sheetData[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var sheet = _step4.value;
					var _iteratorNormalCompletion5 = true;
					var _didIteratorError5 = false;
					var _iteratorError5 = undefined;

					try {
						for (var _iterator5 = Object.keys(sheet.frames)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
							var frameKey = _step5.value;

							time = frameIndex * (1000 / this._options.fps);

							ctx = this._canvasBuffers[sheetIndex].getContext("2d");

							this._drawSprite(ctx, time, sheet.frames[frameKey].frame);

							frameIndex += 1;
						}
					} catch (err) {
						_didIteratorError5 = true;
						_iteratorError5 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
								_iterator5["return"]();
							}
						} finally {
							if (_didIteratorError5) {
								throw _iteratorError5;
							}
						}
					}

					sheetIndex += 1;
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
						_iterator4["return"]();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		}
	}, {
		key: "_drawSprite",
		value: function _drawSprite(ctx, time, frameRect) {
			// reset context
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			// position context
			ctx.translate(frameRect.x, frameRect.y);
			// get state
			var state = this._options.timeline.getState(time);
			// request draw
			this._options.draw(ctx, state);
		}
	}, {
		key: "_clearBuffers",
		value: function _clearBuffers() {
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = this._canvasBuffers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var canvas = _step6.value;

					canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
						_iterator6["return"]();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}
		}
	}, {
		key: "_getSpriteSheetImageData",
		value: function _getSpriteSheetImageData() {
			var spriteSheetImageData = [];
			for (var i = 0; i < this._sheetData.length; i++) {
				spriteSheetImageData.push(this._canvasBuffers[i].getContext("2d").getImageData(0, 0, this._sheetData[i].meta.size.w, this._sheetData[i].meta.size.h));
			}

			return spriteSheetImageData;
		}
	}, {
		key: "_getSpriteSheetCanvas",
		value: function _getSpriteSheetCanvas() {
			var spriteSheetCanvas = [];
			var canvas = undefined;
			for (var i = 0; i < this._sheetData.length; i++) {
				canvas = document.createElement('canvas');
				canvas.width = this._sheetData[i].meta.size.w;
				canvas.height = this._sheetData[i].meta.size.h;
				canvas.getContext("2d").drawImage(this._canvasBuffers[i], 0, 0);
				spriteSheetCanvas.push(canvas);
			}

			return spriteSheetCanvas;
		}
	}, {
		key: "sheetLength",
		get: function get() {
			return this._canvasBuffers.length;
		}
	}, {
		key: "frameLength",
		get: function get() {
			return this._frameLength;
		}
	}]);

	return SpriteSheetBuilder;
})();

exports["default"] = SpriteSheetBuilder;
module.exports = exports["default"];