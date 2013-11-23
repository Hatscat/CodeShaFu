/* --- map model --- */


/* json model */

{
	"aMap": [
		"column_0": [
			"cat",
			"path",
			"path",
			"enemy",
			null,
			null,
			"path"
		],
		/* [...] */
		"column_15": [
			null,
			"enemy",
			"path",
			"enemy",
			"path",
			null,
			"end"
		]
	]
}


/* javascript pour le lire */

var aMap = [];
var iMapSize = 64;

for (var i = 0; i < 16; i++) // les colonnes
{	
	aMap[i] = [];
	for (var j = 0; j < 7; j++) // les lignes
	{
		switch(aMap[i][j])
		{
			case "cat":
				oCat.x = i * iMapSize;
				oCat.y = j * iMapSize;
			break;
			case "path":
				aPathTiles.push(new PathTile(i * iMapSize, j * iMapSize));
			break;
			case "enemy":
				aEnemies.push(new Enemy(i * iMapSize, j * iMapSize));
			break;
			case "end":
				oEnd.x = i * iMapSize;
				oEnd.y = j * iMapSize;
			break;
		}
	}
}
