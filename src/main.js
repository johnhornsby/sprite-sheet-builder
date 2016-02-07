import {InteractiveTimeline, Tween, MotionTween} from "timeline";
import Rectangle from './lib/geom/rectangle';
import PIXI from "pixi.js/bin/pixi";

import SpriteSheetBuilder from './sprite-sheet-builder';

let step = 0;

class Main {


	_timeline = null;

	_frameWidth = 0;

	_frameHeight = 0;

	_renderer = null;

	_canvasContainer = null;

	_rootContainer = null;



	constructor() {

		this._init();
	}


	_init() {
		this._render = ::this._render;
		this._createTimeline();

		this._frameWidth = 2048 / 16;
		this._frameHeight = 2048 / 16;

		const spriteSheetBuilder = SpriteSheetBuilder.instance;
		const options = {
			timeline: this._timeline,
			frameWidth: this._frameWidth,
			frameHeight: this._frameHeight,
			identifier: "ring-",
			fps: 60,
			draw: (ctx, timelineState) => {
				this._draw(ctx, timelineState);
			}
		}
		spriteSheetBuilder.build(options);

		const jsonData = spriteSheetBuilder.getSpriteSheetJSONData();
		const imageData = spriteSheetBuilder.getSpriteSheetImageData();
		const timeline = spriteSheetBuilder.getSpriteSheetTimeline();
		const numberOfFrames = spriteSheetBuilder.frameLength;

		

		const baseTextureSource = document.createElement('canvas');
		baseTextureSource.width = jsonData[0].meta.size.w;
		baseTextureSource.height = jsonData[0].meta.size.h;
		baseTextureSource.getContext("2d").putImageData(imageData[0],0,0);

		const baseTexture = PIXI.BaseTexture.fromCanvas(baseTextureSource);
		const texture = new PIXI.Texture(baseTexture);
		PIXI.Texture.addTextureToCache(texture, "animation");

		this._parseJSON(jsonData[0].frames, baseTexture);

		this._build();
		this._render();

		var textureArray = [];

		for (var i=0; i < numberOfFrames; i++)
		{
			let texture = PIXI.Texture.fromFrame(`ring-${i}`);
			textureArray.push(texture);
		};

		var mc = new PIXI.extras.MovieClip(textureArray);

		this._rootContainer.addChild(mc);
		mc.loop = false;
		setTimeout(() => {
			mc.play();
		}, 1000);
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
		this._timeline = new InteractiveTimeline();

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



	_draw(ctx, state) {
		const radius = state.get("ring-1").radius;

		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.arc(this._frameWidth / 2, this._frameHeight / 2, radius, 0, 2 * Math.PI);
		ctx.stroke();
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