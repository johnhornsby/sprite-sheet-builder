import {Timeline, Tween, MotionTween} from "timeline";
import Rectangle from './lib/geom/rectangle';
import PIXI from "pixi.js/bin/pixi";

let step = 0;

class Main {


	_timeline = null;

	_rowIndex = 0;

	_colIndex = 0;

	_frameWidth = 0;

	_frameHeight = 0;

	_frameCanvas = [];

	_renderer = null;

	_canvasContainer = null;

	_rootContainer = null;



	constructor() {

		this._init();
	}


	_init() {
		this._render = ::this._render;
		this._createTimeline();
		this._outputFrames();

		this._build();
		this._render();

		var textureArray = [];

		for (var i=0; i < 240; i++)
		{
		     let texture = PIXI.Texture.fromFrame(`${i}`);
		     textureArray.push(texture);
		};

		var mc = new PIXI.extras.MovieClip(textureArray);

		this._rootContainer.addChild(mc);
		mc.loop = false;
		mc.play();


	}


	_build() {
		this._canvasContainer = document.createElement('div');
		this._canvasContainer.width = 128;
		this._canvasContainer.height = 128;
		document.body.appendChild(this._canvasContainer);
		this._renderer = PIXI.autoDetectRenderer(128, 128, {antialias: false});
		this._canvasContainer.appendChild(this._renderer.view);
		this._rootContainer = new PIXI.Container();
	}


	_render() {
		this._renderer.render(this._rootContainer);

		window.requestAnimationFrame(this._render);
	}


	_createTimeline() {
		this._timeline = new Timeline();

		const propertyKeyframes = {
			radius: [
				{
					value: 0,
				 	time: 0,
				 	animatorType: MotionTween.animatorType.cubicBezier,
					animatorOptions: {
						controlPoints: [.15, .66, .83, .67]
					}
				},
				{
					value: 50,
					time: 1000,
				}]
		}

		const t = new Tween(propertyKeyframes, "ring-1", { loop: false, fillMode: 0 });

		this._timeline.addTween(t, 0);
	}


	_outputFrames() {
		const canvas = document.createElement("canvas");
		canvas.width = 2048;
		canvas.height = 2048;
		// document.body.appendChild(canvas);

		// @TODO we have to assertain the width and height of the graphic really across all frames.

		this._frameWidth = 2048 / 16;
		this._frameHeight = 2048 / 16;

		const ctx = canvas.getContext("2d");
		const fps = 60;
		let time = 0;
		let state;
		let frameRect;
		const data = {
			"frames": {},
			"meta": {
				"format": "RGBA8888",
				"size": {
					"w": this._frameWidth,
					"h": this._frameHeight
				},
				"scale": "1",
			}
		};

		for (let i = 0; i < 240; i++) {
			// update time and frame
			time = i * (1000 / fps);
			frameRect = this._getNextFrameRect();
			// reset context
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			//position context
			ctx.translate(frameRect.x, frameRect.y);
			// get state
			state = this._timeline.getState(time);
			// request draw
			this._draw(ctx, state);
			// append json
			data.frames[`${i}`] = {
				"frame": {"x":frameRect.x,"y":frameRect.y,"w":frameRect.width,"h":frameRect.height},
				"rotated": false,
				"trimmed": false,
				"spriteSourceSize": {"x":0,"y":0,"w":frameRect.width,"h":frameRect.height},
				"sourceSize": {"w":frameRect.width,"h":frameRect.height},
				"pivot": {"x":0.5,"y":0.5}	
			};
		}

		const baseTexture = PIXI.BaseTexture.fromCanvas(canvas);
		const texture = new PIXI.Texture(baseTexture);
		PIXI.Texture.addTextureToCache(texture, "animation");

		this._parseJSON(data.frames, baseTexture);
	}


	_draw(ctx, state) {
		const radius = state.get("ring-1").radius;

		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.arc(this._frameWidth / 2, this._frameHeight / 2, radius, 0, 2 * Math.PI);
		ctx.stroke();
	}


	_getNextFrameRect() {
		this._colIndex += 1;

		if (this._colIndex * this._frameWidth >= 2048) {
			this._colIndex = 0;
			this._rowIndex += 1;
		}

		const x = this._colIndex * this._frameWidth;
		const y = this._rowIndex * this._frameHeight;

		return new Rectangle(x, y, this._frameWidth, this._frameHeight);
	}


	_parseJSON(json, baseTexture) {
		var frames = json;
		let resolution = 1;

        for (var i in frames)
        {
            var rect = frames[i].frame;

            if (rect)
            {
                var size = null;
                var trim = null;

                if (frames[i].rotated) {
                    size = new PIXI.Rectangle(rect.x, rect.y, rect.h, rect.w);
                }
                else {
                    size = new PIXI.Rectangle(rect.x, rect.y, rect.w, rect.h);
                }

                //  Check to see if the sprite is trimmed
                if (frames[i].trimmed)
                {
                    trim = new PIXI.Rectangle(
                        frames[i].spriteSourceSize.x / resolution,
                        frames[i].spriteSourceSize.y / resolution,
                        frames[i].sourceSize.w / resolution,
                        frames[i].sourceSize.h / resolution
                     );
                }

                // flip the width and height!
                if (frames[i].rotated)
                {
                    var temp = size.width;
                    size.width = size.height;
                    size.height = temp;
                }

                size.x /= resolution;
                size.y /= resolution;
                size.width /= resolution;
                size.height /= resolution;

                // lets also add the frame to pixi's global cache for fromFrame and fromImage functions
                PIXI.utils.TextureCache[i] = new PIXI.Texture(baseTexture, size, size.clone(), trim, frames[i].rotated);
            }
        }
	}
}

new Main();