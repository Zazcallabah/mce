
function simulateDistr( base, level )
{
	return (1 + X(base) + X(base)+level) * (1 + ((N() + N() - 1) *0.25))+.5;
}

function getValidEnchantmentsForItemLevel( materialId, itemId, minlevel, maxlevel, cdf )
{
	var list = new Array();
	var listcount = 0;
	foreachValidEnchantment( materialId, itemId, function( ench, level ) {
		var enchMin = ench.minEnchant(level);
		var enchMax = ench.maxEnchant(level);

		if( enchMin < maxlevel && enchMax > minlevel )
		{
			var from = Math.max( enchMin, minlevel );
			var upperbound = ( level == ench.maxlevel ) ? enchMax : Math.min( enchMax, ench.minEnchant(level+1) );
			var to = Math.min( upperbound, maxlevel );
			var prob = cdf(to) - cdf(from);
			if( prob > 0.001 )
				list[listcount++] = { enchantment: ench, strength: level, prob: prob};
		}
	} );

	return list;
}

function foreachValidEnchantment( materialId, itemId, callback )
{
	for( var i =0;i<_enchantments.length;i++)
	{
		if( _enchantments[i].canEnchant( materialId, itemId ) )
			for( var v= _enchantments[i].minlevel; v<=_enchantments[i].maxlevel; v++)
				callback( _enchantments[i], v );
	}
}

function getEnchantmentsForModdedLevel( matId, itemId, level )
{
	var arr = new Object;
	foreachValidEnchantment( matId, itemId, function( ench, enchlevel ) 
	{
		if( ench.minEnchant(enchlevel) <= level && ench.maxEnchant(enchlevel) >= level )
			arr[ench.name] = { enchantment: ench, enchantmentLevel: enchlevel };
	});
	
	var ret = new Array;
	var count = 0;
	for( var key in arr )
	{
		ret[count++] = arr[key];
	}
	return ret;
}

function simulateEnchantment( itemId, matId, level )
{
	var baselevel = getBaseEnchantmentLevel( itemId, matId );
	var moddedLevel = parseInt(simulateDistr( baselevel, level ));
	var enchantmentlist = getEnchantmentsForModdedLevel( matId, itemId, moddedLevel );
	var enchantment = selectWeighted( enchantmentlist);
	var enchantmentcount = 1;
	for(var i = moddedLevel / 2; parseInt(Math.random() * 50) <= i; i /= 2)
	{
		enchantmentcount++;
	}
	
	enchantment["count"] = enchantmentcount;
	return enchantment;
}

function selectWeighted( validEnchantments )
{
	var totalweight = 0;
	for( var i = 0; i<validEnchantments.length; i++)
	{
		totalweight += validEnchantments[i].enchantment.weight;
	}
	var eeniemeenie = parseInt( Math.random() * totalweight );
	for( var i = 0; i<validEnchantments.length; i++)
	{
		eeniemeenie -= validEnchantments[i].enchantment.weight;
		if( eeniemeenie < 0 )
		{
			return validEnchantments[i];
		}
	}
	return validEnchantments[validEnchantments.length-1];
}

function getBaseEnchantmentLevel( itemId, materialId )
{
	var isArmor = itemId >= 4 ? 0 : 1;
	var levels =[[10,9,25,15,-1,12,-1],[10,14,22,-1,5,-1,15]];

	return levels[isArmor][materialId];
}
