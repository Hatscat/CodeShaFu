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

	aImg_Content: [],
	aMap: [],
	aContent: [],

	iMapSize: 64,
	iFrame: 0,
	iScore: 0,
	iCanvas_w: 1024, /* valeur fixe ! */
	iCanvas_h: 448, /* valeur fixe ! */
	iFilesLoaded: 0,
	iMouse_x: 0,
	iMouse_y: 0,

	bMouseDown: false,
	bPause: true,
	bSave: false,

	oToolsBox: null,
	oActiveTile: null
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

	isLoadedContent: function ()
	{
		if (++globalVar.iFilesLoaded >=
			(globalVar.aImg_Content.length))
		{
			init();
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
	}
}

window.onkeyup = function(event)
{
	switch (event.keyCode) {}
}

/* --------------------------------- Initialization --------------------------------- */

window.onload = function() /* 1/2 */
{
	/* le chargement des images */
	globalVar.aImg_Content[0] = globalFunc.loadImage("img/cat.jpg"); /* le chat */
	globalVar.aImg_Content[1] = globalFunc.loadImage("img/ground.jpg"); /* le terrain */
	globalVar.aImg_Content[2] = globalFunc.loadImage("img/rat.jpg"); /* le rat */
	globalVar.aImg_Content[3] = globalFunc.loadImage("img/end.jpg"); /* le end */
}

function init() /* 2/2 */
{
	globalVar.iMapSize = 64;

	/* la page du navigateur */
	globalVar.canvas = document.getElementById("canvas");
	globalVar.context = globalVar.canvas.getContext("2d");

	globalVar.canvas.width = globalVar.iCanvas_w;
	globalVar.canvas.height = globalVar.iCanvas_h;

	globalVar.canvas.style.left = (window.innerWidth - globalVar.iCanvas_w) * 0.5 + "px";
	document.getElementById("editor").style.height = window.innerHeight - globalVar.iCanvas_h + "px";

	/* Ace editor */
	globalVar.editor = ace.edit("editor");
    globalVar.editor.setTheme("ace/theme/monokai");
    globalVar.editor.getSession().setMode("ace/mode/javascript");

	/* les objets */
	globalVar.aContent[0] = new Content("empty", null);
	globalVar.aContent[1] = new Content("cat", globalVar.aImg_Content[0]);
	globalVar.aContent[2] = new Content("path", globalVar.aImg_Content[1]);
	globalVar.aContent[3] = new Content("enemy", globalVar.aImg_Content[2]);
	globalVar.aContent[4] = new Content("end", globalVar.aImg_Content[3]);

	globalVar.oActiveTile = {
		x:0,
		y:0
	}

	/* génération de la map vierge */
	globalVar.aMap = createEmptyMap();

	run();
}

function createEmptyMap()
{
	var map = [];

	for (var i = 0; i < 16; i++)
	{
		map[i] = [];

		for (var j = 0; j < 7; j++) // les lignes
		{
			map[i][j] = new Content("empty", null);
		}
	}
	return map;
}

function drawMap (map)
{
	for (var i = 0; i < 16; i++) // les colonnes
	{	
		for (var j = 0; j < 7; j++) // les lignes
		{
			if (!!map[i][j])
			{
				switch(map[i][j].id)
				{
					case "cat":
						globalVar.aContent[0].draw(i * globalVar.iMapSize, j * globalVar.iMapSize);
					break;
					case "path":
						globalVar.aContent[1].draw(i * globalVar.iMapSize, j * globalVar.iMapSize);
					break;
					case "enemy":
						globalVar.aContent[2].draw(i * globalVar.iMapSize, j * globalVar.iMapSize);
					break;
					case "end":
						globalVar.aContent[3].draw(i * globalVar.iMapSize, j * globalVar.iMapSize);
					break;
				}
			}
		}
	}
}

function drawMapGrid (map)
{
	for (var i = 0; i < 16; i++) // les colonnes
	{	
		for (var j = 0; j < 7; j++) // les lignes
		{
			globalVar.context.strokeStyle = "#0f0";
			globalVar.context.lineWidth = 4;
			globalVar.context.strokeRect(i * globalVar.iMapSize, j * globalVar.iMapSize, globalVar.iMapSize, globalVar.iMapSize);
		}
	}
}


document.getElementById("run_button").onclick = function()
{
	globalVar.bPause = false;
}

document.getElementById("stop_button").onclick = function()
{
	globalVar.bPause = true;
}

document.getElementById("save_button").onclick = function()
{
	globalVar.bSave = true;
}
