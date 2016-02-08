"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _timeline = require("timeline");

var _pixiJsBinPixi = require("pixi.js/bin/pixi");

var _pixiJsBinPixi2 = _interopRequireDefault(_pixiJsBinPixi);

var _spriteSheetBuilder = require('./sprite-sheet-builder');

var _spriteSheetBuilder2 = _interopRequireDefault(_spriteSheetBuilder);

var _interactiveSprite = require('./interactive-sprite');

var _interactiveSprite2 = _interopRequireDefault(_interactiveSprite);

var step = 0;

var Main = (function () {
	function Main() {
		_classCallCheck(this, Main);

		this._timeline = null;
		this._frameWidth = 0;
		this._frameHeight = 0;
		this._renderer = null;
		this._canvasContainer = null;
		this._rootContainer = null;

		this._init();
	}

	_createClass(Main, [{
		key: "_init",
		value: function _init() {
			var _this = this;

			this._render = this._render.bind(this);
			this._createTimeline();

			this._frameWidth = 128;
			this._frameHeight = 128;

			// Create and build a SpriteSheet
			var spriteSheetBuilder = _spriteSheetBuilder2["default"].instance;
			var options = {
				timeline: this._timeline,
				frameWidth: this._frameWidth,
				frameHeight: this._frameHeight,
				identifier: "ring",
				fps: 60,
				draw: function draw(ctx, timelineState) {
					_this._draw(ctx, timelineState);
				}
			};
			spriteSheetBuilder.build(options);

			// Use the finished canvas, convert into PIXI texture
			var baseTexture = _pixiJsBinPixi2["default"].BaseTexture.fromCanvas(spriteSheetBuilder.getSpriteSheetCanvas()[0]);
			var texture = new _pixiJsBinPixi2["default"].Texture(baseTexture);
			_pixiJsBinPixi2["default"].Texture.addTextureToCache(texture, "animation");

			// Parse SpriteSheet data to cache textures
			// this._parseJSON(spriteSheetBuilder.getSpriteSheetJSONData()[0].frames, baseTexture);

			this._build();
			this._render();

			// Create an interactive sprite and feed it the texture and timeline
			var interactiveSprite = new _interactiveSprite2["default"](texture, spriteSheetBuilder.getSpriteSheetTimeline());
			this._rootContainer.addChild(interactiveSprite);
			interactiveSprite.play();
		}
	}, {
		key: "_build",
		value: function _build() {
			this._canvasContainer = document.createElement('div');
			this._canvasContainer.width = 128;
			this._canvasContainer.height = 128;
			document.body.appendChild(this._canvasContainer);
			this._renderer = _pixiJsBinPixi2["default"].autoDetectRenderer(128, 128, { antialias: false });
			this._canvasContainer.appendChild(this._renderer.view);
			this._rootContainer = new _pixiJsBinPixi2["default"].Container();
		}
	}, {
		key: "_render",
		value: function _render() {
			this._renderer.render(this._rootContainer);

			window.requestAnimationFrame(this._render);
		}
	}, {
		key: "_createTimeline",
		value: function _createTimeline() {
			this._timeline = new _timeline.InteractiveTimeline();

			var keyframes = {
				radius: [{
					value: 0,
					time: 0,
					animatorType: _timeline.MotionTween.animatorType.cubicBezier,
					animatorOptions: {
						controlPoints: [.15, .66, .83, .67]
					}
				}, {
					value: 50,
					time: 1000
				}]
			};

			var tween = new _timeline.Tween(keyframes, "ring-1", { loop: false, fillMode: 0 });

			var sequences = [{
				time: 0,
				duration: 1000,
				label: "intro",
				next: "intro"
			}];

			this._timeline.addTween(tween, 0);
			this._timeline.setSequences(sequences);
		}
	}, {
		key: "_draw",
		value: function _draw(ctx, state) {
			var radius = state.get("ring-1").radius;

			ctx.beginPath();
			ctx.strokeStyle = "white";
			ctx.arc(this._frameWidth / 2, this._frameHeight / 2, radius, 0, 2 * Math.PI);
			ctx.stroke();
		}
	}, {
		key: "_parseJSON",
		value: function _parseJSON(json, baseTexture) {
			var frames = json;
			var resolution = 1;

			for (var i in frames) {
				var rect = frames[i].frame;

				if (rect) {
					var size = null;
					var trim = null;

					if (frames[i].rotated) {
						size = new _pixiJsBinPixi2["default"].Rectangle(rect.x, rect.y, rect.h, rect.w);
					} else {
						size = new _pixiJsBinPixi2["default"].Rectangle(rect.x, rect.y, rect.w, rect.h);
					}

					//  Check to see if the sprite is trimmed
					if (frames[i].trimmed) {
						trim = new _pixiJsBinPixi2["default"].Rectangle(frames[i].spriteSourceSize.x / resolution, frames[i].spriteSourceSize.y / resolution, frames[i].sourceSize.w / resolution, frames[i].sourceSize.h / resolution);
					}

					// flip the width and height!
					if (frames[i].rotated) {
						var temp = size.width;
						size.width = size.height;
						size.height = temp;
					}

					size.x /= resolution;
					size.y /= resolution;
					size.width /= resolution;
					size.height /= resolution;

					// lets also add the frame to pixi's global cache for fromFrame and fromImage functions
					_pixiJsBinPixi2["default"].utils.TextureCache[i] = new _pixiJsBinPixi2["default"].Texture(baseTexture, size, size.clone(), trim, frames[i].rotated);
				}
			}
		}
	}]);

	return Main;
})();

new Main();