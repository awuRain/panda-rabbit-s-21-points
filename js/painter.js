var TextPainter = function (texts) {

	this.texts = texts;
};

TextPainter.prototype = {
	paint: function (graph, context) {
		var texts = this.texts;
		for(var i = 0, length = texts.length; i < length; i++) {
			var text = texts[i].baseText + texts[i].text;
			context.save();
			context.fillStyle ="#666";
			context.textBaseline="top";
			context.font = "14px Arial";

			var textWidth = context.measureText(text).width;
			var left = graph.left + 100 - textWidth;
			var top = graph.top + i * 20;

			context.fillText(text, left, top);
			context.restore();
		}
	}
};

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
	paint: function (graph, context) {
		if(this.image.complete) {
			context.drawImage(this.image, graph.left, graph.top, graph.width, graph.height);
		}
	}
};


// 雪碧图绘制器
var SpritePainter = function (args) {
	this.image = args.image;
	this.IMAGE_HEIGHT = args.height;
	this.IMAGE_WIDTH = args.width;
	this.type = args.type || "normal";
};

SpritePainter.prototype = {

	figure: function (index) {

		if (this.type === "card") {
			// y位置索引 
			var y = this.IMAGE_HEIGHT * Math.floor(index/13);

			// x位置索引
			var x = this.IMAGE_WIDTH * (index%13);

			this.cell = {"x" : x, "y" : y, "w" : this.IMAGE_WIDTH, "h" : this.IMAGE_HEIGHT};
		} else if (this.type === "normal") {

			var x = this.IMAGE_WIDTH * index;
			var y = 0;
			this.cell = {"x" : x, "y" : y, "w" : this.IMAGE_WIDTH, "h" : this.IMAGE_HEIGHT};
		}
	},

	paint: function (graph, context) {

		if(this.image.complete) {
			var image = this.image;
			var cell = this.cell;
			context.drawImage(image, cell.x, cell.y, cell.w, cell.h, graph.left, graph.top, cell.w, cell.h);
		}
	}
};

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

	beforePaint : function (graph, context) {
		
	},

	paint: function(graph, context) {
		this.beforePaint(graph, context);
		if(this.spritesheet.complete) {
			var cell = this.cells[this.cellIndex];
			var spritesheet = this.spritesheet;
			context.drawImage(spritesheet, cell.x, cell.y, cell.w, cell.h, graph.left, graph.top, cell.w, cell.h);
		}
		this.afterPaint(graph, context);
	},

	afterPaint : function (graph, context) {

	}
};