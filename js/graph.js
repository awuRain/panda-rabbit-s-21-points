// 图形类Graph，可以利用它创造独立渲染和接受数据的一块图形
var Graph = function (name, painter, behaviors) {

	if(name !== undefined) {
		this.name = name;
	}
	if(painter !== undefined) {
		this.painter = painter;
	}

	this.top = 0;
	this.left = 0;
	this.width = 0;
	this.height = 0;
	this.velocityX = 0;
	this.velocityY = 0;

	this.visible = true;
	this.animating  = false;
	this.behaviors = behaviors || [];

	return this;
};

Graph.prototype = {

	// 绘制方法，将会调用通过动态传入的painter的相关方法
	paint: function (context) {
		if (this.painter !== undefined && this.visible) {
			this.painter.paint(this, context);
		} 
		return this;
	},

	// 动作方法，将会在每次循环下执行动作数组中的相关动作方法
	update: function (context, time) {
		for(var i = 0; i < this.behaviors.length; ++i) {
			this.behaviors[i].execute(this, context, time);
		}
		return this;
	}
};
