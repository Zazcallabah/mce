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
			showstdev: model.stdev(),
			mode: model.mode(),
			enchantment: model.enchantment(),
			power: model.power()
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
		model.mode( data.mode );
		model.enchantment( data.enchantment );
		model.power( data.power );
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
		showstdev: false,
		mode: "level",
		enchantment:0,
		power:1
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
		{
			var parsed = JSON.parse(storedData);
			if( typeof parsed.material === "string")
			{
				//upgrade
				this.setDefault(model);
				this.saveData(model);
			}
			else mapDataToModel(model,parsed);
		}
	}
	else
	{
		this.setDefault( model);
	}
}

}; };
