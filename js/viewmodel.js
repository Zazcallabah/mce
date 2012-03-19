var makeViewModel = function()
{
	var model = {};
	model.mode = ko.observable("level");
	model.enchantmentMode = ko.computed(function(){return model.mode() === "enchantment" },model);
	model.levelMode = ko.computed(function(){return model.mode() === "level" },model);
	model.availableMaterials = ko.observableArray([
		{name:'Diamond',value: 0},
		{name:'Iron',value: 1},
		{name:'Gold',value: 2},
		{name:'Leather',value: 3},
		{name:'Stone',value: 4},
		{name:'Chainmail',value: 5},
		{name:'Wood',value: 6}]);
	model.availableItems = ko.observableArray([
		{name:'Pickaxe',value: 0},
		{name:'Sword',value: 1},
		{name:'Axe',value: 2},
		{name:'Shovel',value: 3},
		{name:'Helmet',value: 4},
		{name:'Chestplate',value: 5},
		{name:'Leggings',value: 6},
		{name:'Boots',value: 7},
		{name:'Bow',value: 8}]);
	model.availableEnchantments = ko.observableArray(_enchantments);
	model.enchantment = ko.observable(0);
	model.availablePowers = ko.observableArray([1,2,3,4,5]);
	model.power = ko.observable(1);
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
	bar.mainopacity = ko.observable(detailed ? 0.7 : 1.0);
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

