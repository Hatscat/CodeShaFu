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
	aText: ["Salut, je suis un chat et oui je peux parler. Comme t'es gentil et que t'a rien de mieux à faire tu vas m'aider. Clique sur run pour lancer mon aventure !", 
			"Aie Aie, je suis trop faible, si seulement quelqu'un pouvait tricher et modifier mes stats...", "YAY je les ai poutré !"],
	iTextIndex: 0,

	aImg_Content: [],
	aMap: [], /* 16 x 7 tiles */
	aContent: [], /* models des elements (objets dans les tiles) */

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
	sMode: "",
	sMapName: "0",

	bMouseDown: false,
	bPause: true,
	bElementDrag: false,
	bNewTurn: false,

	oToolsBox: null, // pour l'éditeur de niveaux
	oActiveTile: null, // { x:#, y:# }
	oRootScript: null // le script de base des objets non vides
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
			y: globalVar.iMouse_y - globalVar.canvas.offsetTop
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

window.onmousemove = function (event)
{
	globalVar.iMouse_x = event.x;
	globalVar.iMouse_y = event.y;
}

window.onmousedown = function (event)
{
	globalVar.bMouseDown = true;
}

window.onmouseup = function (event)
{
	globalVar.bMouseDown = false;
}

/* --------------------------------- Initialization --------------------------------- */

window.onload = function () /* 1/2 */
{
	/* le chargement des images */
	globalVar.aImg_Content[0] = globalFunc.loadImage("img/cat.jpg"); /* le chat */
	globalVar.aImg_Content[1] = globalFunc.loadImage("img/ground.jpg"); /* le terrain */
	globalVar.aImg_Content[2] = globalFunc.loadImage("img/rat.jpg"); /* le rat */
	globalVar.aImg_Content[3] = globalFunc.loadImage("img/end.jpg"); /* le end */
	globalVar.aImg_Content[4] = globalFunc.loadImage("img/banniere.png"); /* banniere telethon */
	globalVar.aImg_Content[5] = globalFunc.loadImage("img/chat1.png"); /* chat explicatif */
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
	document.getElementById("editor").style.height = window.innerHeight + "px";/* - globalVar.iCanvas_h
													- document.getElementById("run_button").style.height + "px"; */
	
	//document.getElementById("editor").style.left = (window.innerWidth - globalVar.iCanvas_w) * 0.5 + "px";

	/* Ace editor */
	globalVar.editor = ace.edit("editor");
    globalVar.editor.setTheme("ace/theme/monokai");
    globalVar.editor.getSession().setMode("ace/mode/javascript");
    globalVar.editor.resize();

	/* les objets */
	globalVar.oToolsBox = {

		x_px: globalVar.iCanvas_w - 70,
		y_px: 0,
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
			globalVar.context.fillRect(this.x_px, this.y_px, this.w, this.h);

			for (var i = 0, c = this.aContent.length; i < c; i++)
			{
				this.aContent[i].x_px = this.x_px + (globalVar.iToolsBoxWidth - globalVar.iTileSize) * 0.5;

				this.aContent[i].y_px = i * globalVar.iTileSize
				* (globalVar.iCanvas_h / (globalVar.iTileSize * (this.aContent.length)))
				+ globalVar.iTileSize * (globalVar.iTileSize / globalVar.iCanvas_h);

				this.aContent[i].draw();
			}
		}
	};

	globalVar.oToolsBox.aBox = [globalVar.oToolsBox.x_px, globalVar.oToolsBox.y_px, globalVar.oToolsBox.w, globalVar.oToolsBox.h];

	//globalVar.oRootScript = ;

	/* génération de la map */
	loadMap(globalVar.sMapName);

	//console.log(globalVar.aMap)

	run(0);
}

function loadMap (sMapName)
{
	$.ajax("php/mapData.php", {

		data: {"requestMap": sMapName},
		cache: false,
		success: function (datas)
		{
			var jsonMap = datas;
			if (jsonMap == "\"miss\""  ||  !jsonMap.length) // == pas de map
			{
				createEmptyMap();
			}
			else
			{
				globalVar.aMap = readJsonMap(jsonMap);
				globalVar.oActiveTile = {x: 0, y: 0};
				globalVar.aMap[globalVar.oActiveTile.x][globalVar.oActiveTile.y].showScript();
			}
		},
		error: function (datas)
		{
			createEmptyMap();
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

	globalVar.aMap = map;
	globalVar.oActiveTile = {x: 0, y: 0};
	globalVar.aMap[globalVar.oActiveTile.x][globalVar.oActiveTile.y].showScript();
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

			for (var j = 0; j < originalMap.aMap[i].length; j++) // les lignes
			{
				switch (originalMap.aMap[i][j].id)
				{
					case "empty":
						map[i][j] = new Content(originalMap.aMap[i][j].id, null, originalMap.aMap[i][j].script);
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

function drawMap ()//map)
{
	for (var i = 0; i < globalVar.aMap.length; i++) // les colonnes
	{	
		for (var j = 0; j < globalVar.aMap[i].length; j++) // les lignes
		{
			globalVar.aMap[i][j].x_px = i * globalVar.iTileSize;
			globalVar.aMap[i][j].y_px = j * globalVar.iTileSize;

			globalVar.aMap[i][j].x = i;
			globalVar.aMap[i][j].y = j;

			globalVar.aMap[i][j].draw();
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
	if (confirm("êtes vous sûr ?")) createEmptyMap();
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
	//console.log(jsData);
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
	createEmptyMap();
}

document.getElementById("load_button").onclick = function()
{
	var mapName = document.getElementById("save_name").value;
	loadMap(mapName);
}

function collision (aSelf, aTarget) // aSelf = [x, y]; aTarget = [x, y];
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

	if (direction == "y" && y < globalVar.aMap[x].length + 1)
	{
		globalVar.aMap[x][y+1].move2Top(); // ok
	}
	
	else if (direction == "x" && x < globalVar.aMap.length + 1)
	{
		globalVar.aMap[x+1][y].move2Left(); // ok
	}

	else if (direction == "-y" && y > 0) // ok
	{
		globalVar.aMap[x][y] = globalVar.aMap[x][y-1];
		globalVar.aMap[x][y-1] = memory;
	}
	
	else if (direction == "-x" && x > 0) // ok
	{
		globalVar.aMap[x][y] = globalVar.aMap[x-1][y];
		globalVar.aMap[x-1][y] = memory;
	}
}

function fight (A, B) // ok
{
	//while (A.life > 0 && B.life > 0)
	//{
	B.life -= A.attack - B.defense;
	A.life -= B.attack - A.defense;	
	//}
	if (A.life <= 0)
	{
		globalVar.aMap[A.x][A.y] = new Content("ground", globalVar.aImg_Content[1]);
		return false; // A est mort
	}
	else
	{
		globalVar.aMap[B.x][B.y] = new Content("ground", globalVar.aImg_Content[1]);
		return false; // A est vivant
	}
}

