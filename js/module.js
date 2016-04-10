var Module = function () {

	this.handlers = {};
}

Module.prototype = {

	on : function  (eventName, handler) {

		if (typeof this.handlers[eventName] == "undefined") {
			this.handlers[eventName] = [];
		}
		this.handlers[type].push(handler);
	},

	fire : function (eventName, args) {

		if (this.handlers[eventName] instanceof Array) {
			var handlers = this.handlers[type];
			for(var i = 0,length = handlers.length; i < length; i++) {
				handlers[i](args);
			}
		}
	},

	toggle : function (targets, eventName, args) {
		
	}
}