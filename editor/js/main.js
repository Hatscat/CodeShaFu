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

	iTileSize: 64,
	iToolsBoxWidth: 70,
	iFrame: 0,
	iScore: 0,
	iCanvas_w: 1024 + 70, /* valeur fixe ! */
	iCanvas_h: 448, /* valeur fixe ! */
	iFilesLoaded: 0,
	iMouse_x: 0,
	iMouse_y: 0,
	
	sElementDragId: "",

	bMouseDown: false,
	bPause: true,
	bElementDrag: false,

	oToolsBox: null
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
		var mouse = {
			x: globalVar.iMouse_x - globalVar.canvas.offsetLeft,
			y: globalVar.iMouse_y - globalVar.canvas.offsetTop,
		};

		if ((globalVar.bMouseDown && mouse.x >= xywh[0] && mouse.x < xywh[0] + xywh[2])
		&& (mouse.y >= xywh[1] && mouse.y < xywh[1] + xywh[3]))
		{
			return true;
		}
		else
		{
			return false;
		}
	},

	drawStrokeBox: function (xywh, color, size)
	{
		globalVar.context.strokeStyle = color;
		globalVar.context.lineWidth = size;
		globalVar.context.strokeRect(xywh[0], xywh[1], xywh[2], xywh[3]);
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
	globalVar.iTileSize = 64;

	/* la page du navigateur */
	globalVar.canvas = document.getElementById("canvas");
	globalVar.context = globalVar.canvas.getContext("2d");

	globalVar.canvas.width = globalVar.iCanvas_w;
	globalVar.canvas.height = globalVar.iCanvas_h;

	globalVar.canvas.style.left = (window.innerWidth - globalVar.iCanvas_w) * 0.5 + "px";
	document.getElementById("editor").style.height = window.innerHeight - globalVar.iCanvas_h + "px";
	document.getElementById("editor").style.left = (window.innerWidth - globalVar.iCanvas_w) * 0.5 + "px";

	/* Ace editor */
	globalVar.editor = ace.edit("editor");
    globalVar.editor.setTheme("ace/theme/monokai");
    globalVar.editor.getSession().setMode("ace/mode/javascript");

	/* les objets */
	globalVar.oToolsBox = {

		x: globalVar.iCanvas_w - 70,
		y: 0,
		w: globalVar.iToolsBoxWidth,
		h: globalVar.iCanvas_h,
		color: "#0f0", // vert
		aContent: [
			new Content("empty", null),
			new Content("cat", globalVar.aImg_Content[0]),
			new Content("path", globalVar.aImg_Content[1]),
			new Content("enemy", globalVar.aImg_Content[2]),
			new Content("end", globalVar.aImg_Content[3])
		],

		display: function ()
		{
			globalVar.context.fillStyle = this.color;
			globalVar.context.fillRect(this.x, this.y, this.w, this.h);

			for (var i = 0, c = this.aContent.length; i < c; i++)
			{
				this.aContent[i].x = this.x + (globalVar.iToolsBoxWidth - globalVar.iTileSize) * 0.5;

				this.aContent[i].y = i * globalVar.iTileSize
				* (globalVar.iCanvas_h / (globalVar.iTileSize * (this.aContent.length)))
				+ globalVar.iTileSize * (globalVar.iTileSize / globalVar.iCanvas_h);

				this.aContent[i].draw();
			}
		}
	};

	globalVar.oToolsBox.aBox = [globalVar.oToolsBox.x, globalVar.oToolsBox.y, globalVar.oToolsBox.w, globalVar.oToolsBox.h],

	/* génération de la map vierge */
	globalVar.aMap = createEmptyMap();

	globalVar.aMap[0][0] = new Content("cat", globalVar.aImg_Content[0]);

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
			map[i][j].x = i * globalVar.iTileSize;
			map[i][j].y = j * globalVar.iTileSize;

			if (!!map[i][j])
			{
				map[i][j].draw();
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
			globalVar.context.strokeRect(i * globalVar.iTileSize, j * globalVar.iTileSize, globalVar.iTileSize, globalVar.iTileSize);
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
