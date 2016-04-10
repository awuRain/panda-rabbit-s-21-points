function View (args) {

	this.init = function (args) {

		this.callbackMap = {
			"doThing" : "doThing"
		};

		this.setMailBox(args.mailBox);
	};

	this.init(args);

	return this;
};

View.prototype = new Module();

View.prototype.doThing = function(args) {

	console.log("View success : ");
	console.log(args);
}