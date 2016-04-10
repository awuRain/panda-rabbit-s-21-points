StopWatch = function () {};

StopWatch.prototype = {
	startTime: 0,
	running: false,
	elapsed: undefined,

	start: function () {
		this.startTime = +new Date();
		this.elapsedTime = undefined;
		this.running = true;
	},

	stop: function () {
		this.elapsed = (+new Date()) - this.startTime;
		this.running = false;
	},

	getElapsedTime: function () {

		if (this.running) {
			return (+new Date()) - this.startTime;
		} else {
			return this.elapsed;
		}
	},

	isRunning: function() {
		return this.running;
	},

	reset: function() {
		this.elapsed = 0;
	}
}

AnimationTimer = function (duration) {
	this.duration = duration;
}

AnimationTimer.prototype = {
	duration: undefined,
	stopwatch: new StopWatch(),

	start: function () {
		this.stopwatch.start();
	},

	stop: function() {
		this.stopwatch.stop();
	},

	getElapsedTime: function () {
		var elapsedTime = this.stopwatch.getElapsedTime();

		if (!this.stopwatch.running) {
			return undefined;
		} else {
			return elapsedTime;
		}
	},

	isRunning: function () {
		return  this.stopwatch.isRunning();
	},

	isOver: function () {
		return this.stopwatch.getElapsedTime() > this.duration;
	}
};

// 获取范围内随机数
function getRandom(range) {
	var random = Math.random() * (range.end - range.start);
    var result = Math.round(random + range.start);
    result = Math.max(Math.min(result, range.end), range.start)
     
    return result;
}
