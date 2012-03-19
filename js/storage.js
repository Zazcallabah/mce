var makeStorage = function(tools) {
	var dataLabel = "mce_data_932";

	var mapModelToData = function(model)
	{
		return {
			material: model.material(),
			item: model.item(),
			level: model.level(),
			materialId: model.getMaterialId(model.material()),
			itemId: model.getItemId(model.item()),
			iterations: model.iterations(),
			simulations: model.simulations(),
			showstdev: model.stdev()
		};
	};

	var mapDataToModel = function(model,data)
	{
		model.material(data.material);
		model.item(data.item);
		model.level(data.level);
		model.iterations(data.iterations);
		model.simulations(data.simulations);
		model.stdev( data.showstdev );
	};

	return {
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
		showstdev: false
	};
},

saveData: function( model )
{
	var data = mapModelToData(model);
	var jsonData = JSON.stringify( data );
	if( typeof(localStorage) !== undefined )
	{
		localStorage.setItem( dataLabel, jsonData )
	}
},

getData: function( model )
{
	var data = this.getDefault();
	if( typeof(localStorage) !== undefined )
	{
		var storedData = localStorage.getItem( dataLabel );
		if( storedData === null || storedData === undefined )
		{
			this.saveData( data );
		}
		else
			data = storedData;
	}
	mapDataToModel(model,data);
}

}; };
