/* --------------------------------- Run Loop --------------------------------- */

function run()
{
	var gVar = globalVar; /* pour optimiser les performances, en stockant ici toutes les valeurs des variables globales */
	var gFunc = globalFunc;

	requestAnimFrame(run);

	globalVar.context.fillStyle = "#000";
	globalVar.context.fillRect(0, 0, gVar.iCanvas_w, gVar.iCanvas_y);

/* ****************** Scene ****************** */


	drawMap(gVar.aMap);

	if (gVar.bPause) // en pause == en mode edition
	{
		drawMapGrid();

		if (gVar.bMouseDown)
		{
			var xi = Math.abs(Math.floor((gVar.iMouse_x - gVar.canvas.offsetLeft) / gVar.iMapSize));
			var yj = Math.abs(Math.floor((gVar.iMouse_y - gVar.canvas.offsetTop) / gVar.iMapSize));
			
			if(xi < gVar.aMap.length && yj < gVar.aMap[0].length)
			{
				gVar.oActiveTile.x = xi;
				gVar.oActiveTile.y = yj;
				gVar.aMap[xi][yj].showScript();
			}
		}

		// if(gVar.aMap[xi][yj].showScript();)

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
