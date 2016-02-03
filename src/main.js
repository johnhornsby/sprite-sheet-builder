import {Timeline, Tween, MotionTween} from "timeline";

class Main {


	_timeline = null;

	constructor() {

		this._init();
	}


	_init() {
		this._createTimeline();
		this._outputFrames();
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
		document.body.appendChild(canvas);

		const width = 2048 / 16;
		const height = 2048 / 16;

		let frame = {
			x: 0,
			y: 0,
			width: width,
			height: height
		}

		const context = canvas.getContext("2d");

		this._drawFrame(context, frame);
	}


	_drawFrame(context, frameRect) {
		const radius = this._timeline.getState(500).get("ring-1").radius;
		context.beginPath();
		context.arc(frameRect.width / 2 ,frameRect.height / 2 ,radius ,0 ,2*Math.PI);
		context.stroke();
	}
}

new Main();