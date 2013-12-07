/* ******* Content class ******* */

var Content = function (id, img, script, xI, yI)
{
	var that = this;

	this.id = id;
	this.xI = xI;
	this.yI = yI;
	this.img = img;
	this.w = globalVar.iMapSize;
	this.h = globalVar.iMapSize;
	this.script = "";

	this.aBox = [this.x, this.y, this.w, this.h];
	this.script = script;

	if(id == "cat")
	{
		this.life = 50;
		this.attack = 30;
		this.defense = 10;
		this.cpt = 0;
		this.targetX = 0;
		this.targetY = 0;

		this.move = function(x, y)
		{
			//debugger;
			this.xI = x;
			this.yI = y;
			var detect = collision(globalVar.aMap[x][y])

			if(detect == false)
			{

				if(this.targetX > 15)
					this.targetX = 15;

				if(this.targetY > 6)
					this.targetY = 6;

				if(x != this.targetX)
				{
					if(x > this.targetX)
						swap("-x", x, y)

					else
						swap("x", x, y)
				}

				if(y != this.targetY)
				{
					if(y > this.targetY)
						swap("-y", x, y)

					else
						swap("y", x, y)
				}
			}

			else if(detect.id == "enemy")
				combat(globalVar.aMap[x][y], detect);

			else if(detect.id == "empty")
				globalVar.aMap[x][y] = new Content("ground", globalVar.aImg_Content[1], "//Rien à modifier", x, y)


			else if(detect.id == "end" && globalVar.bMonstreMort == true)
			{
				alert("WIN");
				globalVar.bPause = true;	
			}

			else if(detect.id == "end" && globalVar.bMonstreMort == false)
			{
				alert("TUE LE MONSTRE");
				globalVar.bPause = true;
			}
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

