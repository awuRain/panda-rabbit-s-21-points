function Logic (args) {

	this.handlers = {};
	
	this.init = function (args) {

		this.setMailBox(args.mailBox);
		this.handlers["_this"] = this;
	};

	this.init(args);

	return this;
};

// 指向的是不一样的对象！！！
Logic.prototype = new Module();