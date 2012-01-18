describe('iterator', function(){
	var action = undefined;
	var callback = undefined;
	var iterator = makeIterator(
		function( data ) { if( action !== undefined ) return action( data ); },
		function( result ) { if( callback !== undefined ) callback( result ); }
	);

	it('runs times times', function(){
		var count = 0;
		action = function(){ count++; };

		iterator.run( 5 );

		expect( count ).toBe( 5 );
	});

	it('calls action with parameter data', function(){
		var obj = { aoeu: "aoeu" };
		action = function( o ) { expect( o.aoeu ).toBe( "aoeu" ); };
		iterator.run( 1, obj );
	});

	it('calls callback with result from action', function(){
		action = function() { return { lol: "test2" }; };
		callback = function( o ) { expect( o.lol ).toBe( "test2" ); };

		iterator.run( 1 );
	});
});