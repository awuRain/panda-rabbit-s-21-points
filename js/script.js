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

var CARD_WIDTH = 200;
var CARD_HEIGHT = 200;
var CHARACTER_WIDTH = 156;
var CHARACTER_HEIGHT = 156;


var cardElementArray = [];
var commonElementArray = {};

var CARD_INTERVAL = 50;

var FPS = 35;

var hit = document.getElementById("hit");
var stand = document.getElementById("stand");

var rabbit = new Sprite("rabbit", new ImagePainter("srcs/character/rabbit01.png"));
rabbit.width = 156;
rabbit.height = 156;
rabbit.top = 300;

var panda = new Sprite("panda", new ImagePainter("srcs/character/panda01.png"));
panda.width = 200;
panda.height = 200;
panda.top = 300;
panda.left = 600;

var blackJackImgae = new Image();
blackJackImgae.src = "srcs/pushLeft.png";
var blackJack = new Sprite("blackJack", new ImagePainter(blackJackImgae));
blackJack.width = 300;
blackJack.height = 200;
blackJack.top = 300;
blackJack.left = 150;

// commonElementArray.push(rabbit);
// commonElementArray.push(panda);
// commonElementArray.push(blackJack);

var mailBox = new MailBox();

var logic = new Logic({"mailBox" : mailBox});

// 需要聚合
var dealerCardViewLock = false;

var youCardValueSum = 0

var cardVlueMap = {
	1 : 1,
	2 : 2,
	3 : 3,
	4 : 4,
	5 : 5,
	6 : 6,
	7 : 7,
	8 : 8,
	9 : 9,
	10 : 10,
	11 : 10,
	12 : 10,
	13 : 10 
};

var cardsArray = new Array(52);
for(var i = 0, length = cardsArray.length; i < length; i++) {
	cardsArray[i] = 1;
}

logic.addHandler("toggleHit", function(args) {

	// console.log("卡的实际值 : " + cardvalue);
	// console.log("卡的数组索引 : " + youCardIndex);
	// console.log("卡的纵向索引 : " + Math.floor(youCardIndex/13));
	// console.log("卡的横向索引 : " + youCardIndex%13);

	var youCardIndex = getRandom({"start" : 0, "end": 51});
	while (cardsArray[youCardIndex] === 0) {
		youCardIndex = getRandom({"start" : 0, "end": 51});
	}
	var cardvalue = cardVlueMap[youCardIndex%13+1];

	cardsArray[youCardIndex] = 0;


	if(cardvalue === 1) {
		if((youCardValueSum + 10) <= 21) {
			cardvalue = 10;
		} else {
			cardvalue = 1;
		}
	};

	youCardValueSum += cardvalue;

	if(youCardValueSum > 21) {


	} else if (youCardValueSum === 21) {

	}

	logic.send("youCardView_drawCard", {"index" : youCardIndex});

	if (!dealerCardViewLock) {
		var dealerCardIndex = getRandom({"start" : 0, "end": 51});
		logic.send("dealearCardView_drawBlindCard");
		dealerCardViewLock = true;
	}
	

	var youIndex = getRandom({"start" : 0, "end": 4});
	var dealerIndex = getRandom({"start" : 0, "end": 4});

	logic.send("youView_drawCharacter", {"index" : youIndex});
	youView.receive("youView_drawCharacter");
	logic.send("dealerView_drawCharacter", {"index" : dealerIndex});
	dealerView.receive("dealerView_drawCharacter")


	youCardView.receive("youCardView_drawCard");
	// dealerCardView.receive("dealearCardView_drawCard");
	dealerCardView.receive("dealearCardView_drawBlindCard");
}).addHandler("toggleStand", function(args) {
	logic.send("youCardView_clear", {});
	youCardView.receive("youCardView_clear");
	logic.send("delearCardView_clear", {});
	dealerCardView.receive("delearCardView_clear");
	dealerCardViewLock = false;

	youCardValueSum = 0;
})

var cardsImage = new Image();
cardsImage.src = "srcs/cards.png";
var blindCardImage = new Image();
blindCardImage.src = "srcs/back.png";

var pandaImage = new Image();
pandaImage.src = "srcs/character/panda.png";
var rabbitImage = new Image();
rabbitImage.src = "srcs/character/rabbit.png";



