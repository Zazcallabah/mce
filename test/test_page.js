var _tools = makePage();
describe('enchantments', function(){

	it('all have unique ids', function(){
		for( var i = 0; i<_enchantments.length; i++ )
			for( var j = i +1; j<_enchantments.length; j++ )
				expect( _enchantments[i].id ).not.toBe( _enchantments[j].id );
	});
});