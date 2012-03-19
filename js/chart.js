
var makeBar = function(color,message,label,upper,mean,lower,stdev,distanceleft,detailed)
{
	var bar = {};
	bar.color = ko.observable(color);
	bar.detailmessage=ko.observable(message);
	bar.label = ko.observable(label);
	bar.pixelheight = ko.observable( Math.round(mean) + "px");
	bar.stdev = ko.observable(stdev);
	bar.upperstdev = ko.observable(Math.round(upper)+"px");
	bar.lowerstdev = ko.observable(Math.round(lower)+"px");
	bar.distanceleft = ko.observable(distanceleft+"px");
	bar.showstdev = ko.observable(detailed);
	return bar;
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
			chart.addBar( makeBar(color,info,label,upper,mean,lower,stdev, width*columncount + 1,detailed));
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
	chart.bars = ko.observableArray([]);
	chart.title = ko.observable(title);
	chart.addBar= function( bar ){
		chart.bars.push( bar );
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
				chart,
				maker.currentColumnCount()
			);
		},
		callback: function( stats, label ){ maker.drawNext(stats,label); },
		after: function() { reportBack( currentEnchantment, probabilitySum ); }
	};
};
