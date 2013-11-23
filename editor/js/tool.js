/* ******* Tool class ******* */

var Tool = function (img)
{
	this.img = img;
	this.w = globalVar.iMapSize;
	this.h = globalVar.iMapSize;

	this.aBox = [this.x, this.y, this.w, this.h];

	this.draw = function (x, y)
	{
		globalVar.context.drawImage(this.img, 0, 0, this.img.width, this.img.height,
			x, y, this.w, this.h);
	}
}

