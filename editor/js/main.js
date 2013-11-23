/* --------------------------------- requestAnimFrame --------------------------------- */

window.requestAnimFrame = (
	function()
	{
		return	window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(callback, element)
		{
			window.setTimeout(callback, 1000 / 60);
		};
	}
)();

/* --------------------------------- Global Variables --------------------------------- */

var globalVar = {
		
	context: null,
	canvas: null,
	editor: null,

	aImg_Bg: [],
	aImg_Content: [],
	aImg_Player: [],
	aAudio: [],
	aScenes: [],

	iFrame: 0,
	iScale: 0,
	iScore: 0,
	iSceneNb: 0,
	iHistoryState: 0,
	iCanvas_w: 1024, /* valeur fixe ! */
	iCanvas_h: 448, /* valeur fixe ! */
	iFilesLoaded: 0,
	iMouse_x: 0,
	iMouse_y: 0,

	bMouseDown: false,
	bKeyDown_left: false,
	bKeyDown_right: false,
	bKeyDown_up: false,
	bKeyDown_down: false,
	bPause: false,
	
	oPlayer: null

};

/* --------------------------------- Global Functions --------------------------------- */

var globalFunc = {

	loadImage: function (sImageSrc)
	{
		var img = new Image();
		img.onload = globalFunc.isLoadedContent;
		img.src = sImageSrc;
		return img;
	},

	loadAudio: function (sAudioSrc)
	{
		var audio = new Audio();
		audio.addEventListener("canplaythrough", globalFunc.isLoadedContent, false);
		audio.src = sAudioSrc;
		return audio;
	},

	isLoadedContent: function ()
	{
		if (++globalVar.iFilesLoaded >=
			(globalVar.aImg_Bg.length
			+ globalVar.aImg_Content.length
			+ globalVar.aImg_Player.length
			+ globalVar.aAudio.length))
		{
			init();
		}
	},

	collision: function (box1, box2)
	{
		if ((box1[0] >= box2[0] + box2[2])
		|| (box1[0] + box1[2] <= box2[0])
		|| (box1[1] >= box2[1] + box2[3])
		|| (box1[1] + box1[3] <= box2[1]))
		{
			return false;
		}
		else
		{
			return true;
		}
	},

	isButtonClicked: function (xywh)
	{
		if ((globalVar.bMouseDown && globalVar.iMouse_x >= xywh[0] && globalVar.iMouse_x < xywh[0] + xywh[2])
		&& (globalVar.iMouse_y >= xywh[1] && globalVar.iMouse_y < xywh[1] + xywh[3]))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
};

/* --------------------------------- Window Events --------------------------------- */

window.onmousemove = function(event)
{
	globalVar.iMouse_x = event.x;
	globalVar.iMouse_y = event.y;
}

window.onmousedown = function(event)
{
	globalVar.bMouseDown = true;
}

window.onmouseup = function(event)
{
	globalVar.bMouseDown = false;
}

/* --------------------------------- Keyboard Events --------------------------------- */

window.onkeydown = function(event)
{
	//console.log(event.keyCode);
	switch (event.keyCode)
	{
		case 32 : /* space button */
			globalVar.bPause = !globalVar.bPause;
			run();
		break;
		case 37 : /* left arrow */
			globalVar.bKeyDown_left = true;
		break;
		case 39 : /* right arrow */
			globalVar.bKeyDown_right = true;
		break;
		case 38 : /* up arrow */
			globalVar.bKeyDown_up = true;
		break;
		case 40 : /* down arrow */
			globalVar.bKeyDown_down = true;
		break;
		case 81 : /* q arrow */
			globalVar.bKeyDown_left = true;
		break;
		case 68 : /* d arrow */
			globalVar.bKeyDown_right = true;
		break;
		case 90 : /* z key */
			globalVar.bKeyDown_up = true;
		break;
		case 83 : /* s arrow */
			globalVar.bKeyDown_down = true;
		break;
	}
}

window.onkeyup = function(event)
{
	switch (event.keyCode) {

		case 37 : /* left arrow */
			globalVar.bKeyDown_left = false;
		break;
		case 39 : /* right arrow */
			globalVar.bKeyDown_right = false;
		break;
		case 38 : /* up arrow */
			globalVar.bKeyDown_up = false;
		break;
		case 40 : /* down arrow */
			globalVar.bKeyDown_down = false;
		break;
		case 81 : /* q arrow */
			globalVar.bKeyDown_left = false;
		break;
		case 68 : /* d arrow */
			globalVar.bKeyDown_right = false;
		break;
		case 90 : /* z key */
			globalVar.bKeyDown_up = false;
		break;
		case 83 : /* s arrow */
			globalVar.bKeyDown_down = false;
		break;
	}
}

/* --------------------------------- Initialization --------------------------------- */

window.onload = function() /* 1/2 */
{
	/* le chargement des images et des sons */
	globalVar.aImg_Bg[0] = globalFunc.loadImage("img/bg.jpg"); /* le bg */

	//globalVar.aImg_Player[0] = globalFunc.loadImage("img/"); /* le player */
	
	//globalVar.aAudio[0] = globalFunc.loadAudio("audio/"); /* la musique */
}

function init() /* 2/2 */
{
	/* la page du navigateur */
	globalVar.canvas = document.getElementById("canvas");
	globalVar.context = globalVar.canvas.getContext("2d");

	globalVar.canvas.style.left = window.innerWidth * 0.5 - globalVar.iCanvas_w * 0.5 + "px";
	document.getElementById("editor").style.height = window.innerHeight - globalVar.iCanvas_h + "px";

	/* Ace editor */
	globalVar.editor = ace.edit("editor");
    globalVar.editor.setTheme("ace/theme/monokai");
    globalVar.editor.getSession().setMode("ace/mode/javascript");

	/* les objets */
	//globalVar.oPlayer = new Player(globalVar.aImg_Player[0], x, y, w, h);

	// for (var i = 0, c = globalVar.aImg_Bg.length; i < c; i++)
	// {
	// 	globalVar.aScenes.push(new Scene(globalVar.aImg_Bg[i], id));
	// }

	run();
}
