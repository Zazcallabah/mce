var makeViewModel = function()
{
	var model = {};
	model.material = ko.observable(null);
	model.item = ko.observable(null);
	model.level = ko.observable(null);
	model.simulations = ko.observable(null);
	model.iterations = ko.observable(null);
	model.stdev = ko.observable(null);

	model.displayedCharts = ko.observableArray([]);
	model.addChart = function( chart )
	{
		model.displayedCharts.push(chart);

	};
	model.clear = function()
	{
		model.displayedCharts.pop();
		model.displayedCharts.pop();
	};

	var changeLevel = function( l )
	{
		var level = parseInt(model.level(),10);
		model.level( level + l);
	};

	model.addLevel = function(){changeLevel(1);};
	model.removeLevel=function(){changeLevel(-1);};
	model.itemId= function( name )
	{
		if( name === undefined )
			name = this.item();
		switch(name)
		{
			case 'pickaxe': return 0;
			case 'sword': return 1;
			case 'axe': return 2;
			case 'shovel': return 3;
			case 'helmet': return 4;
			case 'chestplate': return 5;
			case 'leggings': return 6;
			case 'boots': return 7;
			case 'bow': return 8;
			default: return -1;
		}
	};

	model.materialId = function( name )
	{
		if( name ===undefined)
			name=this.material();
		switch(name)
		{
			case 'diamond': return 0;
			case 'iron': return 1;
			case 'gold': return 2;
			case 'leather': return 3;
			case 'stone': return 4;
			case 'chain': return 5;
			case 'wood': return 6;
			default: return -1;
		}
	};

	model.setOnChanged = function( action ){
		model.level.subscribe(action);
		model.stdev.subscribe(action);
		model.material.subscribe(action);
		model.item.subscribe(action);
		model.simulations.subscribe(action);
		model.iterations.subscribe(action);
	};
	return model;
};


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


var makeChart = function(title){
	var chart={};
	chart.bars = ko.observableArray([]);
	chart.title = ko.observable(title);
	chart.addBar= function( bar ){
		chart.bars.push( bar );
	};
	return chart;
};

