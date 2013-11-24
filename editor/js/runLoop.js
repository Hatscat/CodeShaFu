/* --------------------------------- Run Loop --------------------------------- */

function run()
{
	var gVar = globalVar; /* pour optimiser les performances, en stockant ici toutes les valeurs des variables globales */
	var gFunc = globalFunc;

	requestAnimFrame(run);

	gVar.context.fillStyle = "#000";
	gVar.context.fillRect(0, 0, gVar.iCanvas_w, gVar.iCanvas_y);

/* ****************** Scene ****************** */

	drawMap(gVar.aMap);

	if (gVar.bPause) // en pause == en mode edition
	{
		drawMapGrid();

		if (globalVar.sMode == "editor")
		{
			gVar.oToolsBox.display();
		}
		//var mouseBox = [gVar.iMouse_x - gVar.canvas.offsetLeft, gVar.iMouse_y - gVar.canvas.offsetTop, 10, 10];
		//gFunc.drawStrokeBox(mouseBox, "#fff", 6);

		if (gVar.bMouseDown)
		{
			var xi = Math.floor((gVar.iMouse_x - gVar.canvas.offsetLeft) / gVar.iTileSize);
			var yj = Math.floor((gVar.iMouse_y - gVar.canvas.offsetTop) / gVar.iTileSize);
			
			if (xi >= 0 && yj >= 0 && xi < gVar.aMap.length && yj < gVar.aMap[0].length)
			{
				if (gVar.bElementDrag)
				{
					switch(gVar.sElementDragId)
					{
						case "empty":
							gVar.aMap[xi][yj] = new Content("empty", null, "");
						break;
						case "cat":
							gVar.aMap[xi][yj] = new Content("cat", gVar.aImg_Content[0], "");
						break;
						case "path":
							gVar.aMap[xi][yj] = new Content("path", gVar.aImg_Content[1], "");
						break;
						case "enemy":
							gVar.aMap[xi][yj] = new Content("enemy", gVar.aImg_Content[2], "");
						break;
						case "end":
							gVar.aMap[xi][yj] = new Content("end", gVar.aImg_Content[3], "");
						break;
					}
					gVar.bElementDrag = false;
				}
			}
			else
			{
				for (var i = 0, c = gVar.oToolsBox.aContent.length; i < c; i++)
				{
					if (gFunc.isButtonClicked(gVar.oToolsBox.aContent[i].aBox))
					{
						gVar.bElementDrag = true;
						gVar.sElementDragId = gVar.oToolsBox.aContent[i].id;
						gVar.oToolsBox.aContent[i].bDragged = false;
					}
				}
			}
		}
		else
		{
			if (gVar.bElementDrag)
			{
				for (var i = 0, c = gVar.oToolsBox.aContent.length; i < c; i++)
				{
					if (gVar.oToolsBox.aContent[i].id == gVar.sElementDragId)
					{	
						if (!gVar.oToolsBox.aContent[i].bDragged)
						{
							gVar.oToolsBox.aContent[i].bDragged = true;
							gVar.oToolsBox.aContent[i].iOffset_X = 
							gVar.iMouse_x - gVar.canvas.offsetLeft - gVar.oToolsBox.aContent[i].x;
							gVar.oToolsBox.aContent[i].iOffset_Y = 
							gVar.iMouse_y - gVar.canvas.offsetTop - gVar.oToolsBox.aContent[i].y;
						}
						
						var local_x = gVar.iMouse_x - gVar.canvas.offsetLeft - gVar.oToolsBox.aContent[i].iOffset_X;
						var local_y = gVar.iMouse_y - gVar.canvas.offsetTop - gVar.oToolsBox.aContent[i].iOffset_Y;

						gVar.oToolsBox.aContent[i].drawCopy(local_x, local_y);
					}
				}
			}
		}
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
