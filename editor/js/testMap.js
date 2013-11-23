/* Test Map */

function createMap()
{
	var map = [];

	for (var i = 0; i < 16; i++)
	{
		map[i] = [];

		for (var j = 0; j < 7; j++) // les lignes
		{
			map[i][j] = null;
			}
		}
	}
	return map;
}
