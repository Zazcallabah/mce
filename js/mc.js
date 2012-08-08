var makeMC = function(version)
{
	/**/
	var N = function N()
	{
		return Math.random();
	};

	/**/
	var X = function X( base )
	{
		return Math.floor( Math.random() * ( base/2 + 1 ) );
	};

	/*
	 j = 1 + random.nextInt((j >> 1) + 1) + random.nextInt((j >> 1) + 1);
	 int k = j + i;
	 float f = ((random.nextFloat() + random.nextFloat()) - 1.0F) * 0.25F;
	 int l = (int)((float)k * (1.0F + f) + 0.5F);
	 */
	var simulateDistr = function simulateDistr( base, level )
	{

		var j = Math.round(base);
		var i = Math.round(level);

		var j2 = 1 + X(j) + X(j);

		var k = j2 + i;
		var f = ((N() + N()) - 1.0) * 0.25;
		return Math.floor(k * (1.0 + f) + 0.5);
	};

	/*
	 Item item = par1ItemStack.getItem();
	 int i = item.getItemEnchantability();

	 if (i <= 0)
	 {
	 return null;
	 }

	 j /= 2;
	 j2 = 1 + par0Random.nextInt((j >> 1) + 1) + par0Random.nextInt((j >> 1) + 1);
	 int k = j2 + i;
	 float f = ((par0Random.nextFloat() + par0Random.nextFloat()) - 1.0F) * 0.15F;
	 int rrr = (int)((float)k* (1.0F + f) + 0.5F);

	 if (rrr < 1)
	 {
	 rrr = 1;
	 }*/
	var simulateDistr13 = function( base, level )
	{

		var j = Math.round(base) / 2;
		var i = Math.round(level);

		var j2 = 1 + X(j) + X(j);

		var k = j2 + i;
		var f = ((N() + N()) - 1.0) * 0.15;
		return Math.floor(k * (1.0 + f) + 0.5);
	};

	/**/
	var foreachValidEnchantment = function( materialId, itemId, callback ) {
		for( var i =0;i<_enchantments.length;i++)
		{
			if( _enchantments[i].canEnchant( materialId, itemId ) )
				for( var v= _enchantments[i].minlevel; v<=_enchantments[i].maxlevel; v++)
					callback( _enchantments[i], v );
		}
	};

	/**/
	var getEnchantments = function getEnchantments( matId, itemId, level )
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
	};

	var stripeIncompatibleEnchantments = function stripeIncompatibleEnchantments( enchantment, list )
	{
		var arr = [];
		for( var i =0;i<list.length;i++)
		{
			if( list[i].enchantment.applies( enchantment.enchantment.name ) )
				arr[arr.length] = list[i];
		}
		return arr;
	};

	/* Callbacks used for testing. */
	var simulateEnchantmentsInternal = function simulateEnchantmentsInternal( itemId, matId, level, getModdedLevelCallback,getEnchantmentsCallback,selectWeightedCallback,stripeIncompatibleEnchantmentsCallback,selectMultipleEnchantmentBase)
	{
		var applied_enchantments = [];

		var baselevel = getBaseEnchantmentLevel( itemId, matId );
		var moddedLevel = getModdedLevelCallback( baselevel, level );
		var enchantmentlist = getEnchantmentsCallback( matId, itemId, moddedLevel );
		if( enchantmentlist.length === 0 )
			return applied_enchantments;

		var enchantment = selectWeightedCallback( enchantmentlist);
		applied_enchantments[applied_enchantments.length] = enchantment;
		for(var i = selectMultipleEnchantmentBase(moddedLevel); Math.floor(Math.random() * 50) <= i && enchantmentlist.length > 0; i = Math.floor(i / 2) )
		{
			enchantmentlist = stripeIncompatibleEnchantmentsCallback( enchantment, enchantmentlist );
			if( enchantmentlist.length > 0 )
			{
				enchantment = selectWeightedCallback( enchantmentlist );
				applied_enchantments[applied_enchantments.length] = enchantment;
			}
		}

		return applied_enchantments;
	};


	/**/
	var selectWeighted = function selectWeighted( validEnchantments )
	{
		var totalweight = 0;
		for( var i = 0; i<validEnchantments.length; i++)
		{
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
	};

	/**/
	var getBaseEnchantmentLevel = function getBaseEnchantmentLevel( itemId, materialId )
	{
		var type = 0; //armor

		if( itemId < 4 )
			type = 1; // non-armor
		if( itemId === 8 )
			type = 2; //bow

		var levels =[
			[10, 9,25,15,-1,12,-1], // armor
			[10,14,22,-1, 5,-1,15], // non-armor
			[ 1, 1, 1, 1, 1, 1, 1]];// bow

		return levels[type][materialId];
	};
	if( version === "test" )
	{
		// only used in testing
		return {
			stripeIncompatibleEnchantments:stripeIncompatibleEnchantments,
			getEnchantments:getEnchantments
		};
	}

	if(  version === "1.2" )
	{
		/* Algorithm source: Minecraft source extracted using Minecraft Coder Pack, source file: EnchantmentHelper.java */
		var simulateEnchantments = function simulateEnchantments( model, level )
		{
			return simulateEnchantmentsInternal(
				model.item(),
				model.material(),
				level,
				simulateDistr,
				getEnchantments,
				selectWeighted,
				stripeIncompatibleEnchantments,
				function(m){ return Math.floor(m / 2); }
			);
		};

		return {
			simulateEnchantments: simulateEnchantments,
			getBaseEnchantmentLevel: getBaseEnchantmentLevel
		};
	}
	else if( version === "1.3.1" )
	{
		var sim = function simulateEnchantments( model, level )
		{
			return simulateEnchantmentsInternal(
				model.item(),
				model.material(),
				level,
				simulateDistr13,
				getEnchantments,
				selectWeighted,
				stripeIncompatibleEnchantments,
				function(m){ return m; }
			);
		};
		return {
			simulateEnchantments: sim,
			getBaseEnchantmentLevel: getBaseEnchantmentLevel
		};
	}
};
