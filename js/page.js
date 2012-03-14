var makePage = function( storage, tools ) { return {

/*
 * Writes data to the info box.
 */
write: function( str )
{
	if(str === undefined )
		str = " ";
	$("#output")[0].innerHTML += str + "\n";
},

/*
 * Clears the info box and all charts of all components.
 */
clear: function()
{
	this.clearAll(".chartholder");
	this.clearAll(".textholder");
},

clearAll: function( identifier )
{
	var elems = $(identifier);
	for(var i = 0; i<elems.length; i++)
		elems[i].innerHTML="";
},

addLevel: function()
{
	this.changeLevel(1);
},

removeLevel: function()
{
	this.changeLevel(-1);
},

/*
 * Ensures all input fields contain correct data.
 */
validateFields: function()
{
	var defaultvalues = storage.getDefault();

	var level = parseInt($("#level")[0].value,10);
	if( level < 1 )
		$("#level")[0].value = 1;
	if( level > 50 )
		$("#level")[0].value = 50;
	if( isNaN( level ) )
		$("#level")[0].value = defaultvalues.level;

	var trials = $("#trials")[0].value.split("/");
	if( trials.length != 2 || !tools.validInt(parseInt(trials[0])) || !tools.validInt(parseInt(trials[1])) )
			$("#trials")[0].value = defaultvalues.iterations + "/" + defaultvalues.simulations;
},

writeChartBarWithStdev: function( dataset, iterations, divid, maxHeight, yOffset, enchantmentSettings, makeInfo, showstdev )
{
	var percent = dataset.mean / iterations;
	var stdev = Math.sqrt( dataset.variance ) / iterations;

	var info = makeInfo( percent, stdev );
	var upper = maxHeight * (percent + stdev );
	var mean = maxHeight * percent;
	var lower = maxHeight * (percent - stdev );
	if(showstdev)
	{
		$(divid)[0].innerHTML += this.makeChartBar( info, upper, yOffset, enchantmentSettings.color, 0.5 );
		$(divid)[0].innerHTML += this.makeChartBar( info, mean, yOffset, enchantmentSettings.color, 0.7 );
		$(divid)[0].innerHTML += this.makeChartBar( info, lower, yOffset, enchantmentSettings.color, 1 );
	}
	else
	{
		$(divid)[0].innerHTML += this.makeChartBar( info, mean, yOffset, enchantmentSettings.color, 1 );
	}
	$(divid)[0].innerHTML += "<div style=\"height:1em; left:"+yOffset+"px;bottom:-2em;margin:0.5em;padding:0.3em;border:none\">"+enchantmentSettings.label+"</div>";
	this.write( info);
},

makeChartBar: function( detailmessage, pixelheight, distanceleft, color, opacity)
{
	return "<a title=\""+detailmessage+"\"><div style=\"height:"+ pixelheight +"px;left:"+ distanceleft+"px;opacity:"+opacity+";background-color:"+color+"\"></div></a>";
},


/*
 * Seed the input components with the data stored in localStorage.
 */
setInitialValues: function()
{
	var data = storage.getData();
	this.setForSelect( "#material", data.material );
	this.setForSelect( "#item", data.item );
	$("#level")[0].value = data.level;
	$("#trials")[0].value = data.iterations + "/" + data.simulations;
	$("#stdev")[0].checked = data.showstdev;
},

setForSelect: function( id, value )
{
	for (var i=0;i< $(id)[0].options.length;i++)
		if ($(id)[0].options[i].value === value)
			$(id)[0].options[i].selected = true;
},

/*
 * Returns a data object containing all input.
 * Data is validated before retrieval.
 */
getInputData: function()
{
	this.validateFields();
	var data = storage.getDefault();
	data.material = $("#material")[0].value;
	data.item = $("#item")[0].value;
	data.level = parseInt($("#level")[0].value, 10);
	var trials = $("#trials")[0].value.split("/");
	data.iterations = parseInt( trials[0], 10 );
	data.simulations = parseInt( trials[1], 10 );
	data.materialId = this.getMaterialId( data.material );
	data.itemId = this.getItemId( data.item );
	data.showstdev = $("#stdev")[0].checked;
	storage.saveData( data );
	return data;
},

changeLevel: function( l )
{
	var elem = $("#level")[0];
	var level = parseInt(elem.value,10);
	elem.value = level + l;
},

getItemId: function( name )
{
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
},

getMaterialId: function( name )
{
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
}

}; };
