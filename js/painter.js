// 普通图片绘制器
var ImagePainter = function (image) {

	// 根据image的类型进行加载图片
	if(typeof image === "string") {
		this.image = new Image();
		this.image.src = image;
	} else {
		this.image = image;
	}
	
};

ImagePainter.prototype = {
	paint: function (sprite, context) {
		if(this.image.complete) {
			context.drawImage(this.image, sprite.left, sprite.top, sprite.width, sprite.height);
		}
	}
};


// 雪碧图绘制器
var SpritePainter = function (image) {
	this.image = image;
	this.IMAGE_WIDTH = 200;
	this.IMAGE_HEIGHT = 200;
}

SpritePainter.prototype = {

	figure: function (index) {

		// y位置索引 
		var y = this.IMAGE_HEIGHT * Math.floor(index/13);

		// x位置索引
		var x = this.IMAGE_WIDTH * (index%13);

		this.cell = {"x" : x, "y" : y, "w" : this.IMAGE_WIDTH, "h" : this.IMAGE_HEIGHT};
	},

	paint: function (sprite, context) {

		if(this.image.complete) {
			var image = this.image;
			var cell = this.cell;
			context.drawImage(image, cell.x, cell.y, cell.w, cell.h, sprite.left, sprite.top, cell.w, cell.h);
		}
	}
}


// 帧动画绘制器
var SpriteSheetPainter = function (spritesheet, cells) {

	this.cells = cells || [];
	this.cellIndex = 0;
	this.spritesheet = spritesheet;
};

SpriteSheetPainter.prototype = {
	advance: function () {

		if (this.cellIndex == this.cells.length-1) {
			this.cellIndex = 0;
		} else {
			this.cellIndex++;
		}
	},

	beforePaint : function (sprite, context) {
		
	},

	paint: function(sprite, context) {
		this.beforePaint(sprite, context);
		if(this.spritesheet.complete) {
			var cell = this.cells[this.cellIndex];
			var spritesheet = this.spritesheet;
			context.drawImage(spritesheet, cell.x, cell.y, cell.w, cell.h, sprite.left, sprite.top, cell.w, cell.h);
		}
		this.afterPaint(sprite, context);
	},

	afterPaint : function (sprite, context) {

	}
};