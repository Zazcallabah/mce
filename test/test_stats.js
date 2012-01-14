
describe('enchantments', function(){

	it('all have unique ids', function(){
		for( var i = 0; i<_enchantments.length; i++ )
		for( var j = i +1; j<_enchantments.length; j++ )
			expect( _enchantments[i].id ).not.toBe( _enchantments[j].id );
	});

	it('all have larger max than min enchantment levels', function(){
		for( var t = 0; t < _enchantments.length;t++)
		{
			var e = _enchantments[t];
			expect( e.minlevel ).toBeLessThanOrEqualTo( e.maxlevel );
			for( var i = e.minlevel; i <= e.maxlevel; i++ )
				expect( e.minEnchant(i) ).toBeLessThanOrEqualTo( e.maxEnchant(i) );
		}
	});

	it('none can apply together with self', function(){
		for(var t = 0; t<_enchantments.length;t++)
		{
			var name = _enchantments[t].name;
			expect( _enchantments[t].applies( name ) ).toBeFalsy();
		}
	});

	it('fortune cant apply with silktouch', function()
	{
		var f = getEnchant( "fortune" );
		var st = getEnchant( "silktouch" );

		expect(f.applies(st.name)).toBeFalsy();
		expect(st.applies(f.name)).toBeFalsy();
	});

});

function getEnchant( name )
{
	return where( _enchantments, function(e){return e.name === name})[0];
}