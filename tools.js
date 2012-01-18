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
	ensureVar( vars, result.enchantment.id, {} );
	ensureVar( vars[result.enchantment.id], result.enchantmentLevel, {sum:0,sqsum:0,x:0,n:0} );
}

}; };
