var makeCollection = function( tools ) {
	var stats = {};

	return {

		report: function( label )
		{
			this.addToStats( label, 1 );
		},

		addToStats: function( label, value )
		{
			if( !stats.hasOwnProperty( label ) )
				stats[label] = { sum:0, sqsum:0, x:0, n:0 };
			stats[label].x += value;
		},

		updateSum: function()
		{
			tools.updateSum(stats);
		},

		foreach: function( callback )
		{
			tools.foreach( stats, callback );
		}
	};
};

var makeGroupedCollection = function( tools ) {
	var collections = [];
	return {
		report: function( position, label )
		{
			if( !collections.hasOwnProperty( position ) )
				collections[position] = makeCollection( tools );
			collections[position].report( label );
		},

		updateSum: function()
		{
			tools.foreach( collections, function (item){ item.updateSum(); } );
		},

		foreach: function( controller )
		{
			tools.foreach(
				collections,
				function( collection, position )
				{
					controller.before( position );
					collection.foreach( controller.callback );
					controller.after();
				} );

		}
	};
};
