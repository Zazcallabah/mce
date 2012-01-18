var makeIterator = function( action, callback ) { return {

	run: function( times, data ){
		for( var i = 0; i< times; i++ )
		{
			var result = action( data );
			callback( result );
		}
	}
};

};
