(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _timeline = __webpack_require__(1);

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

				var tween = new _timeline.Tween(propertyKeyframes, "frames", { loop: false, fillMode: 0 });

				this._sheetTimeline = new _timeline.InteractiveTimeline();
				this._sheetTimeline.addTween(tween, 0);

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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["Timeline"] = factory();
		else
			root["Timeline"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		Object.defineProperty(exports, '__esModule', {
			value: true
		});

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

		var _timeline = __webpack_require__(1);

		var _timeline2 = _interopRequireDefault(_timeline);

		var _interactiveTimeline = __webpack_require__(2);

		var _interactiveTimeline2 = _interopRequireDefault(_interactiveTimeline);

		var _tween = __webpack_require__(3);

		var _tween2 = _interopRequireDefault(_tween);

		var _motionTween = __webpack_require__(4);

		var _motionTween2 = _interopRequireDefault(_motionTween);

		exports.Timeline = _timeline2['default'];
		exports.InteractiveTimeline = _interactiveTimeline2['default'];
		exports.Tween = _tween2['default'];
		exports.MotionTween = _motionTween2['default'];

	/***/ },
	/* 1 */
	/***/ function(module, exports) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
			value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var TIMELINE_DEFAULT_OPTIONS = {
			loop: false,
			fps: 60
		};

		var Timeline = (function () {
			function Timeline(options) {
				_classCallCheck(this, Timeline);

				this._currentTime = 0;
				this._loop = null;
				this._options = null;
				this._duration = null;
				this._tweens = [];

				this._init(options);
			}

			/*________________________________________________________
		 	PUBLIC CLASS METHODS
		 ________________________________________________________*/

			_createClass(Timeline, [{
				key: Symbol.iterator,
				value: function value() {
					return this;
				}
			}, {
				key: "next",
				value: function next() {
					return this._next();
				}
			}, {
				key: "addTween",
				value: function addTween(tween, time) {
					this._addTween(tween, time);
				}
			}, {
				key: "getState",
				value: function getState(time) {
					return this._getState(time);
				}
			}, {
				key: "_init",

				/*________________________________________________________
		  	PRIVATE CLASS METHODS
		  ________________________________________________________*/

				value: function _init(options) {
					this._options = _extends({}, TIMELINE_DEFAULT_OPTIONS, options);
				}
			}, {
				key: "_addTween",
				value: function _addTween(tween) {
					var time = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

					if (this._tweens.length === 0 || this._tweens.find(function (tweenObjectData) {
						return tweenObjectData.tween === tween;
					}) === false) {
						this._tweens.push({
							tween: tween,
							time: time
						});
						this._updateDuration();
					}
				}
			}, {
				key: "_updateDuration",
				value: function _updateDuration() {
					var _this = this;

					this._duration = 0;
					this._tweens.forEach(function (tweenObjectData, index) {
						_this._duration = Math.max(_this._duration, tweenObjectData.time + tweenObjectData.tween.duration);
					});
				}
			}, {
				key: "_getState",
				value: function _getState(time) {
					var stateMap = new Map();
					// iterate over map properies
					this._tweens.forEach(function (tweenObjectData, index) {
						// interate over object properties
						stateMap.set(tweenObjectData.tween.identifier, tweenObjectData.tween.getState(time - tweenObjectData.time));
					});
					// return map
					return stateMap;
				}
			}, {
				key: "_next",
				value: function _next() {
					var time = this._currentTime;

					this._currentTime += 1000 / this._options.fps;

					var done = time >= this._duration;

					if (done) {
						this._currentTime = 0;
						return { done: done };
					} else {
						return {
							value: this._getState(time)
						};
					}
				}
			}, {
				key: "duration",
				set: function set(duration) {
					this._duration = this._options.duration = duration;
				},
				get: function get() {
					return this._duration;
				}
			}, {
				key: "loop",
				set: function set(boolean) {
					this._loop = boolean;
				},
				get: function get() {
					return this._loop;
				}
			}, {
				key: "currentTime",
				set: function set(time) {
					this._currentTime = time;
				},
				get: function get() {
					return this._currentTime;
				}
			}]);

			return Timeline;
		})();

		exports["default"] = Timeline;
		module.exports = exports["default"];

	/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		Object.defineProperty(exports, '__esModule', {
			value: true
		});

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

		function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

		var _timeline = __webpack_require__(1);

		var _timeline2 = _interopRequireDefault(_timeline);

		var InteractiveTimeline = (function (_Timeline) {
			_inherits(InteractiveTimeline, _Timeline);

			function InteractiveTimeline(options) {
				_classCallCheck(this, InteractiveTimeline);

				_get(Object.getPrototypeOf(InteractiveTimeline.prototype), 'constructor', this).call(this, options);
				this._sequences = [];
			}

			/*________________________________________________________
		 	PUBLIC CLASS METHODS
		 ________________________________________________________*/

			_createClass(InteractiveTimeline, [{
				key: 'increment',
				value: function increment(timeDelta) {
					return this._increment(timeDelta);
				}
			}, {
				key: 'setSequences',
				value: function setSequences(sequences) {
					this._setSequences(sequences);
				}
			}, {
				key: 'getSequences',
				value: function getSequences() {
					return this._sequences;
				}

				/*________________________________________________________
		  	PRIVATE CLASS METHODS
		  ________________________________________________________*/

			}, {
				key: '_increment',
				value: function _increment(timeDelta) {
					var outDelta = undefined,
					    sequenceOutTime = undefined;

					// get current sequence
					var currentSequence = this._getSequenceByTime(this._currentTime);

					this._currentTime += timeDelta;

					// get updated sequence with current time
					var prospectiveSequence = this._getSequenceByTime(this._currentTime);

					// we only redirect if last time was within a sequence
					if (currentSequence != null) {
						// check to see we have left the current sequence and that the current sequence has a next location
						if (currentSequence !== prospectiveSequence && currentSequence.next != null) {

							// if there is a prospective then check that its not the next of current
							if (prospectiveSequence != null) {

								if (currentSequence.next !== prospectiveSequence.label) {
									// if duration is set on current the outDelta should be from after the duration
									if (currentSequence.duration) {
										sequenceOutTime = currentSequence.time + currentSequence.duration;
									} else {
										// otherwise no duration set the current sequence extends to the begining of the prospective
										sequenceOutTime = prospectiveSequence.time;
									}
								} else {
									sequenceOutTime = prospectiveSequence.time;
								}
							} else {
								// if prospective is null and current is not, then a duration must be set, so use that
								sequenceOutTime = currentSequence.time + currentSequence.duration;
							}

							outDelta = this._currentTime - sequenceOutTime;
							// adjust time and update current
							prospectiveSequence = this._getSequenceByLabel(currentSequence.next);

							this.currentTime = prospectiveSequence.time + outDelta;
						}
					}

					return this._getState(this._currentTime);
				}
			}, {
				key: '_setSequences',
				value: function _setSequences(sequences) {
					// merge sequence
					// validate check for overlaping
					this._sequences = sequences;
				}
			}, {
				key: '_getSequenceByTime',
				value: function _getSequenceByTime(time) {
					var sequence = undefined;

					for (var i = 0; i < this._sequences.length; i++) {
						if (this._sequences[i].time > time) {
							break;
						}
						sequence = this._sequences[i];
					}

					if (sequence) {
						// check if time is beyond last sequence
						if (sequence.duration && time > sequence.time + sequence.duration) {
							return null;
						}
						// return the current sequence
						return sequence;
					}

					// no relevent sequences
					return null;
				}
			}, {
				key: '_getSequenceByLabel',
				value: function _getSequenceByLabel(label) {
					for (var i = 0; i < this._sequences.length; i++) {
						if (this._sequences[i].label === label) {
							return this._sequences[i];
						}
					}
				}
			}]);

			return InteractiveTimeline;
		})(_timeline2['default']);

		exports['default'] = InteractiveTimeline;
		module.exports = exports['default'];

	/***/ },
	/* 3 */
	/***/ function(module, exports, __webpack_require__) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
			value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var _motionTween = __webpack_require__(4);

		var _motionTween2 = _interopRequireDefault(_motionTween);

		var _DEFAULT_OPTIONS = {
			loop: false,
			"in": 0,
			out: null,
			duration: null,
			fillMode: 0
		};

		var Tween = (function () {
			_createClass(Tween, null, [{
				key: "FILL_MODE",
				value: {
					NOME: 0,
					FORWARD: 1,
					BACKWARD: 2,
					BOTH: 3
				},
				enumerable: true
			}]);

			function Tween(propertyKeyframes, identifier, options) {
				_classCallCheck(this, Tween);

				this._propertyKeyframesMap = null;
				this._identifier = null;
				this._options = null;

				this._init(propertyKeyframes, identifier, options);
			}

			/*________________________________________________________
		 	PUBLIC CLASS METHODS
		 ________________________________________________________*/

			_createClass(Tween, [{
				key: "getState",
				value: function getState(time) {
					return this._getState(time);
				}
			}, {
				key: "_init",

				/*________________________________________________________
		  	PRIVATE CLASS METHODS
		  ________________________________________________________*/

				value: function _init(propertyKeyframes, identifier, options) {
					this._options = _extends({}, _DEFAULT_OPTIONS, options);

					this._identifier = identifier;

					this._processProperties(propertyKeyframes);

					this._updateDuration();
				}
			}, {
				key: "_processProperties",
				value: function _processProperties(propertyKeyframes) {
					var _this = this;

					this._propertyKeyframesMap = new Map();

					Object.keys(propertyKeyframes).map(function (key, index) {

						var keyframes = _this._validateKeyframes(propertyKeyframes[key]);

						_this._propertyKeyframesMap.set(key, keyframes);
					});
				}
			}, {
				key: "_validateKeyframes",
				value: function _validateKeyframes(keyframes) {

					var keyframesCloned = keyframes.map(function (keyframe) {
						return _extends({}, keyframe);
					});

					return keyframesCloned;
				}
			}, {
				key: "_updateDuration",
				value: function _updateDuration() {
					var duration = 0;
					var inIndex = -1;

					this._propertyKeyframesMap.forEach(function (keyframes, key) {
						keyframes.forEach(function (keyframe, index) {
							duration = Math.max(duration, keyframe.time);
						});
					});

					if (this._options["in"] == null) {
						this._options["in"] = 0;
					} else {
						// adjust the duration
						if (this._options["in"] > this._duration) {
							throw Error("In point is set beyond the end of the tween!");
						}
						duration -= this._options["in"];
					}

					if (this._options.out != null && this._options.duration != null) {
						throw Error("specify either and out time or duration, not both!");
					}

					if (this._options.duration != null) {
						this._options.out = this._options["in"] + this._options.duration;
						duration = this._options.duration;
					}

					if (this._options.out != null) {
						duration = this._options.out - this._options["in"];
					} else {
						this._options.out = this._options["in"] + duration;
					}

					this._options.duration = duration;

					if (this._options["in"] > this._options.out) {
						throw Error("tween in is greater than out!");
					}
				}
			}, {
				key: "_searchForKeyframeByTime",
				value: function _searchForKeyframeByTime() {}
			}, {
				key: "_getState",
				value: function _getState(time) {
					var _this2 = this;

					var propertiesStateObject = {};

					time = this._resolveTime(time);

					this._propertyKeyframesMap.forEach(function (keyframes, property) {

						propertiesStateObject[property] = _this2._getTweenValue(keyframes, time);
					});

					return propertiesStateObject;
				}
			}, {
				key: "_loopTime",
				value: function _loopTime(time) {
					return ((time - this._options["in"]) % this._options.duration + this._options.duration) % this._options.duration;
				}
			}, {
				key: "_resolveTime",
				value: function _resolveTime(time) {
					// resolve time
					if (time < this._options["in"]) {
						if (this._options.fillMode === Tween.FILL_MODE.BACKWARD || this._options.fillMode === Tween.FILL_MODE.BOTH) {
							if (this._options.loop) {
								return this._loopTime(time);
							}
						}
					}

					if (time > this._options.out) {
						if (this._options.fillMode === Tween.FILL_MODE.FORWARD || this._options.fillMode === Tween.FILL_MODE.BOTH) {
							if (this._options.loop) {
								return this._loopTime(time);
							}
						}
					}

					return time;
				}
			}, {
				key: "_getTweenValue",
				value: function _getTweenValue(keyframes, time) {
					var value = null;
					// interate over keyframes untill we find the exact value or keyframes either side
					var length = keyframes.length;
					var keyframe = undefined,
					    keyframeValue = undefined;
					var lastKeyframe = undefined;

					// the aim here is to find the keyframe to either side of the time value

					var previousKeyframe = null;
					var nextKeyframe = null;

					for (var i = 0; i < length; i++) {
						keyframe = keyframes[i];
						keyframeValue = keyframe.value;

						if (time === keyframe.time) {
							return keyframe.value;
						} else if (time > keyframe.time) {
							previousKeyframe = keyframe;
							// no need to break here as we continue iterating through keyFrames to find the keyframe just previous to the time value
						} else if (time < keyframe.time) {
								nextKeyframe = keyframe;
								break; // break here has we have gone far enough to get the next keyFrame
							}
					}

					if (previousKeyframe == null && nextKeyframe == null) {
						return value;
					}

					if (previousKeyframe == null) {
						return nextKeyframe.value;
					}

					if (nextKeyframe == null) {
						return previousKeyframe.value;
					}

					if (previousKeyframe != null && nextKeyframe != null) {
						// check for a hold keyframe
						if (previousKeyframe.hold != null && previousKeyframe.hold === true) {
							return previousKeyframe.value;
						}

						value = this._tweenBetweenKeyframes(previousKeyframe, nextKeyframe, time);
					}

					return value;
				}
			}, {
				key: "_tweenBetweenKeyframes",
				value: function _tweenBetweenKeyframes(lastKeyframe, keyframe, time) {
					var timeDifference = keyframe.time - lastKeyframe.time;
					var deltaFloat = (time - lastKeyframe.time) / timeDifference;

					if (keyframe.time < lastKeyframe.time) {
						// we are looping and needing to use the last keyframe as lastKeyframe
						timeDifference = this._options.duration - lastKeyframe.time + keyframe.time;

						if (time < lastKeyframe.time) {
							// time is less that the last keyframe.time and requires the difference
							// between the last keyframe.time and the duration to be taken into account
							deltaFloat = (this._options.duration - lastKeyframe.time + time) / timeDifference;
						} else {
							deltaFloat = (time - lastKeyframe.time) / timeDifference;
						}
					}

					var easedDelta = deltaFloat;

					if (lastKeyframe.animatorType != null) {
						var animatorOptions = {};
						if (lastKeyframe.animatorOptions != null) {
							animatorOptions = _extends({}, animatorOptions, lastKeyframe.animatorOptions);
						}

						easedDelta = _motionTween2["default"].getValue(lastKeyframe.animatorType, animatorOptions, deltaFloat);
					}

					var valueDifference = keyframe.value - lastKeyframe.value;
					var tweenedValue = lastKeyframe.value + valueDifference * easedDelta;

					return tweenedValue;
				}
			}, {
				key: "propertyKeyframesMap",
				get: function get() {
					return this._propertyKeyframesMap;
				}
			}, {
				key: "identifier",
				get: function get() {
					return this._identifier;
				}
			}, {
				key: "duration",
				get: function get() {
					return this._options.duration;
				}
			}, {
				key: "in",
				get: function get() {
					return this._options["in"];
				}
			}, {
				key: "out",
				get: function get() {
					return this._options.out;
				}
			}, {
				key: "loop",
				get: function get() {
					return this._options.loop;
				}
			}, {
				key: "fillMode",
				get: function get() {
					return this._options.fillMode;
				}
			}]);

			return Tween;
		})();

		exports["default"] = Tween;
		module.exports = exports["default"];

	/***/ },
	/* 4 */
	/***/ function(module, exports, __webpack_require__) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var _Utils = __webpack_require__(5);

		var _Utils2 = _interopRequireDefault(_Utils);

		var _Easing = __webpack_require__(6);

		var Easing = _interopRequireWildcard(_Easing);

		var _animatorsCubicBezier = __webpack_require__(7);

		var _animatorsCubicBezier2 = _interopRequireDefault(_animatorsCubicBezier);

		var _animatorsEase = __webpack_require__(8);

		var _animatorsEase2 = _interopRequireDefault(_animatorsEase);

		var _animatorsFriction = __webpack_require__(9);

		var _animatorsFriction2 = _interopRequireDefault(_animatorsFriction);

		var _animatorsSpring = __webpack_require__(10);

		var _animatorsSpring2 = _interopRequireDefault(_animatorsSpring);

		var _animatorsSpringRK4 = __webpack_require__(11);

		var _animatorsSpringRK42 = _interopRequireDefault(_animatorsSpringRK4);

		var MotionTween = (function () {
		  _createClass(MotionTween, null, [{
		    key: "DEFAULT_OPTIONS",
		    value: {
		      time: 1000,
		      startValue: 0,
		      endValue: 1,
		      animatorType: _animatorsFriction2["default"].Type,
		      animatorOptions: null, // use defaults of selected type
		      update: function update() {},
		      complete: function complete() {}
		    },
		    enumerable: true
		  }, {
		    key: "easingFunction",
		    value: {
		      easeInQuad: Easing.easeInQuad,
		      easeOutQuad: Easing.easeOutQuad,
		      easeInOutQuad: Easing.easeInOutQuad,
		      swing: Easing.swing,
		      easeInCubic: Easing.easeInCubic,
		      easeOutCubic: Easing.easeOutCubic,
		      easeInOutCubic: Easing.easeInOutCubic,
		      easeInQuart: Easing.easeInQuart,
		      easeOutQuart: Easing.easeOutQuart,
		      easeInOutQuart: Easing.easeInOutQuart,
		      easeInQuint: Easing.easeInQuint,
		      easeOutQuint: Easing.easeOutQuint,
		      easeInOutQuint: Easing.easeInOutQuint,
		      easeInSine: Easing.easeInSine,
		      easeOutSine: Easing.easeOutSine,
		      easeInOutSine: Easing.easeInOutSine,
		      easeInExpo: Easing.easeInExpo,
		      easeOutExpo: Easing.easeOutExpo,
		      easeInOutExpo: Easing.easeInOutExpo,
		      easeInCirc: Easing.easeInCirc,
		      easeOutCirc: Easing.easeOutCirc,
		      easeInOutCirc: Easing.easeInOutCirc,
		      easeInElastic: Easing.easeInElastic,
		      easeOutElastic: Easing.easeOutElastic,
		      easeInOutElastic: Easing.easeInOutElastic,
		      easeInBack: Easing.easeInBack,
		      easeOutBack: Easing.easeOutBack,
		      easeInOutBack: Easing.easeInOutBack,
		      easeInBounce: Easing.easeInBounce,
		      easeOutBounce: Easing.easeOutBounce,
		      easeInOutBounce: Easing.easeInOutBounce
		    },
		    enumerable: true
		  }, {
		    key: "animatorType",
		    value: {
		      spring: _animatorsSpring2["default"].Type,
		      springRK4: _animatorsSpringRK42["default"].Type,
		      friction: _animatorsFriction2["default"].Type,
		      ease: _animatorsEase2["default"].Type,
		      cubicBezier: _animatorsCubicBezier2["default"].Type
		    },
		    enumerable: true
		  }]);

		  function MotionTween(options) {
		    _classCallCheck(this, MotionTween);

		    this._time = null;
		    this._startX = null;
		    this._endX = null;
		    this._lastTime = null;
		    this._startTime = null;
		    this._options = {};
		    this._isAnimating = false;
		    this._animator = null;
		    this._x = null;

		    this._init(options);
		    return this;
		  }

		  _createClass(MotionTween, [{
		    key: "start",
		    value: function start() {
		      this._start();
		    }
		  }, {
		    key: "destroy",
		    value: function destroy() {
		      this._destroy();
		    }
		  }, {
		    key: "_init",
		    value: function _init(options) {
		      // Deep merge of default and incoming options
		      _Utils2["default"].extend(this._options, MotionTween.DEFAULT_OPTIONS, true);
		      _Utils2["default"].extend(this._options, options, true);

		      // time we can ignore for some of the animators
		      this._time = this._options.time;
		      this._startX = this._options.startValue;
		      this._endX = this._options.endValue;
		    }
		  }, {
		    key: "_start",
		    value: function _start() {
		      this._lastTime = 0;
		      this._startTime = 0;

		      switch (this._options.animatorType) {
		        case _animatorsSpring2["default"].Type:
		          this._animator = new _animatorsSpring2["default"](this._options.animatorOptions);
		          break;
		        case _animatorsSpringRK42["default"].Type:
		          this._animator = new _animatorsSpringRK42["default"](this._options.animatorOptions);
		          break;
		        case _animatorsFriction2["default"].Type:
		          this._animator = new _animatorsFriction2["default"](this._options.animatorOptions);
		          break;
		        case _animatorsCubicBezier2["default"].Type:
		          this._animator = new _animatorsCubicBezier2["default"](this._options.animatorOptions);
		          break;
		        default:
		          this._animator = new _animatorsEase2["default"](this._options.animatorOptions);
		      }

		      this._isAnimating = true;
		      this._startTime = this._lastTime = new Date().getTime();

		      this._requestionAnimationFrameID = window.requestAnimationFrame(this._tick.bind(this));
		    }
		  }, {
		    key: "_destroy",
		    value: function _destroy() {
		      window.cancelAnimationFrame(this._requestionAnimationFrameID);
		      this._options = null;
		    }
		  }, {
		    key: "_tick",
		    value: function _tick() {
		      var now = new Date().getTime();

		      var delta = (now - this._lastTime) / this._time;
		      this._lastTime = now;

		      // pass in normalised delta
		      var normalisedAnimatedX = this._animator.step(delta);

		      if (this._animator.isFinished() === false) {
		        this._x = this._startX + (this._endX - this._startX) * normalisedAnimatedX;
		        this._options.update(this._x);
		        this._requestionAnimationFrameID = window.requestAnimationFrame(this._tick.bind(this));
		      } else {
		        this._x = this._endX;
		        this._options.update(this._x);
		        this._options.complete();
		        this._isAnimating = false;
		      }
		    }
		  }], [{
		    key: "getValue",
		    value: function getValue(animatorType, animatorOptions, time) {
		      return MotionTween._getValue(animatorType, animatorOptions, time);
		    }
		  }, {
		    key: "_getValue",
		    value: function _getValue(animatorType, animatorOptions, time) {
		      switch (animatorType) {
		        case _animatorsCubicBezier2["default"].Type:
		          return _animatorsCubicBezier2["default"].getValue(animatorOptions, time);
		          break;
		        default:
		          return _animatorsEase2["default"].getValue(animatorOptions, time);
		      }
		    }
		  }]);

		  return MotionTween;
		})();

		exports["default"] = MotionTween;
		module.exports = exports["default"];

	/***/ },
	/* 5 */
	/***/ function(module, exports) {

		'use strict';

		Object.defineProperty(exports, '__esModule', {
		    value: true
		});

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

		var Utils = (function () {
		    function Utils() {
		        _classCallCheck(this, Utils);
		    }

		    _createClass(Utils, [{
		        key: 'extend',
		        value: function extend(destination, source) {
		            var isDeep = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

		            var hasDepth = false;
		            for (var property in source) {
		                hasDepth = false;
		                if (isDeep === true && source[property] && source[property].constructor) {
		                    if (source[property].constructor === Object) {
		                        hasDepth = true;
		                        destination[property] = this.extend({}, source[property], true);
		                    } else if (source[property].constructor === Function) {
		                        // if (window.console) console.warn("Can't clone, can only reference Functions");
		                        hasDepth = false;
		                    }
		                }
		                if (hasDepth === false) {
		                    destination[property] = source[property];
		                }
		            }
		            return destination;
		        }
		    }, {
		        key: 'sum',
		        value: function sum(arr) {
		            var sum = 0;
		            var d = arr.length;
		            while (d--) {
		                sum += arr[d];
		            }
		            return sum;
		        }
		    }]);

		    return Utils;
		})();

		exports['default'] = new Utils();

		(function () {
		    var lastTime = 0;
		    var vendors = ['ms', 'moz', 'webkit', 'o'];
		    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		    }

		    if (!window.requestAnimationFrame) {
		        window.requestAnimationFrame = function (callback, element) {
		            var currTime = new Date().getTime();
		            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		            var id = window.setTimeout(function () {
		                callback(currTime + timeToCall);
		            }, timeToCall);
		            lastTime = currTime + timeToCall;
		            return id;
		        };
		    }

		    if (!window.cancelAnimationFrame) {
		        window.cancelAnimationFrame = function (id) {
		            clearTimeout(id);
		        };
		    }
		})();
		module.exports = exports['default'];

	/***/ },
	/* 6 */
	/***/ function(module, exports) {

		// t: current time, b: begInnIng value, c: change In value, d: duration
		"use strict";

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.swing = swing;
		exports.easeInQuad = easeInQuad;
		exports.easeOutQuad = easeOutQuad;
		exports.easeInOutQuad = easeInOutQuad;
		exports.easeInCubic = easeInCubic;
		exports.easeOutCubic = easeOutCubic;
		exports.easeInOutCubic = easeInOutCubic;
		exports.easeInQuart = easeInQuart;
		exports.easeOutQuart = easeOutQuart;
		exports.easeInOutQuart = easeInOutQuart;
		exports.easeInQuint = easeInQuint;
		exports.easeOutQuint = easeOutQuint;
		exports.easeInOutQuint = easeInOutQuint;
		exports.easeInSine = easeInSine;
		exports.easeOutSine = easeOutSine;
		exports.easeInOutSine = easeInOutSine;
		exports.easeInExpo = easeInExpo;
		exports.easeOutExpo = easeOutExpo;
		exports.easeInOutExpo = easeInOutExpo;
		exports.easeInCirc = easeInCirc;
		exports.easeOutCirc = easeOutCirc;
		exports.easeInOutCirc = easeInOutCirc;
		exports.easeInElastic = easeInElastic;
		exports.easeOutElastic = easeOutElastic;
		exports.easeInOutElastic = easeInOutElastic;
		exports.easeInBack = easeInBack;
		exports.easeOutBack = easeOutBack;
		exports.easeInOutBack = easeInOutBack;
		exports.easeInBounce = easeInBounce;
		exports.easeOutBounce = easeOutBounce;
		exports.easeInOutBounce = easeInOutBounce;

		function swing(t, b, c, d) {
			return easeOutQuad(t, b, c, d);
		}

		function easeInQuad(t, b, c, d) {
			return c * (t /= d) * t + b;
		}

		function easeOutQuad(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		}

		function easeInOutQuad(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t + b;
			return -c / 2 * (--t * (t - 2) - 1) + b;
		}

		function easeInCubic(t, b, c, d) {
			return c * (t /= d) * t * t + b;
		}

		function easeOutCubic(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b;
		}

		function easeInOutCubic(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		}

		function easeInQuart(t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
		}

		function easeOutQuart(t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		}

		function easeInOutQuart(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		}

		function easeInQuint(t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b;
		}

		function easeOutQuint(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		}

		function easeInOutQuint(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		}

		function easeInSine(t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		}

		function easeOutSine(t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		}

		function easeInOutSine(t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
		}

		function easeInExpo(t, b, c, d) {
			return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
		}

		function easeOutExpo(t, b, c, d) {
			return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		}

		function easeInOutExpo(t, b, c, d) {
			if (t == 0) return b;
			if (t == d) return b + c;
			if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		}

		function easeInCirc(t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
		}

		function easeOutCirc(t, b, c, d) {
			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
		}

		function easeInOutCirc(t, b, c, d) {
			if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
		}

		function easeInElastic(t, b, c, d) {
			var s = 1.70158;var p = 0;var a = c;
			if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
			if (a < Math.abs(c)) {
				a = c;var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		}

		function easeOutElastic(t, b, c, d) {
			var s = 1.70158;var p = 0;var a = c;
			if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
			if (a < Math.abs(c)) {
				a = c;var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		}

		function easeInOutElastic(t, b, c, d) {
			var s = 1.70158;var p = 0;var a = c;
			if (t == 0) return b;if ((t /= d / 2) == 2) return b + c;if (!p) p = d * (.3 * 1.5);
			if (a < Math.abs(c)) {
				a = c;var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
		}

		function easeInBack(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		}

		function easeOutBack(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		}

		function easeInOutBack(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
		}

		function easeInBounce(t, b, c, d) {
			return c - easeOutBounce(d - t, 0, c, d) + b;
		}

		function easeOutBounce(t, b, c, d) {
			if ((t /= d) < 1 / 2.75) {
				return c * (7.5625 * t * t) + b;
			} else if (t < 2 / 2.75) {
				return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
			} else if (t < 2.5 / 2.75) {
				return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
			} else {
				return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
			}
		}

		function easeInOutBounce(t, b, c, d) {
			if (t < d / 2) return easeInBounce(t * 2, 0, c, d) * .5 + b;
			return easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
		}

	/***/ },
	/* 7 */
	/***/ function(module, exports) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var CubicBezier = (function () {
		  _createClass(CubicBezier, null, [{
		    key: "DEFAULT_OPTIONS",
		    value: {
		      tolerance: 0.001,
		      controlPoints: [.15, .66, .83, .67]
		    },
		    enumerable: true
		  }, {
		    key: "Type",
		    value: "CubicBezier",
		    enumerable: true
		  }]);

		  function CubicBezier(options) {
		    _classCallCheck(this, CubicBezier);

		    // merge default with passed
		    this._options = _extends({}, CubicBezier.DEFAULT_OPTIONS, options);

		    this._x = 0;
		    this._time = 0;
		  }

		  _createClass(CubicBezier, [{
		    key: "step",
		    value: function step(delta) {
		      // t: current time, b: begInnIng value, c: change In value, d: duration
		      this._time += delta;
		      this._x = CubicBezier._getPointOnBezierCurve(this._options.controlPoints, this._time);
		      return this._x;
		    }
		  }, {
		    key: "isFinished",
		    value: function isFinished() {
		      return this._time >= 1;
		    }
		  }], [{
		    key: "getValue",
		    value: function getValue(options, time) {
		      return CubicBezier._getPointOnBezierCurve(options.controlPoints, time);
		    }
		  }, {
		    key: "_getPointOnBezierCurve",
		    value: function _getPointOnBezierCurve(controlPoints, l) {
		      var a1 = { x: 0, y: 0 };
		      var a2 = { x: 1, y: 1 };

		      var c1 = { x: controlPoints[0], y: controlPoints[1] };
		      var c2 = { x: controlPoints[2], y: controlPoints[3] };

		      var b1 = CubicBezier._interpolate(a1, c1, l);
		      var b2 = CubicBezier._interpolate(c1, c2, l);
		      var b3 = CubicBezier._interpolate(c2, a2, l);

		      c1 = CubicBezier._interpolate(b1, b2, l);
		      c2 = CubicBezier._interpolate(b2, b3, l);

		      return CubicBezier._interpolate(c1, c2, l).y;
		    }
		  }, {
		    key: "_interpolate",
		    value: function _interpolate(p1, p2, l) {
		      var p3 = {};

		      p3.x = p1.x + (p2.x - p1.x) * l;
		      p3.y = p1.y + (p2.y - p1.y) * l;

		      return p3;
		    }
		  }]);

		  return CubicBezier;
		})();

		exports["default"] = CubicBezier;
		module.exports = exports["default"];

	/***/ },
	/* 8 */
	/***/ function(module, exports, __webpack_require__) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var _Easing = __webpack_require__(6);

		var Easing = _interopRequireWildcard(_Easing);

		var Ease = (function () {
		  _createClass(Ease, null, [{
		    key: "DEFAULT_OPTIONS",
		    value: {
		      tolerance: 0.001,
		      easingFunction: Easing.easeOutQuad
		    },
		    enumerable: true
		  }, {
		    key: "Type",
		    value: "Ease",
		    enumerable: true
		  }]);

		  function Ease(options) {
		    _classCallCheck(this, Ease);

		    // merge default with passed
		    this._options = _extends({}, Ease.DEFAULT_OPTIONS, options);

		    this._x = 0;
		    this._time = 0;
		  }

		  _createClass(Ease, [{
		    key: "step",
		    value: function step(delta) {
		      // t: current time, b: begInnIng value, c: change In value, d: duration
		      this._time += delta;
		      this._x = this._options.easingFunction(this._time, 0, 1, 1);
		      return this._x;
		    }
		  }, {
		    key: "isFinished",
		    value: function isFinished() {
		      return this._time >= 1;
		    }
		  }], [{
		    key: "getValue",
		    value: function getValue(options, time) {
		      return options.easingFunction(time, 0, 1, 1);
		    }
		  }]);

		  return Ease;
		})();

		exports["default"] = Ease;
		module.exports = exports["default"];

	/***/ },
	/* 9 */
	/***/ function(module, exports) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var Friction = (function () {
		  _createClass(Friction, null, [{
		    key: "DEFAULT_OPTIONS",
		    value: {
		      applyAcceleration: function applyAcceleration(accel) {
		        return accel;
		      },
		      friction: 0.1,
		      destination: 1,
		      tolerance: 0.001
		    },
		    enumerable: true
		  }, {
		    key: "Type",
		    value: "FRICTION",
		    enumerable: true
		  }]);

		  function Friction(options) {
		    _classCallCheck(this, Friction);

		    // merge default with passed
		    this._options = _extends({}, Friction.DEFAULT_OPTIONS, options);
		    this._v = 0;
		    this._x = 0;
		    this._acceleration = (this._options.destination - this._x) * this._options.friction;
		    this._previousX = 0;
		  }

		  _createClass(Friction, [{
		    key: "step",
		    value: function step(delta) {
		      // delta is ignored in the FrictionAnimator
		      this._acceleration = this._options.applyAcceleration(this._acceleration);

		      this._v += this._acceleration;
		      this._x += this._v;
		      this._v *= 1 - this._options.friction;

		      // reset the acceleration as this is set initially
		      this._acceleration = 0;
		      this._previousX = this._x;

		      return this._x;
		    }
		  }, {
		    key: "isFinished",
		    value: function isFinished() {
		      return Math.round(this._v / this._options.tolerance) === 0 && Math.round(this._x / this._options.tolerance) === 1 / this._options.tolerance ? true : false;
		    }
		  }]);

		  return Friction;
		})();

		exports["default"] = Friction;
		module.exports = exports["default"];

	/***/ },
	/* 10 */
	/***/ function(module, exports) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var Spring = (function () {
		  _createClass(Spring, null, [{
		    key: "DEFAULT_OPTIONS",
		    value: {
		      stiffness: 100,
		      damping: 20,
		      tolerance: 0.001
		    },
		    enumerable: true
		  }, {
		    key: "Type",
		    value: "SPRING",
		    enumerable: true
		  }]);

		  function Spring(options) {
		    _classCallCheck(this, Spring);

		    // merge default with passed
		    this._options = _extends({}, Spring.DEFAULT_OPTIONS, options);

		    this._v = 0;
		    this._x = 0;
		  }

		  _createClass(Spring, [{
		    key: "step",
		    value: function step(delta) {
		      var k = 0 - this._options.stiffness;
		      var b = 0 - this._options.damping;

		      var F_spring = k * (this._x - 1);
		      var F_damper = b * this._v;

		      var mass = 1;

		      this._v += (F_spring + F_damper) / mass * delta;
		      this._x += this._v * delta;

		      return this._x;
		    }
		  }, {
		    key: "isFinished",
		    value: function isFinished() {
		      return Math.round(this._v / this._options.tolerance) === 0 && Math.round(this._x / this._options.tolerance) === 1 / this._options.tolerance ? true : false;
		    }
		  }]);

		  return Spring;
		})();

		exports["default"] = Spring;
		module.exports = exports["default"];

	/***/ },
	/* 11 */
	/***/ function(module, exports) {

		// r4k from http://mtdevans.com/2013/05/fourth-order-runge-kutta-algorithm-in-javascript-with-demo/
		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

		var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var SpringRK4 = (function () {
		  _createClass(SpringRK4, null, [{
		    key: "DEFAULT_OPTIONS",
		    value: {
		      stiffness: 100,
		      damping: 20,
		      tolerance: 0.001
		    },
		    enumerable: true
		  }, {
		    key: "Type",
		    value: "SPRINGRK4",
		    enumerable: true
		  }]);

		  function SpringRK4(options) {
		    _classCallCheck(this, SpringRK4);

		    // merge default with passed
		    this._options = _extends({}, SpringRK4.DEFAULT_OPTIONS, options);

		    // set position to 1 as we are wanting the result normalised
		    this._state = {
		      x: 1,
		      v: 0
		    };
		  }

		  _createClass(SpringRK4, [{
		    key: "_rk4",
		    value: function _rk4(state, a, dt) {
		      var x = state.x;
		      var v = state.v;
		      // Returns final (position, velocity) array after time dt has passed.
		      //        x: initial position
		      //        v: initial velocity
		      //        a: acceleration function a(x,v,dt) (must be callable)
		      //        dt: timestep
		      var x1 = x;
		      var v1 = v;
		      var a1 = a(x1, v1, 0);

		      var x2 = x + 0.5 * v1 * dt;
		      var v2 = v + 0.5 * a1 * dt;
		      var a2 = a(x2, v2, dt / 2);

		      var x3 = x + 0.5 * v2 * dt;
		      var v3 = v + 0.5 * a2 * dt;
		      var a3 = a(x3, v3, dt / 2);

		      var x4 = x + v3 * dt;
		      var v4 = v + a3 * dt;
		      var a4 = a(x4, v4, dt);

		      var xf = x + dt / 6 * (v1 + 2 * v2 + 2 * v3 + v4);
		      var vf = v + dt / 6 * (a1 + 2 * a2 + 2 * a3 + a4);

		      return {
		        x: xf,
		        v: vf
		      };
		    }
		  }, {
		    key: "_acceleration",
		    value: function _acceleration(x, v, dt) {
		      // This particular one models a spring with a 1kg mass
		      return -this._options.stiffness * x - this._options.damping * v;
		    }
		  }, {
		    key: "step",
		    value: function step(delta) {
		      this._state = this._rk4(this._state, this._acceleration.bind(this), delta);
		      // the calculation gives values starting from 1 and then finishing at 0,
		      // we need to transform the values to work from 0 to 1.
		      return (this._state.x - 1) * -1;
		    }
		  }, {
		    key: "isFinished",
		    value: function isFinished() {
		      return Math.round(this._state.v / this._options.tolerance) === 0 && Math.round(this._state.x / this._options.tolerance) === 0 ? true : false;
		    }
		  }]);

		  return SpringRK4;
		})();

		exports["default"] = SpringRK4;
		module.exports = exports["default"];

	/***/ }
	/******/ ])
	});
	;

/***/ }
/******/ ])
});
;