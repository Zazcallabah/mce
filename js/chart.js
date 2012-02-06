var makeChart = function( height, width, divid, color, makeInfo, iterations, detailed, page, existingcolumns )
{
	var columncount = existingcolumns || 0;
	return {
		drawNext: function( statEntry, label )
		{
			page.writeChartBarWithStdev(
				statEntry,
				iterations,
				divid,
				height,
				width*columncount + 1,
				color,
				function(p,s){ return makeInfo(p,s,label); },
				detailed
				);
			columncount += 1;
		},

		currentColumnCount: function()
		{
			return columncount;
		}
	};
};

var makeDrawController = function( height, width, divid, makeInfo, iterations, detailed, page, reportBack )
{
	var currentEnchantment = undefined;
	var probabilitySum = 0;

	var maker = { currentColumnCount: function() { return 0; } };

	return {
		before: function( position )
		{
			currentEnchantment = _enchantments[position];
			probabilitySum = 0;
			maker = makeChart(
				height,
				width,
				divid,
				currentEnchantment.color,
				function(p,s,label)
				{
					probabilitySum += p;
					return makeInfo(currentEnchantment,p,s,label);
				},
				iterations,
				detailed,
				page,
				maker.currentColumnCount() );
		},
		callback: function( stats, label ){ maker.drawNext(stats,label); },
		after: function() { reportBack( currentEnchantment, probabilitySum ); }
	};
};
