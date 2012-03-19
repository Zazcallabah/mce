
var makeBar = function(color,message,label,pxHeight,stdev,distanceleft)
{
	var bar = {};
	bar.color = color;
	bar.detailmessage=message;
	bar.label = label;
	bar.pixelheight = pxHeight;
	bar.stdev = stdev;
	bar.distanceleft = distanceleft;
	bar.opacity = 0.5;
	return bar;
};

var makeBarGroup = function( height, width, color, makeInfo, iterations, detailed, page, existingcolumns, chart )
{
	var columncount = existingcolumns || 0;
	var bargroup = {
		drawNext: function( statEntry, label )
		{
			var percent = statEntry.mean / iterations;
			var stdev = Math.sqrt( statEntry.variance ) / iterations;

			var info = makeInfo( percent, stdev, label );
			var mean = height * percent;
			chart.addBar( makeBar(color,info,label,mean,stdev, width*columncount + 1));
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

var makeChart = function(title){
	var chart={};
	chart.bars = ko.observableArray([makeBar(),makeBar()]);
	chart.title = ko.observable(title);
	chart.addBar= function( bar ){
		bars.push( bar );
	};
	return chart;
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
				maker.currentColumnCount(),
				chart
			);
		},
		callback: function( stats, label ){ maker.drawNext(stats,label); },
		after: function() { reportBack( currentEnchantment, probabilitySum ); }
	};
};
