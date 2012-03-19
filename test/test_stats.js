describe('enchantments', function(){

	var data = {
protection:	 [1,21,17,37,33,53,49,69],
fireprotection: [10,22,18,30,26,38,34,46],
featherfall: [5,15,11,21,17,27,23,33],
blastprotection: [5,17,13,25,21,33,29,41],
projectileprotection:[3,18,9,24,15,30,21,36],
respiration: [10,40,20,50,30,60],
aquaaffinity:[1,41],
sharpness:[1,21,17,37,33,53,49,69,65,85],
smite:[5,25,13,33,21,41,29,49,37,57],
	baneofarthropods:[5,25,13,33,21,41,29,49,37,57],
	knockback:[5,55,25,75],
fireaspect:[10,60,30,80],
looting:[20,70,32,82,44,94],
	power:[1,16,11,26,21,36,31,46,41,56],
	punch:[12,37,32,57],
flame:[20,50],
infinity:[20,50],
	efficiency:[1,51,16,66,31,81,46,96,61,111],
	silktouch:[25,75],
unbreaking:[5,55,15,65,25,75],
fortune:[20,70,32,82,44,94]
	};

	var makeAssertMinMaxLevelsFunction = function( min,max,level,enc )
	{
		return function()
		{
			expect(_enchantments[enc].minEnchant(level)).toBe( min );
			expect(_enchantments[enc].maxEnchant(level)).toBe( max );
		};
	}

	describe('have min max enchantment levels',function(){

	for( var i = 0; i<_enchantments.length; i++ )
	{
		for( var l = _enchantments[i].minlevel; l <= _enchantments[i].maxlevel; l++ )
		{
			var basepoint = (l-1)*2;
			var min = data[_enchantments[i].name][basepoint];
			var max = data[_enchantments[i].name][basepoint+1];
			it(_enchantments[i].name+' for level ' + l, makeAssertMinMaxLevelsFunction(min,max,l,i ));
		}
	}
	});

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

	var tools = makeTools();
	function getEnchant( name )
	{
		return tools.where( _enchantments, function(e){return e.name === name})[0];
	}
	it('fortune cant apply with silktouch', function()
	{
		var f = getEnchant( "fortune" );
		var st = getEnchant( "silktouch" );

		expect(f.applies(st.name)).toBeFalsy();
		expect(st.applies(f.name)).toBeFalsy();
	});

});

