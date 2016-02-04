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
			"frames": [],
			"meta": {
				"format": "RGBA8888",
				"size": {
					"w": this._frameWidth,
					"h": this._frameHeight
				},
				"scale": "1",
			}
		};

		for (let i = 0; i < 256; i++) {
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
			data.frames.push({
				"frame": {"x":frameRect.x,"y":frameRect.y,"w":frameRect.width,"h":frameRect.height},
				"rotated": false,
				"trimmed": false,
				"spriteSourceSize": {"x":0,"y":0,"w":frameRect.width,"h":frameRect.height},
				"sourceSize": {"w":frameRect.width,"h":frameRect.height}
			});
		}
	}


	_draw(ctx, state) {
		const radius = state.get("ring-1").radius;

		ctx.beginPath();
		ctx.arc(this._frameWidth / 2, this._frameHeight / 2, radius, 0, 2 * Math.PI);
		ctx.stroke();
	}


	_getNextFrameRect() {
		this._rowIndex += 1;

		if (this._rowIndex * this._frameWidth > 2048) {
			this._rowIndex = 0;
			this._colIndex += 1;
		}

		const x = this._rowIndex * this._frameWidth;
		const y = this._colIndex * this._frameHeight;

		return new Rectangle(x, y, this._frameWidth, this._frameHeight);
	}
}

new Main();