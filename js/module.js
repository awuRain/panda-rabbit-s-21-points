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
};

// 接受消息
Module.prototype.receive = function (mailHead) {

	var callbackName = mailHead.split("_")[1];

	var callbackMap = this.callbackMap;

	var mails = this.mailBox.pop(mailHead);
	for (var i in mails) {

		console.log(callbackName);
		console.log(this.callbackMap)
		console.log(callbackMap[callbackName]);
		console.log(this);

		this[callbackMap[callbackName]](mails[i]);
	}
};