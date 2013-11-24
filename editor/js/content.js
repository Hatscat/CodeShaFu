/* ******* Content class ******* */

var Content = function (id, img)
{
	this.x = 0;
	this.y = 0;
	this.id = id;
	this.img = img;
	this.w = globalVar.iTileSize;
	this.h = globalVar.iTileSize;
	
	this.bDragged = false;
	this.iOffset_X = 0;
	this.iOffset_Y = 0;

	this.aBox = [this.x, this.y, this.w, this.h];

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

	this.deploy = function ()
	{
		//
	}

	this.showScript = function ()
	{
		//
	}

	this.saveScript = function ()
	{
		//
	}

	this.editScript = function ()
	{
		//
	}
}

