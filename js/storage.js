var makeStorage = function() { return {

	var dataLabel = "mce_data_932"
getDefault: function()
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
},

saveData: function( data )
{
	var jsonData = JSON.stringify( data );
	if( typeof(localStorage) !== undefined )
	{
		localStorage.setItem( dataLabel, jsonData )
	}
},

getData: function()
{
	if( typeof(localStorage) !== undefined )
	{
		var storedData = localStorage.getItem( dataLabel );
		if( storedData === null || storedData === undefined )
		{
			storedData = this.getDefault();
			this.saveData( storedData );
			return storedData;
		}
		else
			return JSON.parse( storedData );
	}
	else
		return this.getDefault();
}

}; };
