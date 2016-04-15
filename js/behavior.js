// 帧动画播放动作
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

// 根据index切割出相应的雪碧图
var spriteIt = function (index) {

	this.execute = function (sprite, context, now) {
		sprite.painter.figure(index);
		detachBehavior(sprite, this);
	};
	return this;
};

// 从右向左的动作
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
// 可以让动作结束之后自己将自己析构
function detachBehavior (sprite, behaviors) {
	sprite.behaviors.remove(behaviors);
}

// 随具体做水平移动
// distance控制平移距离，arrow控制平移方向 
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
// duration控制平移持续时间，arrow控制平移方向
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