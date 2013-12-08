/* ******* Content class ******* */

var Content = function (id, img, script) /* la classe de tout ! */
{
	this.x = 0;
	this.y = 0;
	this.x_px = 0;
	this.y_px = 0;
	this.id = id;
	this.script = script;
	this.img = img;
	this.w = globalVar.iTileSize;
	this.h = globalVar.iTileSize;
	this.state = {};
	
	/* pour les "models" de la toolsbox */
	this.bDragged = false;
	this.iOffset_X = 0;
	this.iOffset_Y = 0;

	this.aBox = [this.x_px, this.y_px, this.w, this.h];

	this.draw = function ()
	{
		if (!!this.img)
		{
			globalVar.context.drawImage(this.img,
				0, 0, this.img.width, this.img.height,
				this.x_px, this.y_px, this.w, this.h);
		}
		else
		{
			globalVar.context.fillStyle = "#000";
			globalVar.context.fillRect(this.x_px, this.y_px, this.w, this.h);
		}

		this.aBox[0] = this.x_px;
		this.aBox[1] = this.y_px;
	}

	this.drawCopy = function (x, y)
	{
		if (!!this.img)
		{
			globalVar.context.drawImage(this.img,
				0, 0, this.img.width, this.img.height,
				x, y, this.w, this.h);
		}
		else
		{
			globalVar.context.fillStyle = "#000";
			globalVar.context.fillRect(x, y, this.w, this.h);
		}

		this.aBox[0] = this.x_px;
		this.aBox[1] = this.y_px;
	}



	this.showScript = function ()
	{
		globalVar.editor.setValue(this.script);
	}

	this.saveScript = function ()
	{
		this.script = globalVar.editor.getValue();
		//console.log(this.script);
	}

	this.runScript = function ()
	{
		eval(this.script);
	}


	this.move2Left = function (n)
	{
		swap("-x", this.x, this.y);
	}
	this.move2Right = function ()
	{
		swap("x", this.x, this.y);
	}
	this.move2Top = function ()
	{
		swap("-y", this.x, this.y);
	}
	this.move2Bottom = function (n)
	{
		swap("y", this.x, this.y);
	}

	// this.reset = function ()
	// {
	// 	this.oTarget = null;
	// }
}

