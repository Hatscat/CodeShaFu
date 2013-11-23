/* --------------------------------- Run Loop --------------------------------- */

function run()
{
	var gVar = globalVar; /* pour optimiser les performances, en stockant ici toutes les valeurs des variables globales */
	var gFunc = globalFunc;

	requestAnimFrame(run);

/* ****************** Scene ****************** */

	gVar.context.drawImage( gVar.aImg_Bg[0], 0, 0, gVar.iCanvas_w, gVar.iCanvas_h);


	if (gVar.bPause) // en pause == en mode edition
	{
			
	}
	else // le jeu en mode lecture + execution
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
