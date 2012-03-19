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
