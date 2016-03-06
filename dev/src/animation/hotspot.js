import {InteractiveTimeline, Timeline, Tween, MotionTween} from "timeline";


const ringTween = new Tween("ring", {
	radius: [
		{
			value: 70, time: 0
		},
		{
			value: 19, time: 200
		}
	],
	alpha: [
		{
			value: 0, time: 0
		},
		{
			value: 0, time: 30
		},
		{
			value: 1, time: 100
		}
	],
	width: [
		{
			value: 6, time: 0
		},
		{
			value: 2, time: 200
		}
	]
});


const rippleTween = new Tween("ripple", {
	radius: [
		{
			value: 19, time: 0
		},
		{
			value: 50, time: 300
		}
	],
	alpha: [
		{
			value: 1, time: 0
		},
		{
			value: 0, time: 300
		}
	]
});


const ripple3Tween = new Tween("ripple3", {
	radius: [
		{
			value: 19, time: 0,
		 	animatorType: MotionTween.animatorType.ease,
		 	animatorOptions: {
		 		easingFunction: MotionTween.easingFunction.easeOutExpo
		 	}
		},
		{
			value: 42, time: 400
		}
	],
	alpha: [
		{
			value: 1, time: 0,
		 	animatorType: MotionTween.animatorType.ease,
		 	animatorOptions: {
		 		easingFunction: MotionTween.easingFunction.easeOutExpo
		 	}
		},
		{
			value: 0.2, time: 400
		}
	]
});


const ripple4Tween = new Tween("ripple4", {
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
			value: 28, time: 288
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
			value: 0.4, time: 288
		}
	]
});


const plusTween = new Tween("plus", {
	width: [
		{
			value: 0, time: 510
		},
		{
			value: 20, time: 830
		}
	]
});


const hotspotTimeline = new InteractiveTimeline("hotspot");

hotspotTimeline.addChild(ringTween, { fillMode: Timeline.FILL_MODE.FORWARD });
hotspotTimeline.addChild(rippleTween, { time: 130, fillMode: Timeline.FILL_MODE.NONE });
hotspotTimeline.addChild(rippleTween, { time: 260, fillMode: Timeline.FILL_MODE.FORWARD });
hotspotTimeline.addChild(ripple3Tween, { time: 390, fillMode: Timeline.FILL_MODE.FORWARD });
hotspotTimeline.addChild(ripple4Tween, { time: 520, fillMode: Timeline.FILL_MODE.FORWARD });
hotspotTimeline.addChild(plusTween, { fillMode: Timeline.FILL_MODE.FORWARD });

hotspotTimeline.setSequences([
	{
		time: 0, duration: 830, label: "intro", next: "intro"
	}
]);


export const timeline = hotspotTimeline;