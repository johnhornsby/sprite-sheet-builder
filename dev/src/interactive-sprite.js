import PIXI from "pixi.js/bin/pixi";

export default class InteractiveSprite extends PIXI.Sprite {
	
	_interactiveTimeline = null;

	_currentTime = null;

	_isPlaying = false;


	constructor(texture, interactiveTimeline) {
		super(texture);


		this._interactiveTimeline = interactiveTimeline;

		this._init();
	}






	/*_______________________________________________

	PUBLIC
	_______________________________________________*/

	play() { this._play(); }

	stop() { this._stop(); }







	/*_______________________________________________

	PRIVATE
	_______________________________________________*/

	_init() {
		const state = this._interactiveTimeline.getState(0);
		const frame = state.children[0].properties.frame.split(",").map(value => parseInt(value));

		this._texture.frame = new PIXI.Rectangle(frame[0], frame[1], frame[2], frame[3]);
	}


	_play() {
		if (this._isPlaying) {
			return;
		}

		this._isPlaying = true;

		PIXI.ticker.shared.add(this._update, this);
	}


	_stop() {
		if (this._isPlaying === false) {
			return;
		}

		this._isPlaying = false;

		PIXI.ticker.shared.remove(this._update, this);
	}


	_update(deltaTime) {

		const state = this._interactiveTimeline.increment(deltaTime / PIXI.TARGET_FPMS);
		// Need to check for null we can't guarantee that the delta will not be out of range of the timeline.
		if (state.children.length > 0 && state.children[0].properties.frame != null) {
			const frame = state.children[0].properties.frame.split(",").map(value => parseInt(value));

			this._texture.frame = new PIXI.Rectangle(frame[0], frame[1], frame[2], frame[3]);
		}
		
		// console.log(deltaTime / 0.06);
	}
}