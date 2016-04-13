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
var CHARACTER_WIDTH = 312;
var CHARACTER_HEIGHT = 156;
var CARD_INTERVAL = 50;
var DANGER_POINT = 17;

// 需要聚合
var dealerCardViewLock = false;

//
// 全局变量 start
// 

// 游戏中步骤
// 0 为进行中,1 为结算中
var step = 0;
var standButtonLock = true;
var hitButtonLock = true;

function doSettle () {
	step = 1;
	standButtonLock = true;
}

var yourPoint = 0;
var yourChip = 100;
var dealerPoint = 0;
var dealerChip = 200;
var chipValue = 10;


var cardValueMap = {
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
// 重置卡组
cardsArray.reset = function () {
	
	for(var i = 0, length = this.length; i < length; i++) {
		this[i] = 1;
	}
};

cardsArray.getCard = function () {

	var index = getRandom({"start" : 0, "end": 51});
	while (this[index] === 0) {
		index = getRandom({"start" : 0, "end": 51});
	}
	this[index] = 0;
	return {"index" : index, "value" : cardValueMap[index % 13 + 1]};
};

cardsArray.reset();

//
// 全局变量 end
//

var cardGraphArray = {"you" : [], "dealer" : {"seenCard" : [], "blindCard" : []}};
var yourCardArray = cardGraphArray.you;
var seenCardArray = cardGraphArray.dealer.seenCard;
var blindCardArray = cardGraphArray.dealer.blindCard;
var commonGraphArray = {};


var FPS = 35;

var hitButton = document.getElementById("hit");
var standButton = document.getElementById("stand");
var playButton = document.getElementById("play");

//
// 图片资源加载
//
 
var blackJackImgae = loadImage("srcs/pushLeft.png");
var cardsImage = loadImage("srcs/cards.png");
var blindCardImage = loadImage("srcs/back.png");
var pandaImage = loadImage("srcs/character/panda.png");
var rabbitImage = loadImage("srcs/character/rabbit.png");
var slashImage = loadImage("srcs/slash.png");


//
//  图片资源加载
//  

// 中心信箱
var mailBox = new MailBox();

// 各个视图层定义
var dealerCardView = new View({"mailBox" : mailBox, "left" : 0, "top" : 0});
var yourCardView = new View({"mailBox" : mailBox, "left" : 400, "top" : 0});
var dealerView = new View({"mailBox" : mailBox, "left" : 0, "top" : 320});
var youView = new View({"mailBox" : mailBox, "left" : 490, "top" : 320});
var youInformationView = new View({"mailBox" : mailBox, "left" : 520, "top" : 440});
var dealerInfromationView = new View({"mailBox" : mailBox, "left" : 200, "top" : 440});

//
// 
// 向每个视图层添加事件句柄 begin
// 
// 

function drawText(graphName, texts, args, _this) {

	commonGraphArray[graphName] = null;
	var texts = texts;

	var graph = new Graph("information", new TextPainter(texts));
	graph.left = _this.left;
	graph.top = _this.top;

	commonGraphArray[graphName] = graph;
};

dealerInfromationView.addHandler("draw", function (args) {

	var _this = this._this;
	drawText("dealerInformation", [
		{"baseText" : "兔老板当前的点数 : ", "text" : args.point},
		{"baseText" : "你的筹码 : ", "text" : args.chip}
	], args, _this);

}).addHandler("reset", function (args) {

	var _this = this._this;
	drawText("dealerInformation", [
		{"baseText" : "兔老板当前的点数 : ", "text" : 0},
		{"baseText" : "你的筹码 : ", "text" : args.chip}
	], args, _this);
})

youInformationView.addHandler("draw", function (args) {
	var _this = this._this;

	drawText("yourInformation", [
		{"baseText" : "你当前的点数 : ", "text" : args.point},
		{"baseText" : "你的筹码 : ", "text" : args.chip}
	], args, _this);

}).addHandler("reset", function (args) {

	var _this = this._this;

	drawText("yourInformation", [
		{"baseText" : "你当前的点数 : ", "text" : 0},
		{"baseText" : "你的筹码 : ", "text" : args.chip}
	], args, _this);
});

yourCardView.addHandler("drawCard", drawOneCard)
		   .addHandler("clear", function(args) {
		   		yourCardArray = [];
				var _this = this._this;
				_this.reset();
		   });
		   
		
dealerCardView.addHandler("drawCard", drawOneCard)
		   	  .addHandler("clear", function(args) {

		   	  	var _this = this._this;
		   	  	if (step === 1) {
		   	  		seenCardArray = [];
		   	  		blindCardArray = [];
		   	  		_this.reset();
		   	  	} else if (step === 0) {
		   	  		blindCardArray = [];
		   	  		_this.reset();
		   	  		_this.cardLeft += CARD_INTERVAL;
		   	  	}
		   })
		   	  .addHandler("drawBlindCard", drawBlindTwoCard)
		   	  .addHandler("drawSeenCard", drawSeenCard);

youView.addHandler("drawCharacter", function(args) {

				commonGraphArray.you = null;
				var _this = this._this;
				var index = args.index || 0;

				// 抽离
				var character = new Graph('character', new SpritePainter({"image" : pandaImage, "width" : CHARACTER_WIDTH, "height" : CHARACTER_HEIGHT}), [ new spriteIt(index) ]);
				character.top = _this.top + 0;
				character.left = _this.left + 0;
				commonGraphArray.you = character;
		   });

dealerView.addHandler("drawCharacter", function(args) {

				commonGraphArray.dealer = null;
				var _this = this._this;
				var index = args.index || 0;

				// 抽离
				var character = new Graph('character', new SpritePainter({"image" : rabbitImage, "width" : CHARACTER_WIDTH, "height" : CHARACTER_HEIGHT}), [ new spriteIt(index) ]);
				character.top = _this.top + 0;
				character.left = _this.left + 0;
				commonGraphArray.dealer = character;
		   });

//
// 
// 向每个视图层添加事件句柄 end
// 
// 

// 中心逻辑层
var logic = new Logic({"mailBox" : mailBox});

//
// 
// 向逻辑层添加事件句柄 begin
// 
// 

function drawCharacter(args) {

	youView.toggle("drawCharacter", {"index" : args.panda});
	dealerView.toggle("drawCharacter", {"index" : args.rabbit});
}


logic.addHandler("toggleHit", function(args) {

	// console.log("卡的实际值 : " + cardvalue);
	// console.log("卡的数组索引 : " + youCardIndex);
	// console.log("卡的纵向索引 : " + Math.floor(youCardIndex/13));
	// console.log("卡的横向索引 : " + youCardIndex%13);

	// 处于游戏进行中
	
	if (step === 1) {

		yourCardView.toggle("clear");
		dealerCardView.toggle("clear");
		dealerCardViewLock = false;

		//需要封装
		youView.toggle("drawCharacter", {"index" : 0});
		dealerView.toggle("drawCharacter", {"index" : 0});

		yourPoint = 0;
		dealerPoint = 0;

		cardsArray.reset();

		youInformationView.toggle("reset", {"chip" : yourChip});
		dealerInfromationView.toggle("reset", {"chip" : dealerChip});

		standButtonLock = false;

		step = 0;
	};

	if (step === 0) { 

		function dealOneCard() {

			var card = cardsArray.getCard();
			var youCardIndex = card.index;
			var cardvalue = card.value;

			if(cardvalue === 1) {
				if((yourPoint + 10) <= 21) {
					cardvalue = 10;
				} else {
					cardvalue = 1;
				}
			};

			yourPoint += cardvalue;
			yourCardView.toggle("drawCard", {"index" : youCardIndex});
		};

		dealOneCard();
		if(yourCardArray.length < 2) {
			dealOneCard();
		}

		if(yourPoint > 21) {

			drawCharacter({"panda" : 3, "rabbit" : 5});

			yourChip -= chipValue;
			dealerChip += chipValue;

			doSettle();

		} else if (yourPoint === 21) {
			
			drawCharacter({"panda" : 6, "rabbit" : 4});

			// function 的撒的撒

			yourChip += chipValue * 2;
			dealerChip -= chipValue * 2;

			doSettle();
		};


		if (!dealerCardViewLock) {

			var card = cardsArray.getCard();
			var index = card.index;
			var value = card.value;

			console.log("initValue : " + value);

			dealerPoint += value;
			dealerCardView.toggle("drawBlindCard", {"index" : index});

			dealerCardViewLock = true;
		}
		

		youInformationView.toggle("draw", {"point" : yourPoint, "chip" : yourChip});
	}

	

}).addHandler("toggleStand", function(args) {
	
	if (!standButtonLock) {

		var indexs = [];
		while((dealerPoint < yourPoint) || (dealerPoint === yourPoint && dealerPoint < DANGER_POINT) ) {

			var card = cardsArray.getCard();
			var index = card.index;
			dealerPoint += card.value;
			console.log(card.value);
			indexs.push(index);
		};

		dealerCardView.toggle("clear");
		dealerCardView.toggle("drawSeenCard", {"indexs" : indexs});

		dealerInfromationView.toggle("draw", {"point" : dealerPoint, "chip" : dealerChip});
		if (dealerPoint === yourPoint) {

			drawCharacter({"panda" : 1, "rabbit" : 1});
			console.log("push");
		} else if (dealerPoint > 21) {
			console.log("you win");
			drawCharacter({"panda" : 5, "rabbit" : 3});
			yourChip += chipValue;
			dealerChip -= chipValue;
		} else if (dealerPoint == 21) {
			console.log("you big lose");
			drawCharacter({"panda" : 4, "rabbit" : 6});
			yourChip -= chipValue * 2;
			dealerChip += chipValue * 2;
		} else {
			console.log("you lose");
			drawCharacter({"panda" : 2, "rabbit" : 5});
			yourChip -= chipValue;
			dealerChip += chipValue;
		}

		doSettle();
	}
});

//
// 
// 向逻辑层添加事件句柄 end
// 
// 

function drawOneCard(args) {

	var index = args["index"];

	// 指向模块module
	var _this = this._this

	drawcard(_this, index, yourCardArray);
}

function drawBlindTwoCard (args) {

	// 指向模块module
	var _this = this._this
	var index = args.index;

	drawcard(_this, index, seenCardArray);
	drawcard(_this, "blind", blindCardArray);	
}

function drawSeenCard(args) {

	var _this = this._this;
	var indexs = args.indexs;

	blindCardArray = [];

	for(var i = 0, length = indexs.length; i < length; i++) {
		drawcard(_this, indexs[i], seenCardArray); 
		
	}
}

// 绘制单个扑克牌
// 描述精细化
function drawcard(_this, type, graphArray) {

		var left = _this.left;
		var top = _this.top;

		if (type === "seen") {
			var index = getRandom({"start" : 0, "end": 51});
			var card = new Graph('seenCard', new SpritePainter({"type" : "card", "image" : cardsImage, "width" : CARD_WIDTH, "height" : CARD_HEIGHT}), [ new moveXDistance(100), new spriteIt(index) ]);
		} else if (type === "blind") {
			var card = new Graph('blindCard', new ImagePainter(blindCardImage), [ new moveXDistance(100) ]);
		} else {
			var index = type;
			var card = new Graph('seenCard', new SpritePainter({"type" : "card", "image" : cardsImage, "width" : CARD_WIDTH, "height" : CARD_HEIGHT}), [ new moveXDistance(100), new spriteIt(index) ]);
		}

		var cardLeft = _this.cardLeft;
		var cardTop = _this.cardTop;
		card.left = left + cardLeft;
		card.top = top + cardTop;

		if(cardLeft > 300) {

			_this.cardLeft = _this.CARD_VIEW_LEFT;
			cardLeft = _this.cardLeft;
			_this.cardTop += 50;
			cardTop = _this.cardTop;
			card.left = left + cardLeft;
			card.top = top + cardTop;
		}

		card.width = CARD_WIDTH;
		card.height = CARD_HEIGHT;

		card.velocityX = 300;

		graphArray.push(card);

		_this.cardLeft += CARD_INTERVAL;
	};

youView.toggle("drawCharacter", {"index" : 0});
dealerView.toggle("drawCharacter", {"index" : 0});

hitButton.onclick = function () {
	if(!hitButtonLock) {
		logic.toggle("toggleHit", {});
	}
};

standButton.onclick = function () {
	if(!standButtonLock) {
		logic.toggle("toggleStand", {});
	}
};

playButton.onclick = function () {

	standButtonLock = false;
	hitButtonLock = false;
	delete commonGraphArray.slash;
	slash = null;
	logic.toggle("toggleHit", {});
	this.style.display = "none";
}


function forEachGraph(array, time) {

	if (array.constructor === Array) {

		for(var i = 0, length = array.length; i < length; i++) {
			array[i].update(context, time).paint(context);
		}
		
	} else {
		
		for(var i in array) {
			array[i].update(context, time).paint(context);
		}
	};
	
}

var slash = new Graph("slash", new ImagePainter(slashImage));
slash.left = 130;
slash.top = 50;
slash.width = 548;
slash.height = 406;
commonGraphArray.slash = slash;

var lastTime01 = 0
function animate(time) {

	// 控制在一定fps之内
	if(time - lastTime01 > (Math.round(1000 / FPS))) {

		// console.log(Math.round(1000 / (time - lastTime01)) + "fps");

		context.clearRect(0, 0, canvas.width, canvas.height);

		forEachGraph(yourCardArray, time);
		forEachGraph(seenCardArray, time);
		forEachGraph(blindCardArray, time);

		forEachGraph(commonGraphArray, time);

		lastTime01 = time;
	}
	
	requestAnimFrame(animate);
};

requestAnimFrame(animate);
