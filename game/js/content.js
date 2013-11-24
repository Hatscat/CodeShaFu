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

	if(id == "cat")
	{
		this.life = 50;
		this.attack = 30;
		this.defense = 10;
		this.script = "this.life = 50;\n this.attack = 30;\n this.defense = 10;";
		this.cpt = 0;

		this.move = function(x, y)
		{
			if(this.cpt < 4)
				swap("y", x, y);

			else if(this.cpt > 4 && this.cpt < 10)
				swap("x", x, y);

			else if(this.cpt == 10)
				combat(globalVar.aMap[x][y], globalVar.aMap[x+1][y]);

			else if(this.cpt >= 10 && this.cpt < 21)
				swap("x", x, y);

			if(this.cpt == 20)
				globalVar.aMap[x][y] = new Content("ground", globalVar.aImg_Content[1])

			if(this.cpt < 21)
				this.cpt++;
		}

	}

	else if(id == "enemy")
	{
		this.life = 50;
		this.attack = 40;
		this.defense = 10;
	}

	this.draw = function (x, y)
	{
		if (!!this.img)
		{
			globalVar.context.drawImage(this.img,
				0, 0, this.img.width, this.img.height,
				x, y, this.w, this.h);
		}
		else
		{
			globalVar.context.fillRect(x, y, that.w, that.h);
		}
	}
	this.evalu = function()
	{
		eval(this.script);
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

