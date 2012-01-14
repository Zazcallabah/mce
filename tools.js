function foreach( list, callback )
{
	for( var item in list )
	{
		if( list.hasOwnProperty( item ) )
			callback( list[item] );
	}
}

function where( list, callback )
{
	var items = [];
	foreach( list, function(item){
		if( callback( item ) )
			items[items.length] = item;
});
	return items;
}