/* Test Map */

function createMap()
{
	var map = [];

	for (var i = 0; i < 16; i++)
	{
		map[i] = [];

		for (var j = 0; j < 7; j++) // les lignes
		{
			var randoom = Math.floor(Math.random() * 5); 

			switch (randoom)
			{
				case 0:
					map[i][j] = null;
				break;
				case 1:
					map[i][j] = "cat";
				break;
				case 2:
					map[i][j] = "path";
				break;
				case 3:
					map[i][j] = "enemy";
				break;
				case 4:
					map[i][j] = "end";
				break;

			}
		}
	}
	return map;
}
