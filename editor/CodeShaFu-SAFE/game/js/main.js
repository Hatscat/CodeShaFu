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

var globalVar = 
{
		
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
	bMonstreMort: false,
	bEvalFait: false,

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
		case 27 : /* space button */
			globalVar.bPause = !globalVar.bPause;
			run();
		break;
	}
}

/* --------------------------------- Initialization --------------------------------- */

window.onload = function() /* 1/2 */
{
	/* le chargement des images */
	globalVar.aImg_Content[0] = globalFunc.loadImage("img/CatRed.jpg"); /* le chat */
	globalVar.aImg_Content[1] = globalFunc.loadImage("img/Case.jpg"); /* le terrain */
	globalVar.aImg_Content[2] = globalFunc.loadImage("img/Ennemy.jpg"); /* le rat */
	globalVar.aImg_Content[3] = globalFunc.loadImage("img/CaseRed.jpg"); /* le end */
}

function init() /* 2/2 */
{
	globalVar.iMapSize = 64;
	//globalVar.rat = false;

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

	globalVar.oActiveTile = 
	{
		x:0,
		y:0
	}

	/* génération de la map vierge */
	globalVar.aMap = createEmptyMap();

	globalVar.aMap[0][0] = new Content("cat", globalVar.aImg_Content[0], "this.life = 50\n this.defense = 10 \n this.attack = 30 \n this.targetX = 0 \n this.targetY = 0", 0,0) 
	globalVar.aMap[6][4] = new Content("enemy", globalVar.aImg_Content[2], "this.life = 50\n this.defense = 10 \n this.attack = 40",6,4);
	globalVar.aMap[15][4] = new Content("end", globalVar.aImg_Content[3], "//Rien à modifier",15,4);

	globalVar.aMap[globalVar.oActiveTile.x][globalVar.oActiveTile.y].showScript();

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
			map[i][j] = new Content("ground", globalVar.aImg_Content[1], "//Rien à modifier", i, j);
		}
	}
	return map;
}
function collision(cat)
{
	//debugger;
	var bool = false;

	if(cat.xI != 0)
	{
		if(globalVar.aMap[cat.xI-1][cat.yI].id == "enemy" || globalVar.aMap[cat.xI-1][cat.yI].id == "empty" || globalVar.aMap[cat.xI-1][cat.yI].id == "end")
		{
			bool = true;
			return(globalVar.aMap[cat.xI-1][cat.yI])
		}
	}

	if(cat.xI != 15)
	{
		if(globalVar.aMap[cat.xI+1][cat.yI].id == "enemy" || globalVar.aMap[cat.xI+1][cat.yI].id == "empty"|| globalVar.aMap[cat.xI+1][cat.yI].id== "end")
		{
			bool = true;	
			return(globalVar.aMap[cat.xI+1][cat.yI])
		}

	}

	if(cat.yI != 0)
	{
		if(globalVar.aMap[cat.xI][cat.yI-1].id == "enemy" || globalVar.aMap[cat.xI][cat.yI-1].id == "empty"|| globalVar.aMap[cat.xI][cat.yI-1].id== "end")
		{
			bool = true;
			return(globalVar.aMap[cat.xI][cat.yI-1])
		}
	}

	if(cat.yI != 6)
	{
		if(globalVar.aMap[cat.xI][cat.yI+1].id == "enemy" || globalVar.aMap[cat.xI][cat.yI+1].id == "empty"|| globalVar.aMap[cat.xI][cat.yI+1].id== "end")
		{
			bool = true;
			return(globalVar.aMap[cat.xI][cat.yI+1])
		}
	}

	if(bool == false)
		return(false);
}


function drawMap (map)
{
	for (var i = 0; i < 16; i++) // les colonnes
	{	
		for (var j = 0; j < 7; j++) // les lignes
		{
			if (!!map[i][j])
			{
				map[i][j].draw(i * globalVar.iMapSize, j * globalVar.iMapSize);
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

function swap(direction, x, y)
{
	var memory = globalVar.aMap[x][y];

	if(direction == "y")
	{
		globalVar.aMap[x][y] = globalVar.aMap[x][y+1]
		globalVar.aMap[x][y+1] = memory;
	}
	
	else if(direction == "x")
	{
		globalVar.aMap[x][y] = globalVar.aMap[x+1][y]
		globalVar.aMap[x+1][y] = memory;
	}

	else if(direction == "-y")
	{
		globalVar.aMap[x][y] = globalVar.aMap[x][y-1]
		globalVar.aMap[x][y-1] = memory;
	}
	
	else if(direction == "-x")
	{
		globalVar.aMap[x][y] = globalVar.aMap[x-1][y]
		globalVar.aMap[x-1][y] = memory;
	}
}

function combat(A, B)
{
	//debugger;
	while(B.life >0  && A.life > 0)
	{
		B.life -= A.attack - B.defense;
		A.life -= B.attack - A.defense;	
		
	}
	if(A.life < 0)
		globalVar.aMap[A.xI][A.yI] = new Content("ground", globalVar.aImg_Content[1])

	else
	{
		globalVar.aMap[B.xI][B.yI] = new Content("ground", globalVar.aImg_Content[1])
		globalVar.bMonstreMort = true;	
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
