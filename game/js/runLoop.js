/* --------------------------------- Run Loop --------------------------------- */

function run()
{
	var swapee = false;
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
			
			gVar.aMap[gVar.oActiveTile.x][gVar.oActiveTile.y].saveScript();
			
			gVar.bEvalFait = false;
			if(gVar.bEvalFait == false)
			{
				gVar.aMap[gVar.oActiveTile.x][gVar.oActiveTile.y].evalu();
				gVar.bEvalFait= true;
			}

			var xi = Math.floor((gVar.iMouse_x - gVar.canvas.offsetLeft) / gVar.iMapSize);
			var yj = Math.floor((gVar.iMouse_y - gVar.canvas.offsetTop) / gVar.iMapSize);
			
			if(xi >= 0 && yj >= 0 && xi < gVar.aMap.length && yj < gVar.aMap[0].length)
			{
				gVar.oActiveTile.x = xi;
				gVar.oActiveTile.y = yj;
				gVar.aMap[xi][yj].showScript();
				console.log(gVar.oActiveTile);
			}
		}

	}

	else // le jeu en mode lecture + execution du code de l'éditeur
	{
		if(gVar.iFrame %6 == 0)
		{
			for (var i = 0; i < 16; i++) // les colonnes
			{	
				for (var j = 0; j < 7; j++) // les lignes
				{
					if (!!gVar.aMap[i][j])
					{	
						if(gVar.aMap[i][j].id == "cat" && swapee == false)
						{
							gVar.aMap[i][j].move(i, j);
							swapee = true;

							if(i == 5 && j == 4)
								gVar.rat = true;
							
						}
					}
				}
			}
			
		}
			
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
