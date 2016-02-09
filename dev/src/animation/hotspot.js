import {InteractiveTimeline, Tween, MotionTween} from "timeline";

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
const ringTween = new Tween(ringKyframes, "ring", { loop: false, fillMode: Tween.FILL_MODE.FORWARD });


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

const rippleTween = new Tween(rippleKyframes, "ripple", { loop: false, fillMode: 0 });
const ripple2Tween = new Tween(rippleKyframes, "ripple2", { loop: false, fillMode: 0 });

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
const ripple3Tween = new Tween(ripple3Kyframes, "ripple3", { loop: false, fillMode: Tween.FILL_MODE.FORWARD });

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
const ripple4Tween = new Tween(ripple4Kyframes, "ripple4", { loop: false, fillMode: Tween.FILL_MODE.FORWARD });

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
const plusTween = new Tween(plusKyframes, "plus", { loop: false, fillMode: Tween.FILL_MODE.FORWARD });

const sequences = [
	{
		time: 0,
		duration: 830,
		label: "intro",
		// next: "intro"
	}
];


const it = new InteractiveTimeline();

it.addTween(ringTween, 0);
it.addTween(rippleTween, 130);
it.addTween(ripple2Tween, 260);
it.addTween(ripple3Tween, 390);
it.addTween(ripple4Tween, 520);
it.addTween(plusTween, 0);
it.setSequences(sequences);

export const timeline = it;