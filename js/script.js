window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return window.setTimeout(callback, 1000 / 60);
		};
})();

Array.prototype.indexOf = function(elem) {
	for (var i = 0; i < this.length; i++) {
		if(this[i] === elem) {
			return i;
		}
	}
	return -1;
};

Array.prototype.remove = function(elem) {
	var index = this.indexOf(elem);
	if(index > -1) {
		this.splice(index, 1);
	}
};

var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d");

CARD_WIDTH = 200;
CARD_HEIGHT = 200;

var cardElementArray = [];
var commonElementArray = [];

var CARD_VIEW_TOP = 50;
var CARD_INTERVAL = 50;

var FPS = 35;

var hit = document.getElementById("hit");
var stand = document.getElementById("stand");

var rabbit = new Sprite("rabbit", new ImagePainter("srcs/character/rabbit01.png"));
rabbit.width = 200;
rabbit.height = 200;
rabbit.top = 300;

var panda = new Sprite("panda", new ImagePainter("srcs/character/panda01.png"));
panda.width = 200;
panda.height = 200;
panda.top = 300;
panda.left = 600;

commonElementArray.push(rabbit);
commonElementArray.push(panda);

var mailBox = new MailBox();
var logic = new Logic({"mailBox" : mailBox});
logic.addHandler("toggleHit", function(args) {
	logic.send("youCardView_drawCard", {})
		 .send("dealearCardView_drawCard");

	youCardView.receive("youCardView_drawCard");
	dealerCardView.receive("dealearCardView_drawCard");
}).addHandler("toggleStand", function(args) {
	logic.send("youCardView_clear", {});
	youCardView.receive("youCardView_clear");
	logic.send("delearCardView_clear", {});
	dealerCardView.receive("delearCardView_clear");
})

var cardsImage = new Image();
cardsImage.src = "srcs/cards.png";

var dealerCardView = new View({"mailBox" : mailBox, "left" : 0, "top" : 0});
var youCardView = new View({"mailBox" : mailBox, "left" : 400, "top" : 0});


function drawOneCard(args) {

	var index = getRandom({"start" : 0, "end": 51});

	var _this = this._this

	var left = _this.left;
	var top = _this.top;
	var cardLeft = _this.cardLeft;
	var cardTop = _this.cardTop;

	var card02 = new Sprite('card02', new SpritePainter(cardsImage), [ new moveXDistance(100), new spriteIt(index) ]);
	card02.left = left + cardLeft;
	card02.top = top + cardTop;

	if(cardLeft > 300) {

		_this.cardLeft = _this.CARD_VIEW_LEFT;
		cardLeft = _this.cardLeft;
		_this.cardTop += 50;
		cardTop = _this.cardTop;
		card02.left = left + cardLeft;
		card02.top = top + cardTop;
	}

	card02.width = 100;
	card02.height = CARD_HEIGHT;
	card02.velocityX = 300;
	cardElementArray.push(card02);
	_this.cardLeft += CARD_INTERVAL;
}

youCardView.addHandler("drawCard", drawOneCard)
		   .addHandler("clear", function(args) {
				cardElementArray = [];
				var _this = this._this;
				_this.reset();
});

dealerCardView.addHandler("drawCard", drawOneCard)
		   	  .addHandler("clear", function(args) {
				cardElementArray = [];
				var _this = this._this;
				_this.reset();
});

hit.onclick = function () {

	logic.toggle("logic_toggleHit", {});
	
};

stand.onclick = function () {
	logic.toggle("logic_toggleStand", {});
};


var lastTime01 = 0
function animate(time) {

	// 控制在一定fps之内
	if(time - lastTime01 > (Math.round(1000 / FPS))) {

		console.log(Math.round(1000 / (time - lastTime01)) + "fps");

		context.clearRect(0, 0, canvas.width, canvas.height);

		for(var i = 0; i < cardElementArray.length; i++) {
			cardElementArray[i].update(context, time).paint(context);
		}

		for(var i = 0; i < commonElementArray.length; i++) {
			commonElementArray[i].update(context, time).paint(context);
		}

		lastTime01 = time;
	}
	
	requestAnimFrame(animate);
};

requestAnimFrame(animate);
