import {InteractiveTimeline, Tween, MotionTween} from "timeline";

const _DEFAULT_OPTIONS = {
	timeline: null,
	frameWidth: null,
	frameHeight: null,
	identifier: "",
	fps: 60,
	draw: function(ctx, timelineState) {}
};

const _SHEET_DIMENSIONS = [
	128,
	256,
	512,
	1024,
	2048
]

let singleton = Symbol();
let singletonEnforcer = Symbol();

class SpriteSheetBuilder {

	static get instance() {
		if (!this[singleton]) {
			this[singleton] = new SpriteSheetBuilder(singletonEnforcer);

			this[singleton]._init();
		}

		return this[singleton];
	}


	_canvasBuffers = [];

	_frameLength = 0;

	_sheetData = [];

	_sheetIndex = -1;

	_sheetTimeline = null;


	constructor(enforcer) {
		if (enforcer != singletonEnforcer) throw new Exception("Cannot construct singleton");
	}



	/*_______________________________________________

	PUBLIC
	_______________________________________________*/

	build(options) { this._build(options); }

	getSpriteSheetJSONData() { return this._sheetData; }

	getSpriteSheetImageData() { return this._getSpriteSheetImageData(); }

	getSpriteSheetTimeline() { return this._sheetTimeline; }

	getSpriteSheetCanvas() { return this._getSpriteSheetCanvas(); }

	get sheetLength() { return this._canvasBuffers.length; }

	get frameLength() { return this._frameLength; }







	/*_______________________________________________

	PRIVATE
	_______________________________________________*/

	_init() {}


	_build(options) {

		this._options = {
			..._DEFAULT_OPTIONS,
			...options
		}

		// clear and reset ready to rebuild
		this._clearBuffers();

		// compile the json data beforehand, calculate the sheets needed
		this._initiateMetrics();

		// create a timeline with the frames coords set as keyframe, ready for a sprite to read
		this._compileTimeline();

		// call the draw function for every frame
		this._executeDraw();
	}


	_initiateMetrics() {
		// frameLength will always equal or less timelime
		this._frameLength = Math.floor(this._options.timeline.duration / (1000 / this._options.fps));

		this._sheetData = this._determinMinimumSheetSize(this._frameLength);

		for (let sheetIndex in this._sheetData) {
			if (sheetIndex >= this._canvasBuffers.length) {
				const canvas = document.createElement("canvas");
				canvas.width = _SHEET_DIMENSIONS[_SHEET_DIMENSIONS.length -1];
				canvas.height = _SHEET_DIMENSIONS[_SHEET_DIMENSIONS.length -1];

				this._canvasBuffers.push(canvas);
			}
		}
	}


	_compileTimeline() {
		let frameIndex = 0;
		let sheetIndex = 0;
		let frame, time;

		const propertyKeyframes = {
			frame: []
		}

		const frames = propertyKeyframes.frame;

		for (let sheet of this._sheetData) {
			for (let frameKey of Object.keys(sheet.frames)) {

				time = frameIndex * (1000 / this._options.fps);
				frame = sheet.frames[frameKey].frame;

				frames.push({
					value: `${frame.x},${frame.y},${frame.w},${frame.h}`,
				 	time: time,
				 	hold: true
				});
			
				frameIndex += 1;
			}

			sheetIndex += 1;
		}

		// const tween = new Tween(propertyKeyframes, `frames`, { loop: false, fillMode: 0 });
		const tween = new Tween(`frames`);
		tween.addKeyframes(propertyKeyframes);

		this._sheetTimeline = new InteractiveTimeline("sprite-sheet-timeline");
		this._sheetTimeline.addChild(tween, { loop: false, fillMode: "both" });

		const sequences = this._options.timeline.getSequences();
		if (sequences.length > 0) {
			this._sheetTimeline.setSequences([...sequences]);
		}
	}


	_determinMinimumSheetSize(length, sheetIndex = 0) {
		let maxCells;
		let sheetData = [];
		let data;
		let dimension
		// @TODO we need to be able to use non square sheets
		for (dimension of _SHEET_DIMENSIONS) {
			maxCells = this._getSheetMaxCells(dimension);
			if (length <= maxCells) {
				break;
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


	_composeSheetData(dimension, frameLength, sheetIndex) {
		let frameData;

		let frameIndex = sheetIndex * this._getSheetMaxCells();
		let maxIndex = frameIndex + frameLength;
		const maxRows = Math.floor(dimension / this._options.frameHeight);
		const maxCols = Math.floor(dimension / this._options.frameWidth);
		let x, y;
		const sheetData = {
			"frames": {},
			"meta": {
				"format": "RGBA8888",
				"size": {
					"w": dimension,
					"h": dimension
				},
				"scale": "1",
			}
		}

		for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
			for (let colIndex = 0; colIndex < maxCols; colIndex++) {

				x = colIndex * this._options.frameWidth;
				y = rowIndex * this._options.frameHeight;

				sheetData.frames[`${this._options.identifier}${frameIndex}`] = {
					"frame": {"x":x,"y":y,"w":this._options.frameWidth,"h":this._options.frameHeight},
					"rotated": false,
					"trimmed": false,
					"spriteSourceSize": {"x":0,"y":0,"w":this._options.frameWidth,"h":this._options.frameHeight},
					"sourceSize": {"w":this._options.frameWidth,"h":this._options.frameHeight},
					"pivot": {"x":0.5,"y":0.5}	
				};

				frameIndex += 1;

				if (frameIndex > maxIndex) {
					return sheetData;
				}
			}
		}

		return sheetData;
	}


	_getSheetMaxCells(dimension) {
		if (dimension == null) {
			dimension = _SHEET_DIMENSIONS[_SHEET_DIMENSIONS.length -1];
		}
		return Math.floor(dimension / this._options.frameWidth) * Math.floor(dimension / this._options.frameHeight);
	}


	_executeDraw() {
		let ctx, time, frameData;
		let frameIndex = 0;
		let sheetIndex = 0;

		for (let sheet of this._sheetData) {
			for (let frameKey of Object.keys(sheet.frames)) {

				time = frameIndex * (1000 / this._options.fps);

				ctx = this._canvasBuffers[sheetIndex].getContext("2d");

				this._drawSprite(ctx, time, sheet.frames[frameKey].frame);
			
				frameIndex += 1;
			}

			sheetIndex += 1;
		}
	}


	_drawSprite(ctx, time, frameRect) {
		// reset context
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		// position context
		ctx.translate(frameRect.x, frameRect.y);
		// get state
		const state = this._options.timeline.getState(time);
		// request draw
		this._options.draw(ctx, state);
	}


	_clearBuffers() {
		for (let canvas of this._canvasBuffers) {
			canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		}
	}


	_getSpriteSheetImageData() {
		const spriteSheetImageData = [];
		for (let i = 0; i < this._sheetData.length; i++) {
			spriteSheetImageData.push(this._canvasBuffers[i].getContext("2d").getImageData(0, 0, this._sheetData[i].meta.size.w, this._sheetData[i].meta.size.h));
		}

		return spriteSheetImageData;
	}


	_getSpriteSheetCanvas() {
		const spriteSheetCanvas = [];
		let canvas;
		for (let i = 0; i < this._sheetData.length; i++) {
			canvas = document.createElement('canvas');
			canvas.width = this._sheetData[i].meta.size.w;
			canvas.height = this._sheetData[i].meta.size.h;
			canvas.getContext("2d").drawImage(this._canvasBuffers[i], 0, 0);
			spriteSheetCanvas.push(canvas);
		}

		return spriteSheetCanvas;
	}
} 

export default SpriteSheetBuilder;