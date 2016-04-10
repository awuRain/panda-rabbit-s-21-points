// 模型构造函数
function Module () {

	
}

// 设置mailbox
Module.prototype.setMailBox = function (mailBox) {

	this.mailBox = mailBox;
}

// 发送消息
Module.prototype.send = function (mailHead, args) {

	this.mailBox.push(mailHead, args);
	return this;
};

// 接受消息
Module.prototype.receive = function (mailHead) {

	var callbackName = mailHead.split("_")[1];

	var mails = this.mailBox.pop(mailHead);

	for (var i = 0, length = mails.length; i < length; i++) {

		this.handlers[callbackName](mails[i]);
	}
};

Module.prototype.toggle = function (mailHead) {
	this.send(mailHead, {});
	this.receive(mailHead);
}

Module.prototype.addHandler = function (handlerName, handler) {
	this.handlers[handlerName] = handler;
	return this;
}
