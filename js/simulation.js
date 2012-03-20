var makeSim = function(page,tools,model){

	var simulate = function(gc,c,level)
	{
		var total=0,misses=0;
		var collecthelper = function( result )
		{
			gc.report( result.enchantment.id, result.enchantmentLevel );
		};

		var collectStats = function( result )
		{
			total += result.length;
			if( result.length === 0 )
				misses++;
			if( c!== undefined )
				c.report(result.length);
			tools.foreach( result, collecthelper )
		};
		var calculateStdDev = function()
		{
			if(c!==undefined)
				c.updateSum();
			gc.updateSum();
		};
		var it = makeIterator( simulateEnchantments, collectStats, level || model.level() );

		var iterate = function()
		{
			it.run( model.iterations(), model );
		};
		var sim = makeIterator( iterate, calculateStdDev );
		sim.run( model.simulations(), model );
		return {total:total,misses:misses};
	};

	var byEnchantment = function()
	{
		var statsSimulateEnchantment = makeGroupedCollection( tools );
		var statsEnchantmentCount = makeCollection( tools );
		var itemname,materialname;
		tools.foreach( model.availableItems(), function(item){if( item.value === model.item() ) itemname = item.name; });
		tools.foreach( model.availableMaterials(), function(mat){if( mat.value === model.material() ) materialname = mat.name; });

		page.write( "Simulating enchanting "
			+ materialname + " "
			+ itemname + " "
			+ model.iterations() + " times over "
			+ model.simulations() +" series." );

		var sim_result = simulate(statsSimulateEnchantment,statsEnchantmentCount);

		page.write( "Done, presenting data..." );
		if(sim_result.misses > 0 )
			page.write ("Missed enchanting " + sim_result.misses + " times.");

		page.write( "Enchantment count saturation: " + sim_result.total / (model.simulations()*model.iterations()) );

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

	var byLevel = function(from,to){
		var ench = _enchantments[model.enchantment()];
		var chart = makeChart("Probability by level");
		model.addChart(chart);
		var writer = makeBarGroup( 240,16,ench.color,function(p,s,l){if(isNaN(p))return "";return l+": "+tools.wrapPercent(p,s)},model.iterations(),model.stdev(),page,chart,1 );
		for(var l = from; l<= to;l++)
		{
			var collection = makeGroupedCollection(tools);
			simulate(collection,undefined,l);

			var data = collection.find(model.enchantment(),model.power());
			writer.drawNext(data,l);
		}
	};

	return function(){
		page.clear();
		page.validateFields();
		_storage.saveData(model);
		var baseLevel = getBaseEnchantmentLevel( model.item(), model.material() );

		page.write("");
		page.write( "Base enchantment level for tool: " + baseLevel );

		if( baseLevel <= 0 )
		{
			page.write( "Not enchantable!" );
			model.addChart(makeChart());
			return;
		}

		if( model.mode() === "level" )
		{
			byLevel(1,25);
			byLevel(26,50);
		}
		else
		{
			byEnchantment();
		}
	};
};

var makeBarGroup = function( height, width, color, makeInfo, iterations, detailed, page, chart, existingcolumns )
{
	var columncount = existingcolumns || 0;
	var bargroup = {
		drawNext: function( statEntry, label )
		{
			var percent = statEntry.mean / iterations;
			var stdev = Math.sqrt( statEntry.variance ) / iterations;

			var info = makeInfo( percent, stdev, label );
			var upper = height * (percent + stdev );
			var mean = height * percent;
			var lower = height * (percent - stdev );
			chart.addBar( makeBar(color,info,label,upper,mean,lower,stdev, width*columncount + 1,detailed,width-3));
			if( info !== "" )
				page.write( info);
			columncount += 1;
		},

		currentColumnCount: function()
		{
			return columncount;
		}
	};
	return bargroup;
};
var makeDrawController = function( height, width, makeInfo, iterations, detailed, page, reportBack, chart )
{
	var currentEnchantment = undefined;
	var probabilitySum = 0;

	var maker = { currentColumnCount: function() { return 0; } };

	return {
		before: function( position )
		{
			currentEnchantment = _enchantments[position];
			probabilitySum = 0;
			maker = makeBarGroup(
				height,
				width,
				currentEnchantment.color,
				function(p,s,label)
				{
					probabilitySum += p;
					return makeInfo(currentEnchantment,p,s,label);
				},
				iterations,
				detailed,
				page,
				chart,
				maker.currentColumnCount()
			);
		},
		callback: function( stats, label ){ maker.drawNext(stats,label); },
		after: function() { reportBack( currentEnchantment, probabilitySum ); }
	};
};
