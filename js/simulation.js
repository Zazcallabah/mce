var makeSim = function(page,tools,model){
	return function()
	{
		page.clear();
		page.validateFields();
		_storage.saveData(model);

		var statsSimulateEnchantment = makeGroupedCollection( tools );
		var statsEnchantmentCount = makeCollection( tools );
		var totalEnchantments = 0;
		var misses = 0;

		var calculateStdDev = function()
		{
			statsEnchantmentCount.updateSum();
			statsSimulateEnchantment.updateSum();
		};

		var collecthelper = function( result )
		{
			statsSimulateEnchantment.report( result.enchantment.id, result.enchantmentLevel );
		};

		var collectStats = function( result )
		{
			totalEnchantments += result.length;
			if( result.length === 0 )
				misses++;
			statsEnchantmentCount.report(result.length);
			tools.foreach( result, collecthelper )
		};

		var it = makeIterator( simulateEnchantments, collectStats );

		var iterate = function()
		{
			it.run( model.iterations(), model );
		};

		var sim = makeIterator( iterate, calculateStdDev );

		var baseLevel = getBaseEnchantmentLevel( model.itemId(), model.materialId() );

		page.write("");
		page.write( "Base enchantment level for tool: " + baseLevel );

		if( baseLevel <= 0 )
		{
			page.write( "Not enchantable!" );
			model.addChart(makeChart());
			return;
		}

		page.write( "Simulating enchanting "
			+ model.material() + " "
			+ model.item() + " "
			+ model.iterations() + " times over "
			+ model.simulations() +" series." );

		sim.run( model.simulations(), model );

		page.write( "Done, presenting data..." );
		if(misses > 0 )
			page.write ("Missed enchanting " + misses + " times.");

		page.write( "Enchantment count saturation: " + totalEnchantments / (model.simulations()*model.iterations()) );

		var writeNInfo = function( p,s,label )
		{
			return label + " enchantments: " + tools.wrapPercent(p,s);
		};


		var writeCInfo = function(enchantment,p,s,level)
		{
			return enchantment.name + " " + level + ": " + _tools.wrapPercent( p, s );
		};
		var eChart = makeChart("Probability that enchantment will be included");
		model.addChart(eChart);
		var drawController = makeDrawController( 240, 23, writeCInfo, model.iterations(), model.stdev(), page,
			function( enchantment, p )
			{
				page.write("Total prob. for " + enchantment.name + ": " + Math.floor(p*100) + "%" );
			},
		eChart);

		statsSimulateEnchantment.foreach( drawController );
		page.write();
		var nChart = makeChart("Probability to get N enchantments");
		model.addChart(nChart);
		var nWriter = makeBarGroup( 240, 23, "white", writeNInfo, model.iterations(), model.stdev(), page, nChart );
		statsEnchantmentCount.foreach( nWriter.drawNext );
	};
};