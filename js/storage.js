var makeStorage = function() {
	var dataLabel = "mce_data_932";

	var mapModelToData = function(model)
	{
		return {
			material: model.material(),
			item: model.item(),
			level: model.level(),
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
setDefault: function( model )
{
	mapDataToModel(model, {
		material:0,
		item: 0,
		level: 30,
		iterations: 200,
		simulations: 25,
		showstdev: false
	});
},

saveData: function( model )
{
	if( typeof(localStorage) !== undefined )
	{
		var data = mapModelToData(model);
		var jsonData = JSON.stringify( data );
		localStorage.setItem( dataLabel, jsonData )
	}
},

getData: function( model )
{
	if( typeof(localStorage) !== undefined )
	{
		var storedData = localStorage.getItem( dataLabel );
		if( storedData === null || storedData === undefined )
		{
			this.setDefault( model );
			this.saveData( model );
		}
		else
			mapDataToModel(model,JSON.parse(storedData));
	}
	else
	{
		this.setDefault( model);
	}
}

}; };
