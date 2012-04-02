// Reduce scope travesal
var Mathround = Math.round
var Mathrandom = Math.random
/*
 j = 1 + random.nextInt((j >> 1) + 1) + random.nextInt((j >> 1) + 1);
 int k = j + i;
 float f = ((random.nextFloat() + random.nextFloat()) - 1.0F) * 0.25F;
 int l = (int)((float)k * (1.0F + f) + 0.5F);
 */
function simulateDistr( base, level )
{

	var j = Mathround(base),
	    f = ((Mathrandom()+Mathrandom()) - 1.0) / 4;
	
	return Math.floor((1 + X(j) + X(j) + Mathround(level)) * (1.0 + f) + 0.5);
}

/**/
function X( base )
{
	//var j = Math.floor( base/2) + 1;
	//^ Eh? \/ Bitwise-or with zero makes a floor
	return 0 | ( Mathrandom() * ((base>>1) +1));
}

/**/
function foreachValidEnchantment( materialId, itemId, callback )
{
	for( var i = _enchantments.length; i; i--)
	{
		if( _enchantments[i].canEnchant( materialId, itemId ) )
			for( var v= _enchantments[i].minlevel; v<=_enchantments[i].maxlevel; v++)
				callback( _enchantments[i], v );
	}
}

/**/
function getEnchantments( matId, itemId, level )
{
	var map = {},
		list = [];
	foreachValidEnchantment( matId, itemId, function( ench, enchlevel ) 
	{
		if( ench.minEnchant(enchlevel) <= level && ench.maxEnchant(enchlevel) >= level )
			map[ench.name] = { enchantment: ench, enchantmentLevel: enchlevel };
	});

	for( var name in map )
	{
		list[list.length] = map[name];
	}
	return list;
}

function stripeIncompatibleEnchantments( enchantment, list )
{
	var arr = [];
	for( var i = list.length; i; i--)
	{
		if( list[i].enchantment.applies( enchantment.enchantment.name ) )
			arr[arr.length] = list[i];
	}
	return arr;
}

/* Algorithm source: Minecraft source extracted using Minecraft Coder Pack, source file: EnchantmentHelper.java */
function simulateEnchantments( model, level )
{
	return simulateEnchantmentsInternal(model.item(),model.material(),level,simulateDistr,getEnchantments,selectWeighted,stripeIncompatibleEnchantments);
}

/* Callbacks used for testing. */
function simulateEnchantmentsInternal( itemId, matId, level, getModdedLevelCallback,getEnchantmentsCallback,selectWeightedCallback,stripeIncompatibleEnchantmentsCallback)
{
	var applied_enchantments = [],
		baselevel = getBaseEnchantmentLevel( itemId, matId ),
		moddedLevel = getModdedLevelCallback( baselevel, level ),
		enchantmentlist = getEnchantmentsCallback( matId, itemId, moddedLevel );
	if( enchantmentlist.length === 0 )
		return applied_enchantments;

	var enchantment = selectWeightedCallback( enchantmentlist),
		i = moddedLevel >> 1; //for loop
	applied_enchantments[applied_enchantments.length] = enchantment;

	if( enchantment === undefined )
		write( "ERR" );

	 //(var i = Math.floor(moddedLevel / 2); Math.floor(Math.random() * 50) <= i && enchantmentlist.length > 0; i = Math.floor(i / 2) )
	for(/*var i = moddedLevel >> 1*/       ;          ( Mathrandom()  * 50) <= i && enchantmentlist.length > 0; i >>= 1) )
	{
		enchantmentlist = stripeIncompatibleEnchantmentsCallback( enchantment, enchantmentlist );
		if( enchantmentlist.length > 0 )
		{
			enchantment = selectWeightedCallback( enchantmentlist );
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
	for( var i = validEnchantments.length; i; i--)
	{
		if( validEnchantments[i].enchantment == undefined )
		{
			write (validEnchantments[i]);
		}
		totalweight += validEnchantments[i].enchantment.weight;
	}
	var eeniemeenie = parseInt( Mathrandom() * totalweight );
	for( i = validEnchantments.length; i; i--)
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
var baseenchantlevels =[
		[10, 9,25,15,-1,12,-1], // armor
		[10,14,22,-1, 5,-1,15]]; // non-armor
		
function getBaseEnchantmentLevel( itemId, materialId )
{
	if( itemId < 4 )
		return baseenchantlevels[1][materialId]; // non-armor
	if( itemId === 8 )
		return 1; //bow
	
	return baseenchantlevels[0][materialId]; //armor
}
