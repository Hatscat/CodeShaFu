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
/*	toolsBox_canvas: null,
	toolsBox_context: null,
*/
	aImg_Content: [],
	aMap: [],
	aTools: [],

	iMapSize: 64,
	iFrame: 0,
	iScore: 0,
	iCanvas_w: 1024, /* valeur fixe ! */
	iCanvas_h: 448, /* valeur fixe ! */
	iFilesLoaded: 0,
	iMouse_x: 0,
	iMouse_y: 0,

	bMouseDown: false,
	bPause: false,

	oGameContent: null
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

	/* la boite à outil pour l'editeur */
/*
	globalVar.toolsBox_canvas = document.getElementById("tools");
	globalVar.toolsBox_context = globalVar.toolsBox_canvas.getContext("2d");

	globalVar.toolsBox_canvas.width = globalVar.iMapSize;
	globalVar.toolsBox_canvas.height = globalVar.iCanvas_h;

	globalVar.toolsBox_canvas.style.left = (window.innerWidth - globalVar.iCanvas_w) * 0.5 + globalVar.iCanvas_w + globalVar.iMapSize + "px";
*/

	/* Ace editor */
	globalVar.editor = ace.edit("editor");
    globalVar.editor.setTheme("ace/theme/monokai");
    globalVar.editor.getSession().setMode("ace/mode/javascript");

	/* les objets */
	for (var i = 0, c = globalVar.aImg_Content.length; i < c; i++)
		globalVar.aTools[i] = new Tool(globalVar.aImg_Content[i]);

	/* génération de la map */
	//globalVar.aMap = createMap();
	//readMap(globalVar.aMap);

	run();
}


function readMap (map)
{
	for (var i = 0; i < 16; i++) // les colonnes
	{	
		for (var j = 0; j < 7; j++) // les lignes
		{
			switch(map[i][j])
			{
				case "cat":
					globalVar.context.fillStyle = "#fff";
					//oCat.x = i * globalVar.iMapSize;
					//oCat.y = j * globalVar.iMapSize;
				break;
				case "path":
					globalVar.context.fillStyle = "#0f0";
					//aPathTiles.push(new PathTile(i * globalVar.iMapSize, j * globalVar.iMapSize));
				break;
				case "enemy":
					globalVar.context.fillStyle = "#f00";
					//aEnemies.push(new Enemy(i * globalVar.iMapSize, j * globalVar.iMapSize));
				break;
				case "end":
					globalVar.context.fillStyle = "#ff0";
					//oEnd.x = i * globalVar.iMapSize;
					//oEnd.y = j * globalVar.iMapSize;
				break;
			}
			globalVar.context.fillRect(i * globalVar.iMapSize, j * globalVar.iMapSize, globalVar.iMapSize, globalVar.iMapSize);
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
	run();
}

document.getElementById("stop_button").onclick = function()
{
	globalVar.bPause = true;
	run();
}
