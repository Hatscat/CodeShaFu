/* --------------------------------- Run Loop --------------------------------- */

function run()
{
	var gVar = globalVar; /* pour optimiser les performances, en stockant ici toutes les valeurs des variables globales */
	var gFunc = globalFunc;


/* ****************** Scene ****************** */

	gVar.context.drawImage( gVar.aImg_Bg[0], 0, 0, gVar.iCanvas_w, gVar.iCanvas_h);

/* ****************** Content ****************** */


/* ****************** frame incrementation ****************** */
		if (++gVar.iFrame > 9999)
		{
			gVar.iFrame = 0;
			gVar.context.clearRect(0, 0, gVar.iCanvas_w, gVar.iCanvas_y);
		}
		
		gVar.iFrame++;
		globalVar = gVar;
		globalFunc = gFunc;
		cat.draw();
		orque.draw();

		if(collision(cat, orque))
			combat(cat, orque)
		else
		{
			console.log(gVar.iFrame % 6 == 0)
			if(gVar.iFrame % 6 == 0)
			{
				cat.move();
				console.log("blabla");	
			}
		}

		requestAnimFrame(run);	

}
