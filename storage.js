function saveDataToStorage( data )
{
	var jsonData = JSON.stringify( data );

	if (typeof(localStorage) !== undefined )
	{
		localStorage.setItem("data", jsonData)
	}
}

function getDataFromStorage()
{
	if (typeof(localStorage) !== undefined )
	{
		var storedData = localStorage.getItem( "data" );
		if( storedData === null || storedData === undefined )
		{
			storedData = getDefaultValues();
			saveDataToStorage(storedData);
			return storedData;
		}
		else return JSON.parse( storedData );
	}
	else
		return getDefaultValues();
}

function getDefaultValues()
{
	return {
		material: "diamond",
		item: "pickaxe",
		level: 30,
		materialId: 0,
		itemId: 0,
		iterations: 200,
		simulations: 25,
		showstdev: true
	};
}
