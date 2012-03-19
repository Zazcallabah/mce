var makeTools = function () { return {

foreach: function( list, callback )
{
	for( var item in list )
	{
		if( list.hasOwnProperty( item ) )
			callback( list[item], item );
	}
},

where: function( list, callback )
{
	var items = [];
	this.foreach( list, function(item) {
		if( callback( item ) )
			items[items.length] = item;
	});
	return items;
},

wrapPercent: function( p, s )
{
	return "(" + Math.floor( p * 100 ) + "+-" + Math.floor( s * 1000 ) / 10 + "%)";
},

/*
 * Using the ol' V = Σ(x^2) - ((ΣX)^2 /n) / (n-1)
 */
updateSum: function( arr )
{
	this.foreach( arr, function (stats){
		stats.sum += stats.x;
		stats.sqsum += stats.x * stats.x;
		stats.n++;
		stats.mean = stats.sum / stats.n;
		stats.variance = ( stats.sqsum - (stats.sum * stats.sum / stats.n)) / ( stats.n - 1 );
		stats.x = 0;
	} );
},

validInt: function( i )
{
	return i < 0 ? false : !isNaN(i);
},

ensureVar: function( target, variable, value )
{
	if( !target.hasOwnProperty( variable ) )
		target[variable] = value;
},

ensureStatsVars: function( vars, result )
{
	this.ensureVar( vars, result.enchantment.id, {} );
	this.ensureVar( vars[result.enchantment.id], result.enchantmentLevel, {sum:0,sqsum:0,x:0,n:0} );
}

}; };

var makeIterator = function( action, callback ) { return {

	run: function( times, model ){
		for( var i = 0; i< times; i++ )
		{
			var result = action( model );
			callback( result );
		}
	}
};

};

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
		},
		find: function( label )
		{
			if( stats.hasOwnProperty(label))
				return stats[label];
			else return {x:0};
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

		find: function(position,label)
		{
			if(collections.hasOwnProperty( position ) )
				return collections[position].find(label);
			else return {x:0};
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
