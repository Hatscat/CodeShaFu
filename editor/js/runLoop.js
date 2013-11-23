/* --------------------------------- Run Loop --------------------------------- */

function run()
{
	var gVar = globalVar; /* pour optimiser les performances, en stockant ici toutes les valeurs des variables globales */
	var gFunc = globalFunc;

	requestAnimFrame(run);

/* ****************** Scene ****************** */

	drawMapGrid();

	if (gVar.bPause) // en pause == en mode edition
	{
		for (var i = 0, c = globalVar.aTools.length; i < c; i++)
		{
			if (gFunc.isButtonClicked(globalVar.aTools[i].aBox))
			{
				
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
