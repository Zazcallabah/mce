var makeSim = function(page,tools,model){
	var byLevel = function()
	{
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
		var itemname,materialname;
		tools.foreach( model.availableItems(), function(item){if( item.value === model.item() ) itemname = item.name; });
		tools.foreach( model.availableMaterials(), function(mat){if( mat.value === model.material() ) materialname = mat.name; });
		var baseLevel = getBaseEnchantmentLevel( model.item(), model.material() );

		page.write("");
		page.write( "Base enchantment level for tool: " + baseLevel );

		if( baseLevel <= 0 )
		{
			page.write( "Not enchantable!" );
			model.addChart(makeChart());
			return;
		}

		page.write( "Simulating enchanting "
			+ materialname + " "
			+ itemname + " "
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

	var byEnchantment = function(from,to){
		var ench = _enchantments[model.enchantment()];
		var chart = makeChart("Probability by level");
		model.addChart(chart);
		var writer = makeBarGroup( 240,18,ench.color,function(p,s,l){return l+": "+Math.round(p*100)+"%"},model.iterations(),false,page,chart,1 );
		for(var l = from; l<= to;l++)
		{
			var collection = makeGroupedCollection(tools);
			var collectStats = function( result )
			{
				tools.foreach( result, function(r){
				collection.report( r.enchantment.id, r.enchantmentLevel ) });
			};

			for( var i = 0; i< model.iterations(); i++ )
			{
				var res = simulateEnchantments(model,l);
				collectStats( res );
			}
			var data = collection.find(model.enchantment(),model.power()).x;
			writer.drawNext({mean:data,stdev:0},l);
		}
	};

	return function(){
		page.clear();
		page.validateFields();
		_storage.saveData(model);

		if( model.mode() === "level" )
			byLevel();
		else
		{
			byEnchantment(1,20);
			byEnchantment(21,40);
			byEnchantment(41,50);
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
