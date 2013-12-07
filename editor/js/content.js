/* ******* Content class ******* */

var Content = function (id, img, script) /* la classe de tout ! */
{
	this.x = 0;
	this.y = 0;
	this.id = id;
	this.script = script;
	this.img = img;
	this.w = globalVar.iTileSize;
	this.h = globalVar.iTileSize;
	
	/* pour les "models" de la toolsbox */
	this.bDragged = false;
	this.iOffset_X = 0;
	this.iOffset_Y = 0;

	this.aBox = [this.x, this.y, this.w, this.h];

	this.move = function (x, y)
	{
		//
	}

	this.draw = function ()
	{
		if (!!this.img)
		{
			globalVar.context.drawImage(this.img,
				0, 0, this.img.width, this.img.height,
				this.x, this.y, this.w, this.h);
		}
		else
		{
			globalVar.context.fillStyle = "#000";
			globalVar.context.fillRect(this.x, this.y, this.w, this.h);
		}

		this.aBox[0] = this.x;
		this.aBox[1] = this.y;
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

		this.aBox[0] = this.x;
		this.aBox[1] = this.y;
	}

	// this.deploy = function()
	// {
	// 	console.log('deploy');
	// }

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
		console.log('run');
		eval(this.script);
	}
}

