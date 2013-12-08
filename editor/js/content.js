/* ******* Content class ******* */

var Content = function (id, XY_imgSource, script) /* la classe de tout ! */
{
	this.x = 0;
	this.y = 0;
	this.x_px = 0;
	this.y_px = 0;
	this.id = id;
	this.script = script;
	this.imgSource_sx = XY_imgSource.sx;
	this.imgSource_sy = XY_imgSource.sy;
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

		globalVar.context.drawImage(globalVar.imgTileset,
			this.imgSource_sx, this.imgSource_sy, globalVar.iTileSize, globalVar.iTileSize,
			this.x_px, this.y_px, this.w, this.h);


		this.aBox[0] = this.x_px;
		this.aBox[1] = this.y_px;
	}

	this.drawCopy = function (x, y)
	{

		globalVar.context.drawImage(globalVar.imgTileset,
			this.imgSource_sx, this.imgSource_sy, globalVar.iTileSize, globalVar.iTileSize,
			x, y, this.w, this.h);

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

