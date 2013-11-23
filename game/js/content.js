/* ******* Content class ******* */

var Content = function (id, img)
{
	var that = this;

	this.id = id;
	this.img = img;
	this.w = globalVar.iMapSize;
	this.h = globalVar.iMapSize;
	this.script = "";

	this.aBox = [this.x, this.y, this.w, this.h];

	this.draw = function (x, y)
	{
		if (!!that.img)
		{
			globalVar.context.drawImage(that.img,
				0, 0, that.img.width, that.img.height,
				x, y, that.w, that.h);
		}
		else
		{
			globalVar.context.fillRect(x, y, that.w, that.h);
		}
	}

	this.deploy = function()
	{
		console.log('deploy')
	}

	this.showScript = function()
	{
		globalVar.editor.setValue(this.script);
	}

	this.saveScript = function()
	{
		this.script = globalVar.editor.getValue();
		console.log(this.script);
	}

	this.runScript = function()
	{
		console.log('run')
	}
}

