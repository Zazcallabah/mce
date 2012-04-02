var makePage = function( storage, tools, model ) { return {

/*
 * Writes data to the info box.
 */
write: function( str )
{
	if(str === undefined )
		str = " ";
	window.document.getElementById("output").innerHTML += str + "\n";
},

/*
 * Clears the info box of all components.
 */
clear: function()
{
	model.clear();
	this.clearAll("textholder");
},

clearAll: function( identifier )
{
	var elems = window.document.getElementsByClassName(identifier)
	for(var i = 0; i = elems.length; i++)
		elems[i].innerHTML="";
},

/*
 * Ensures all input fields contain correct data.
 */
validateFields: function()
{
	var level = parseInt(model.level(),10);
	if( level < 1 )
		model.level(1);
	if( level > 50 )
		model.level(50);
	if( isNaN( level ) )
		model.level( 30 );
}

}; };
