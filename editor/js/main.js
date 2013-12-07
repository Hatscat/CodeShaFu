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
	sMode: "",

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
	sMapName: "0",

	bMouseDown: false,
	bPause: true,
	bElementDrag: false,

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

		globalVar.context.fillStyle = color;
		globalVar.context.globalAlpha = 0.25;
		globalVar.context.fillRect(xywh[0], xywh[1], xywh[2], xywh[3]);
		globalVar.context.globalAlpha = 1;
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
	if (!!document.getElementById("save_button"))
	{
		globalVar.sMode ="editor";
	}
	else
	{
		globalVar.sMode ="game";
	}
		
	globalVar.iTileSize = 64;

	globalVar.oActiveTile = {
		x:0,
		y:0
	}

	/* la page du navigateur */
	globalVar.canvas = document.getElementById("canvas");
	globalVar.context = globalVar.canvas.getContext("2d");

	globalVar.canvas.width = globalVar.iCanvas_w;
	globalVar.canvas.height = globalVar.iCanvas_h;

	globalVar.canvas.style.left = (window.innerWidth - globalVar.iCanvas_w) * 0.5 + "px";
	document.getElementById("editor").style.height = 
	window.innerHeight - globalVar.iCanvas_h - document.getElementById("run_button").style.height + "px";
	
	//document.getElementById("editor").style.left = (window.innerWidth - globalVar.iCanvas_w) * 0.5 + "px";

	/* Ace editor */
	globalVar.editor = ace.edit("editor");
    globalVar.editor.setTheme("ace/theme/monokai");
    globalVar.editor.getSession().setMode("ace/mode/javascript");
    globalVar.editor.resize();

	/* les objets */
	globalVar.oToolsBox = {

		x: globalVar.iCanvas_w - 70,
		y: 0,
		w: globalVar.iToolsBoxWidth,
		h: globalVar.iCanvas_h,
		color: "#6f6", // vert
		aContent: [
			new Content("empty", null, ""),
			new Content("cat", globalVar.aImg_Content[0], ""),
			new Content("path", globalVar.aImg_Content[1], ""),
			new Content("enemy", globalVar.aImg_Content[2], ""),
			new Content("end", globalVar.aImg_Content[3], "")
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

	globalVar.oToolsBox.aBox = [globalVar.oToolsBox.x, globalVar.oToolsBox.y, globalVar.oToolsBox.w, globalVar.oToolsBox.h];

	/* génération de la map */
	loadMap(globalVar.sMapName);

	//console.log(globalVar.aMap)

	run();
}

function loadMap (mapName)
{
	$.ajax("php/mapData.php", {

		data: {"requestMap": mapName},
		cache: false,
		success: function(datas)
		{
			var jsonMap = datas;
			if (jsonMap == "\"miss\""  ||  !jsonMap.length) // == pas de map
			{
				globalVar.aMap = createEmptyMap();
			}
			else
			{
				globalVar.aMap = readJsonMap(jsonMap);
				globalVar.aMap[globalVar.oActiveTile.x][globalVar.oActiveTile.y].showScript();
			}
			
		},
		error: function(datas)
		{
			globalVar.aMap = createEmptyMap();
		}
	});
}

function createEmptyMap ()
{
	var map = [];

	for (var i = 0; i < 16; i++)  // les colonnes
	{
		map[i] = [];

		for (var j = 0; j < 7; j++) // les lignes
		{
			map[i][j] = new Content("empty", null, "");
		}
	}
	return map;
}

function readJsonMap (jsonMap)
{
	try
	{
		var originalMap = JSON.parse(jsonMap);
		originalMap = JSON.parse(originalMap);
		
		var map = [];

		//console.log("originalMap : " + originalMap.aMap) //ok

		for (var i = 0; i < originalMap.aMap.length; i++) // les colonnes
		{	
			map[i] = [];

			for (var j = 0; j < originalMap.aMap[0].length; j++) // les lignes
			{
				switch (originalMap.aMap[i][j].id)
				{
					case "empty":
						map[i][j] = new Content(originalMap.aMap[i][j].id, null, "");
					break;
					case "cat":
						map[i][j] = new Content(originalMap.aMap[i][j].id, globalVar.aImg_Content[0], originalMap.aMap[i][j].script);
					break;
					case "path":
						map[i][j] = new Content(originalMap.aMap[i][j].id, globalVar.aImg_Content[1], originalMap.aMap[i][j].script);
					break;
					case "enemy":
						map[i][j] = new Content(originalMap.aMap[i][j].id, globalVar.aImg_Content[2], originalMap.aMap[i][j].script);
					break;
					case "end":
						map[i][j] = new Content(originalMap.aMap[i][j].id, globalVar.aImg_Content[3], originalMap.aMap[i][j].script);
					break;
				}
			}
		}
		return map;
	}
	catch (err) 
	{
		console.log("fuck you");
		createEmptyMap();
	}
}



function drawMap (map)
{
	for (var i = 0; i < globalVar.aMap.length; i++) // les colonnes
	{	
		for (var j = 0; j < globalVar.aMap[0].length; j++) // les lignes
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
	for (var i = 0; i < globalVar.aMap.length; i++) // les colonnes
	{	
		for (var j = 0; j < globalVar.aMap[0].length; j++) // les lignes
		{
			globalVar.context.strokeStyle = "#6f6";
			globalVar.context.lineWidth = 1;
			globalVar.context.strokeRect(i * globalVar.iTileSize, j * globalVar.iTileSize, 
				globalVar.iTileSize, globalVar.iTileSize);
		}
	}
}

document.getElementById("run_button").onclick = function()
{
	globalVar.bPause = !globalVar.bPause;

	if (globalVar.bPause)
	{
		document.getElementById("run_button").innerHTML = "RUN";
		//document.getElementById("run_button").className = "RUN";
	}
	else
	{
		document.getElementById("run_button").innerHTML = "STOP";
	}
}

document.getElementById("reset_button").onclick = function()
{
	globalVar.aMap = createEmptyMap();
}

document.getElementById("save_button").onclick = function()
{
	var jsData = {aMap: []}; //globalVar.aMap

	for (var i = 0; i < globalVar.aMap.length; i++) // les colonnes
	{	
		jsData.aMap[i] = [];

		for (var j = 0; j < globalVar.aMap[0].length; j++) // les lignes
		{
			jsData.aMap[i][j] = {};
			jsData.aMap[i][j].id = globalVar.aMap[i][j].id;
			jsData.aMap[i][j].script = globalVar.aMap[i][j].script;
		}
	}
	console.log( jsData);
	var jsonData = JSON.stringify(jsData);
	

	var mapName = document.getElementById("save_name").value;

	$.ajax("php/mapData.php", {

		data: {"setMap": jsonData, "mapName": mapName},
		cache: false,
		success: function(datas)
		{
			console.log("success");
		},
		error: function(datas)
		{
			console.log("error : " + datas);
		}
	});

	document.getElementById("save_name").value = "";
	globalVar.aMap = createEmptyMap();
}

document.getElementById("load_button").onclick = function()
{
	var mapName = document.getElementById("save_name").value;
	loadMap(mapName);
}

function collision (aSelf, aTarget)
{
	switch (globalVar.aMap[aTarget[0]][aTarget[1]])
	{
		case globalVar.aMap[aSelf[0]-1][aSelf[1]] : // collision: cible à gauche
			return [-1, 0];
		break;
		case globalVar.aMap[aSelf[0]+1][aSelf[1]] : // collision: cible à droite
			return [1, 0];
		break;
		case globalVar.aMap[aSelf[0]][aSelf[1]-1] : // collision: cible en haut
			return [0, -1];
		break;
		case globalVar.aMap[aSelf[0]][aSelf[1]+1] : // collision: cible en bas
			return [0, 1];
		break;
		default : // pas de collision
			return false;
		break;
	}
}

function swap (direction, x, y) // ok
{
	var memory = globalVar.aMap[x][y];

	if(direction == "y")
	{
		globalVar.aMap[x][y] = globalVar.aMap[x][y+1];
		globalVar.aMap[x][y+1] = memory;
	}
	
	else if(direction == "x")
	{
		globalVar.aMap[x][y] = globalVar.aMap[x+1][y];
		globalVar.aMap[x+1][y] = memory;
	}

	else if(direction == "-y")
	{
		globalVar.aMap[x][y] = globalVar.aMap[x][y-1];
		globalVar.aMap[x][y-1] = memory;
	}
	
	else if(direction == "-x")
	{
		globalVar.aMap[x][y] = globalVar.aMap[x-1][y];
		globalVar.aMap[x-1][y] = memory;
	}
}

function combat (A, B) // ok
{
	//debugger;
	while (A.life > 0 && B.life > 0)
	{
		B.life -= A.attack - B.defense;
		A.life -= B.attack - A.defense;	
	}
	if (A.life <= 0)
	{
		globalVar.aMap[A.xi][A.yj] = new Content("ground", globalVar.aImg_Content[1]);
		return true;
	}
		
	else
	{
		globalVar.aMap[B.xi][B.yj] = new Content("ground", globalVar.aImg_Content[1]);
		return false;	
	}
}

