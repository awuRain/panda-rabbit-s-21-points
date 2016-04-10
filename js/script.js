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

CARD_WIDTH = 170;
CARD_HEIGHT = 170;

var cardElementArray = [];
var commonElementArray = [];

var CARD_VIEW_LEFT = 200;
var CARD_VIEW_TOP = 50;
var cardLeft = CARD_VIEW_LEFT; 
var CARD_INTERVAL = 50;

var FPS = 35;

var hit = document.getElementById("hit");
var stand = document.getElementById("stand");

var rabbit = new Sprite("rabbit", new ImagePainter("srcs/character/rabbit01.png"));
rabbit.width = 200;
rabbit.height = 200;
rabbit.top = 200;

var panda = new Sprite("panda", new ImagePainter("srcs/character/panda01.png"));
panda.width = 200;
panda.height = 200;
panda.top = 200;
panda.left = 600;

commonElementArray.push(rabbit);
commonElementArray.push(panda);

hit.onclick = function () {

	var index = getRandom({"start" : 0, "end": 51});

	var card02 = new Sprite('card01', new SpritePainter("srcs/cards.png"), [ new moveXDistance(100), new spriteIt(index) ]);
	card02.left = cardLeft;
	card02.top = CARD_VIEW_TOP;
	card02.width = CARD_WIDTH;
	card02.height = CARD_HEIGHT;
	card02.velocityX = 300;
	cardElementArray.push(card02);
	cardLeft += CARD_INTERVAL;
};

stand.onclick = function () {
	cardElementArray = [];
	cardLeft = CARD_VIEW_LEFT;
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
}

requestAnimFrame(animate);
