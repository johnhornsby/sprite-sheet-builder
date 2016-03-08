import {InteractiveTimeline, Tween, MotionTween} from "timeline";

import PIXI from "pixi.js/bin/pixi";

import SpriteSheetBuilder from "../../dist/sprite-sheet-builder";

import InteractiveSprite from './interactive-sprite';

import {timeline} from './animation/hotspot'

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

		this._frameWidth = 128;
		this._frameHeight = 128;


		// Create and build a SpriteSheet
		const spriteSheetBuilder = SpriteSheetBuilder.instance;
		const options = {
			timeline: this._timeline,
			frameWidth: this._frameWidth,
			frameHeight: this._frameHeight,
			identifier: "ring",
			fps: 60,
			draw: (ctx, timelineState) => {
				// this._draw(ctx, timelineState);
				this._stateTreeExplorer(timelineState, ctx)
			}
		}
		spriteSheetBuilder.build(options);


		// Use the finished canvas, convert into PIXI texture
		const cavnasArray = spriteSheetBuilder.getSpriteSheetCanvas();

		let baseTexture, texture, canvas;

		for (let i = 0; i < cavnasArray.length; i++) {
			baseTexture = PIXI.BaseTexture.fromCanvas(spriteSheetBuilder.getSpriteSheetCanvas()[0]);
			texture = new PIXI.Texture(baseTexture);
			PIXI.Texture.addTextureToCache(texture, `animation-${i}`);
		}

		


		// Parse SpriteSheet data to cache textures
		// this._parseJSON(spriteSheetBuilder.getSpriteSheetJSONData()[0].frames, baseTexture);

		this._build();
		this._render();

		// Create an interactive sprite and feed it the texture and timeline
		const interactiveSprite = new InteractiveSprite(texture, spriteSheetBuilder.getSpriteSheetTimeline());
		this._rootContainer.addChild(interactiveSprite);
		interactiveSprite.play();


		// render out the complete sprite sheet so we can see it
		for (let i = 0; i < cavnasArray.length; i++) {
			canvas = document.createElement('canvas');
			canvas.width = spriteSheetBuilder.getSpriteSheetCanvas()[i].width;
			canvas.height = spriteSheetBuilder.getSpriteSheetCanvas()[i].height;
			canvas.getContext("2d").drawImage(spriteSheetBuilder.getSpriteSheetCanvas()[i], 0, 0);
			document.body.appendChild(canvas);
		}
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
		this._timeline = timeline
	}


	_stateTreeExplorer(timelineState, ctx) {

		switch(timelineState.name) {

			case "ripple":
				this._drawRipple(timelineState, ctx);
				break;

			case "ring":
				this._drawRing(timelineState, ctx);
				break;

			case "plus":
				this._drawPlus(timelineState, ctx);
				break;
		}

		for (let prop in timelineState.children) {
			this._stateTreeExplorer(timelineState.children[prop], ctx);
		}
	}


	_drawRipple(timelineState, ctx) {
		const radius = timelineState.properties.radius;
		const alpha = timelineState.properties.alpha;

		ctx.beginPath();
		ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
		ctx.lineWidth = 1;
		ctx.arc(this._frameWidth / 2, this._frameHeight / 2, radius, 0, 2 * Math.PI);
		ctx.stroke();
	}


	_drawRing(timelineState, ctx) {
		const radius = timelineState.properties.radius;
		const alpha = timelineState.properties.alpha;
		const width = timelineState.properties.width;

		ctx.beginPath();
		ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
		ctx.lineWidth = width;
		ctx.arc(this._frameWidth / 2, this._frameHeight / 2, radius, 0, 2 * Math.PI);
		ctx.stroke();
	}


	_drawPlus(timelineState, ctx) {
		const width = timelineState.properties.width;

		ctx.fillStyle = "white";
		ctx.fillRect((this._frameWidth - width) / 2, this._frameHeight / 2, width, 1);
		ctx.fillRect(this._frameWidth / 2, (this._frameHeight - width) / 2, 1, width);
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