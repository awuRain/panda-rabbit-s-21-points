var run = {

 	INTERVAL : 1000,
	lastTime : 0,
	execute : function (sprite, context, now) {
		if ((now - this.lastTime) > this.INTERVAL) {
			sprite.painter.advance();
			this.lastTime = now;
		}
		
	}
};

var spriteIt = function (index) {

	this.execute = function (sprite, context, now) {
		sprite.painter.figure(index);
		detachBehavior(sprite, this);
	};
	return this;
};

var moveToLeft = {

	lastTime: 0,

	execute: function (sprite, context, time) {
		if(this.lastTime !== 0) {
			sprite.left -= sprite.velocityX * ((time - this.lastTime) / 1000);
			if(sprite.left < 0) {
				sprite.left = canvas.width;
			}
		}
		this.lastTime = time;
	}
};

// 删除当前动作 behaviors
function detachBehavior (sprite, behaviors) {
	sprite.behaviors.remove(behaviors);
}

// 随具体做水平移动
var moveXDistance = function(distance, arrow) {

	var leftDistance = distance;
	var lastTime = 0;
	var arrow = arrow || "left";

	this.execute = function (sprite, context, time) {

		if(lastTime !== 0) {
			
			sprite.velocityX = sprite.velocityX <= 0 ? 10 : leftDistance * 5;
			if(arrow === "left") {
				sprite.left -= sprite.velocityX * ((time - lastTime) / 1000);
			}
			else {
				sprite.left += sprite.velocityX * ((time - lastTime) / 1000);
			}
			leftDistance -= sprite.velocityX * ((time - lastTime) / 1000);
			
			if(sprite.left < 0) {
				sprite.left = canvas.width;
			}
		}

		lastTime = time;
		
		if(leftDistance < 5) {
			detachBehavior(sprite, this);
		}
	};

	return this;
};

// 随时间做水平移动
var moveXTime = function(duration, arrow) {

	var animationTimer = new AnimationTimer(duration);
	animationTimer.start();
	var lastTime  = 0;
	var arrow = arrow || "left";

	this.execute = function (sprite, context, time) {		

		if(animationTimer.isRunning()) {

			sprite.beforePaint = function (sprite, context) {

				context.save();
				context.rotate(20*Math.PI/180);
			};
			sprite.afterPaint = function (sprite, context) {
				context.restore();
			};

			if(lastTime !== 0) {
				sprite.velocityX = sprite.velocityX <= 0 ? 10 : sprite.velocityX - 10;
				if(arrow === "left") sprite.left -= sprite.velocityX * ((time - lastTime) / 1000);
				else 				 sprite.left += sprite.velocityX * ((time - lastTime) / 1000);
				
				if(sprite.left < 0) {
					sprite.left = canvas.width;
				}
			}
			lastTime = time;
		} if(animationTimer.isOver()) {
			animationTimer.stop();
			detachBehavior(sprite, this);
		}
	};
	return this;
};