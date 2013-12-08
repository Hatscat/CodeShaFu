this.state.loop = (!!this.state.loop) ? this.state.loop : 1;

if (this.y < 1)             this.state.loop = 2;
else if (this.y > 5)        this.state.loop = 1;

if (this.state.loop == 1)   this.move2Top();
else                        this.move2Bottom();





this.state.loop = (!!this.state.loop) ? this.state.loop : 1;

if (this.x < 1)             this.state.loop = 2;
else if (this.x > 14)        this.state.loop = 1;

if (this.state.loop == 1)   this.move2Left();
else                        this.move2Right();	





if (iTurn % 3)      this.move2Right()
else                this.move2Top()




var lifeMax = 5;

this.state.life = (!!this.state.life) ? this.state.life : lifeMax;

if (this.state.life < 1)
{
	var r = confirm("Vous êtes mort... Recommencer?")
	if (r) location.reload();
}

