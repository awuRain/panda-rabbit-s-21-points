function View (args) {

	this.handlers = {};

	// 设置该view部分的left, top, width, height值
	this.left = args.left || 0;
	this.top = args.top || 0;
	this.width = args.width || 200;
	this.height = args.height || 200;

	// 需要抽离
	this.CARD_VIEW_LEFT = 100;
	this.CARD_VIEW_TOP = 0;
	this.cardLeft = this.CARD_VIEW_LEFT;
	this.cardTop = this.CARD_VIEW_TOP;

	this.init = function (args) {

		this.setMailBox(args.mailBox);
		this.handlers["_this"] = this;	
	};

	this.init(args);

	return this;
};

View.prototype = new Module();

View.prototype.reset = function() {

	this.CARD_VIEW_LEFT = 100;
	this.CARD_VIEW_TOP = 0;
	this.cardLeft = this.CARD_VIEW_LEFT;
	this.cardTop = this.CARD_VIEW_TOP;
}
