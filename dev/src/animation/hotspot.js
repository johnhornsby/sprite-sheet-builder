import {InteractiveTimeline, Timeline, Tween, MotionTween} from "timeline";


const ringTween = new Tween("ring", {
	radius: [
		{
			time: 0, value: 70
		},
		{
			time: 200, value: 19
		}
	],
	alpha: [
		{
			time: 0, value: 0
		},
		{
			time: 30, value: 0 
		},
		{
			time: 100, value: 1
		}
	],
	width: [
		{
			time: 0, value: 6
		},
		{
			time: 200, value: 2 
		}
	]
});


const rippleTween = new Tween("ripple", {
	radius: [
		{
			time: 0, value: 19
		},
		{
			time: 300, value: 50
		}
	],
	alpha: [
		{
			time: 0, value: 1
		},
		{
			time: 300, value: 0
		}
	]
});


const plusTween = new Tween("plus", {
	width: [
		{
			time: 0, value: 0, 
		},
		{
			time: 300, value: 20, 
		}
	]
});



const rippleTimeline = new InteractiveTimeline("ripples");

rippleTimeline.addChild(rippleTween, {fillMode: Timeline.FILL_MODE.FORWARD, loop: true });
rippleTimeline.addChild(rippleTween, {fillMode: Timeline.FILL_MODE.FORWARD, loop: true, time: 100 });
rippleTimeline.addChild(rippleTween, {fillMode: Timeline.FILL_MODE.FORWARD, loop: true, time: 200 });

const ripplesTimeline = new InteractiveTimeline("ripples");
ripplesTimeline.addChild(rippleTimeline, {fillMode: Timeline.FILL_MODE.FORWARD, out: 800 });
ripplesTimeline.addKeyframes({
	timeRemap: [
		{
			time: 0, value: 0
		},
		{
			time: 375, value: 375
		},
		{
			time: 800,
			value: 410,
		 	animatorType: MotionTween.animatorType.ease,
		 	animatorOptions: {
		 		easingFunction: MotionTween.easingFunction.easeOutExpo
		 	}
		}
	]
});

const hotspotTimeline = new InteractiveTimeline("hotspot");

hotspotTimeline.addChild(ringTween, { time: 0, fillMode: Timeline.FILL_MODE.FORWARD });
hotspotTimeline.addChild(ripplesTimeline, {time: 200, fillMode: Timeline.FILL_MODE.FORWARD});
hotspotTimeline.addChild(plusTween, { time: 500, fillMode: Timeline.FILL_MODE.FORWARD });

hotspotTimeline.setSequences([
	{
		time: 0, duration: 1000, label: "intro", next: null
	}
]);


export const timeline = hotspotTimeline;