/* ******* Tool class ******* */

var Tool = function (id, img)
{
	this.id = id;
	this.img = img;
	this.x = 0;
	this.y = 0;
	this.w = globalVar.iTileSize;
	this.h = globalVar.iTileSize;

	this.aBox = [this.x, this.y, this.w, this.h];

	this.draw = function (x, y)
	{
		if (!!this.img)
		{
			globalVar.context.drawImage(this.img,
				0, 0, this.img.width, this.img.height,
				this.x, y, this.w, this.h);
		}
		else
		{
			globalVar.context.fillStyle = "#000";
			globalVar.context.fillRect(this.x, y, this.w, this.h);
		}
	}

}
