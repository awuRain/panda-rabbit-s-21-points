var MailBox = function () {

	this.mailBox = {};
	return this;
}; 

MailBox.prototype.push = function (mailHead, args) {

	var mailBox = this.mailBox;
	if(!mailBox[mailHead]) {

		mailBox[mailHead] = [];
	}
	mailBox[mailHead].push(args);
};

MailBox.prototype.pop = function (mailHead) {

	var mailBox = this.mailBox;
	if(mailBox[mailHead].length === 0) {
		return {};
	} else {
		var mails = mailBox[mailHead];
		mailBox[mailHead] = [];
		return mails;
	}
};
