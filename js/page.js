var makePage = function( storage, tools, model ) { return {

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
 * Clears the info box of all components.
 */
clear: function()
{
	model.clear();
	this.clearAll(".textholder");
},

clearAll: function( identifier )
{
	var elems = $(identifier);
	for(var i = 0; i<elems.length; i++)
		elems[i].innerHTML="";
},

/*
 * Ensures all input fields contain correct data.
 */
validateFields: function()
{
	var defaultvalues = storage.getDefault();

	var level = parseInt(model.level(),10);
	if( level < 1 )
		model.level(1);
	if( level > 50 )
		model.level(50);
	if( isNaN( level ) )
		model.level( defaultvalues.level );
},

makeChartBar: function( detailmessage, pixelheight, distanceleft, color, opacity)
{
	return "<a title=\""+detailmessage+"\"><div style=\"height:"+ pixelheight +"px;left:"+ distanceleft+"px;opacity:"+opacity+";background-color:"+color+"\"></div></a>";
},


setForSelect: function( id, value )
{
	for (var i=0;i< $(id)[0].options.length;i++)
		if ($(id)[0].options[i].value === value)
			$(id)[0].options[i].selected = true;
}

}; };
