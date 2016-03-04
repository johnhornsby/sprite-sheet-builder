import {InteractiveTimeline, Timeline, Tween, MotionTween} from "timeline";

const ringKyframes = {
	radius: [
		{
			value: 70,
		 	time: 0
		},
		{
			value: 19,
			time: 200
		}
	],
	alpha: [
		{
			value: 0,
		 	time: 30
		},
		{
			value: 1,
			time: 100
		}
	],
	width: [
		{
			value: 6,
		 	time: 0
		},
		{
			value: 2,
			time: 200
		}
	]
}
const ringTween = new Tween("ring");
ringTween.addKeyframes(ringKyframes);


const rippleKyframes = {
	radius: [
		{
			value: 19,
		 	time: 0
		},
		{
			value: 50,
			time: 300
		}
	],
	alpha: [
		{
			value: 1,
		 	time: 0
		},
		{
			value: 0,
			time: 300
		}
	]
}

const rippleTween = new Tween("ripple");
rippleTween.addKeyframes(rippleKyframes);

const ripple3Kyframes = {
	radius: [
		{
			value: 19,
		 	time: 0,
		 	animatorType: MotionTween.animatorType.ease,
		 	animatorOptions: {
		 		easingFunction: MotionTween.easingFunction.easeOutExpo
		 	}
		},
		{
			value: 42,
			time: 400
		}
	],
	alpha: [
		{
			value: 1,
		 	time: 0,
		 	animatorType: MotionTween.animatorType.ease,
		 	animatorOptions: {
		 		easingFunction: MotionTween.easingFunction.easeOutExpo
		 	}
		},
		{
			value: 0.2,
			time: 400
		}
	]
}
const ripple3Tween = new Tween("ripple3");
ripple3Tween.addKeyframes(ripple3Kyframes);

const ripple4Kyframes = {
	radius: [
		{
			value: 19,
		 	time: 0,
		 	animatorType: MotionTween.animatorType.ease,
		 	animatorOptions: {
		 		easingFunction: MotionTween.easingFunction.easeOutExpo
		 	}
		},
		{
			value: 28,
			time: 288
		}
	],
	alpha: [
		{
			value: 1,
		 	time: 0,
		 	animatorType: MotionTween.animatorType.ease,
		 	animatorOptions: {
		 		easingFunction: MotionTween.easingFunction.easeOutExpo
		 	}
		},
		{
			value: 0.4,
			time: 288
		}
	]
}
const ripple4Tween = new Tween("ripple4");
ripple4Tween.addKeyframes(ripple4Kyframes);

const plusKyframes = {
	width: [
		{
			value: 0,
		 	time: 510
		},
		{
			value: 20,
			time: 830
		}
	]
}
const plusTween = new Tween("plus");
plusTween.addKeyframes(plusKyframes);



const it = new InteractiveTimeline("hotspot");

it.addChild(ringTween, { loop: false, fillMode: Timeline.FILL_MODE.FORWARD });
it.addChild(rippleTween, {time: 130, loop: false, fillMode: Timeline.FILL_MODE.NONE });
it.addChild(rippleTween, {time: 260, loop: false, fillMode: Timeline.FILL_MODE.NONE });
it.addChild(ripple3Tween, { time: 390, loop: false, fillMode: Timeline.FILL_MODE.FORWARD });
it.addChild(ripple4Tween, { time: 520, loop: false, fillMode: Timeline.FILL_MODE.FORWARD });
it.addChild(plusTween, { loop: false, fillMode: Timeline.FILL_MODE.FORWARD });
it.setSequences([
	{
		time: 0,
		duration: 830,
		label: "intro",
		next: "intro"
	}
]);

export const timeline = it;