
/*
 j = 1 + random.nextInt((j >> 1) + 1) + random.nextInt((j >> 1) + 1);
 int k = j + i;
 float f = ((random.nextFloat() + random.nextFloat()) - 1.0F) * 0.25F;
 int l = (int)((float)k * (1.0F + f) + 0.5F);
 */
function simulateDistr( base, level )
{

	var j = Math.round(base);
	var i = Math.round(level);

	var j2 = 1 + X(j) + X(j);

	var k = j2 + i;
	var f = ((N() + N()) - 1.0) * 0.25;
	return Math.floor(k * (1.0 + f) + 0.5);
}

/**/
function X( base )
{
	var j = Math.floor( base/2) + 1;
	return Math.floor( Math.random() * (base/2 +1));
}

/**/
function N()
{
	return Math.random();
}

/**/
function foreachValidEnchantment( materialId, itemId, callback )
{
	for( var i =0;i<_enchantments.length;i++)
	{
		if( _enchantments[i].canEnchant( materialId, itemId ) )
			for( var v= _enchantments[i].minlevel; v<=_enchantments[i].maxlevel; v++)
				callback( _enchantments[i], v );
	}
}

/**/
function getEnchantments( matId, itemId, level )
{
	var map = {};
	foreachValidEnchantment( matId, itemId, function( ench, enchlevel ) 
	{
		if( ench.minEnchant(enchlevel) <= level && ench.maxEnchant(enchlevel) >= level )
			map[ench.name] = { enchantment: ench, enchantmentLevel: enchlevel };
	});

	var list = [];
	for( var name in map )
	{
		list[list.length] = map[name];
	}
	return list;
}

function stripeIncompatibleEnchantments( enchantment, list )
{
	var arr = [];
	for( var i =0;i<list.length;i++)
	{
		if( list[i].enchantment.applies( enchantment.enchantment.name ) )
			arr[arr.length] = list[i];
	}
	return arr;
}

/**/
function simulateEnchantments( itemId, matId, level )
{
	var applied_enchantments = [];

	var baselevel = getBaseEnchantmentLevel( itemId, matId );
	var moddedLevel = parseInt(simulateDistr( baselevel, level ),10);
	var enchantmentlist = getEnchantments( matId, itemId, moddedLevel );
	if( enchantmentlist.length === 0 )
		return applied_enchantments;

	var enchantment = selectWeighted( enchantmentlist);
	applied_enchantments[applied_enchantments.length] = enchantment;

	if( enchantment === undefined )
		write( "ERR" );

	for(var i = moddedLevel / 2; parseInt(Math.random() * 50) <= i && enchantmentlist.length > 0; i /= 2)
	{
		enchantmentlist = stripeIncompatibleEnchantments( enchantment, enchantmentlist );
		if( enchantmentlist.length > 0 )
		{
			enchantment = selectWeighted( enchantmentlist );
			if( enchantment === undefined )
				write( "ERR" );
			applied_enchantments[applied_enchantments.length] = enchantment;
		}
	}
	
	return applied_enchantments;
}

/**/
function selectWeighted( validEnchantments )
{
	var totalweight = 0;
	for( var i = 0; i<validEnchantments.length; i++)
	{
		if( validEnchantments[i].enchantment == undefined )
		{
			write (validEnchantments[i]);
		}
		totalweight += validEnchantments[i].enchantment.weight;
	}
	var eeniemeenie = parseInt( Math.random() * totalweight );
	for( i = 0; i<validEnchantments.length; i++)
	{
		eeniemeenie -= validEnchantments[i].enchantment.weight;
		if( eeniemeenie < 0 )
		{
			return validEnchantments[i];
		}
	}
	return validEnchantments[validEnchantments.length-1];
}

/**/
function getBaseEnchantmentLevel( itemId, materialId )
{
	var type = 0; //armor

	if( itemId < 4 )
		type = 1; // non-armor
	if( itemId === 8 )
		type = 2; //bow

	var levels =[
		[10, 9,25,15,-1,12,-1],
		[10,14,22,-1, 5,-1,15],
		[ 1, 1, 1, 1, 1, 1, 1]];

	return levels[type][materialId];
}
