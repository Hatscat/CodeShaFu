/* --------------------------------- Run Loop --------------------------------- */

function run()
{
	var gVar = globalVar; /* pour optimiser les performances, en stockant ici toutes les valeurs des variables globales */
	var gFunc = globalFunc;

	requestAnimFrame(run);

	globalVar.context.fillStyle = "#000";
	globalVar.context.fillRect(0, 0, gVar.iCanvas_w, gVar.iCanvas_y);

/* ****************** Scene ****************** */

	drawMapGrid();

	drawMap(gVar.aMap);

	if (gVar.bPause) // en pause == en mode edition
	{
		if (gVar.bMouseDown)
		{
			var xi = Math.floor((gVar.iMouse_x - gVar.canvas.offsetLeft) / gVar.iMapSize);
			var yj = Math.floor((gVar.iMouse_y - gVar.canvas.offsetTop) / gVar.iMapSize);
			//gVar.aMap[Math.floor([xi][yj].deploy();
			console.log("x : " + xi);
			console.log("y : " + yj);
		}

/* plus la peine de faire ça : ;)
		for (var i = 0, c = globalVar.aMap.length; i < c; i++)
		{
			for (var j = 0, d = globalVar.aMap[i].length; j < d; j++)
			{
				if (gFunc.isButtonClicked(globalVar.aMap[i][j].aBox))
				{

				}
			}
		}
*/
	}
	else // le jeu en mode lecture + execution du code de l'éditeur
	{
	
/* ****************** Content ****************** */
		
		
	}

/* ****************** frame incrementation ****************** */

	if (++gVar.iFrame > 9999)
	{
		gVar.iFrame = 0;
		gVar.context.clearRect(0, 0, gVar.iCanvas_w, gVar.iCanvas_y);
	}
		
	globalVar = gVar;
	globalFunc = gFunc;
}