var dealerCardView = new View({"mailBox" : mailBox, "left" : 0, "top" : 0});
var youCardView = new View({"mailBox" : mailBox, "left" : 400, "top" : 0});


var dealerView = new View({"mailBox" : mailBox, "left" : 0, "top" : 0});
var youView = new View({"mailBox" : mailBox, "left" : 0, "top" : 0});


function drawOneCard(args) {

	var index = args["index"];

	// 指向模块module
	var _this = this._this

	var left = _this.left;
	var top = _this.top;
	var cardLeft = _this.cardLeft;
	var cardTop = _this.cardTop;

	var card02 = new Sprite('card02', new SpritePainter({"type" : "card", "image" : cardsImage, "width" : CARD_WIDTH, "height" : CARD_HEIGHT}), [ new moveXDistance(100), new spriteIt(index) ]);
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

	card02.width = 200;
	card02.height = 200;

	card02.velocityX = 300;
	cardElementArray.push(card02);
	_this.cardLeft += CARD_INTERVAL;
}

function drawBlindTwoCard () {

	var index = getRandom({"start" : 0, "end": 51});

	// 指向模块module
	var _this = this._this

	var left = _this.left;
	var top = _this.top;
	var cardLeft = _this.cardLeft;
	var cardTop = _this.cardTop;

	var blindCard = new Sprite('blindCard', new ImagePainter(blindCardImage), [ new moveXDistance(100) ]);
	blindCard.left = left + cardLeft;
	blindCard.top = top + cardTop;

	if(cardLeft > 300) {

		_this.cardLeft = _this.CARD_VIEW_LEFT;
		cardLeft = _this.cardLeft;
		_this.cardTop += 50;
		cardTop = _this.cardTop;
		blindCard.left = left + cardLeft;
		blindCard.top = top + cardTop;
	}

	blindCard.width = 200;
	blindCard.height = 200;

	blindCard.velocityX = 300;
	cardElementArray.push(blindCard);
	_this.cardLeft += CARD_INTERVAL;


	left = _this.left;
	top = _this.top;
	cardLeft = _this.cardLeft;
	cardTop = _this.cardTop;

	var seenCard = new Sprite('seenCard', new SpritePainter({"type" : "card", "image" : cardsImage, "width" : CARD_WIDTH, "height" : CARD_HEIGHT}), [ new moveXDistance(100), new spriteIt(index) ]);
	seenCard.left = left + cardLeft;
	seenCard.top = top + cardTop;

	if(cardLeft > 300) {

		_this.cardLeft = _this.CARD_VIEW_LEFT;
		cardLeft = _this.cardLeft;
		_this.cardTop += 50;
		cardTop = _this.cardTop;
		seenCard.left = left + cardLeft;
		seenCard.top = top + cardTop;
	}

	seenCard.width = 200;
	seenCard.height = 200;

	seenCard.velocityX = 300;
	cardElementArray.push(seenCard);
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
		   })
		   	  .addHandler("drawBlindCard", drawBlindTwoCard);

youView.addHandler("drawCharacter", function(args) {

				var index = args.index || 0;
				var character = new Sprite('character', new SpritePainter({"image" : pandaImage, "width" : CHARACTER_WIDTH, "height" : CHARACTER_HEIGHT}), [ new spriteIt(index) ]);
				character.top = 320;
				character.left = 640;
				commonElementArray.you = character;
		   });

dealerView.addHandler("drawCharacter", function(args) {

				var index = args.index || 0;
				var character = new Sprite('character', new SpritePainter({"image" : rabbitImage, "width" : CHARACTER_WIDTH, "height" : CHARACTER_HEIGHT}), [ new spriteIt(index) ]);
				character.top = 320;
				character.left = 0;
				commonElementArray.dealer = character;
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

		// console.log(Math.round(1000 / (time - lastTime01)) + "fps");

		context.clearRect(0, 0, canvas.width, canvas.height);

		for(var i = 0; i < cardElementArray.length; i++) {
			cardElementArray[i].update(context, time).paint(context);
		}

		for(var i in commonElementArray) {
			commonElementArray[i].update(context, time).paint(context);
		}

		lastTime01 = time;
	}
	
	requestAnimFrame(animate);
};

requestAnimFrame(animate);
