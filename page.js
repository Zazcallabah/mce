function write( str )
{
	if(str === undefined )
		str = " ";
	$("#output")[0].innerHTML += "<pre>"+str + "\n</pre>";
}
function writev( str )
{
	$("#output")[0].innerHTML += "<p class=\"debug\">" + str + "</p>\n";
}

function clear()
{
	clearAll(".chartholder");
	clearAll(".textholder");
}

function clearAll( identifier )
{
	var elems = $(identifier);
	for(var i = 0; i<elems.length; i++)
		elems[i].innerHTML="";
}

function addLevel()
{
	changeLevel(1);
	simulate();
}

function removeLevel()
{
	changeLevel(-1);
	simulate();
}

function validateFields()
{
	var defaultvalues = getDefaultValues();

	var level = parseInt($("#level")[0].value,10);
	if( level < 0 )
		$("#level")[0].value = 0;
	if( level > 50 )
		$("#level")[0].value = 50;
	if( isNaN( level ) )
		$("#level")[0].value = defaultvalues.level;

	var trials = $("#trials")[0].value.split("/");
	if( trials.length != 2 || !validInt(parseInt(trials[0])) || !validInt(parseInt(trials[1])) )
			$("#trials")[0].value = defaultvalues.iterations + "/" + defaultvalues.simulations;
}

function validInt( i )
{
	return i < 0 ? false : !isNaN(i);
}

function setInitialValues()
{
	var data = getDataFromStorage();
	setForSelect( "#material", data.material );
	setForSelect( "#item", data.item );
	$("#level")[0].value = data.level;
	$("#trials")[0].value = data.iterations + "/" + data.simulations;
	$("#stdev")[0].checked = data.showstdev;
}

function setForSelect( id, value )
{
	for (var i=0;i< $(id)[0].options.length;i++)
		if ($(id)[0].options[i].value === value)
			$(id)[0].options[i].selected = true;
}

function getInputData()
{
	validateFields();
	var data = getDefaultValues();
	data.material = $("#material")[0].value;
	data.item = $("#item")[0].value;
	data.level = parseInt($("#level")[0].value);
	var trials = $("#trials")[0].value.split("/");
	data.iterations = parseInt( trials[0] );
	data.simulations = parseInt( trials[1] );
	data.materialId = getMaterialId( data.material );
	data.itemId = getItemId( data.item );
	data.showstdev = $("#stdev")[0].checked;
	saveDataToStorage( data );
	return data;
}

function changeLevel( l )
{
	var elem = $("#level")[0];
	var level = parseInt(elem.value);
	elem.value = level + l;
}
function getItemId( name )
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
}

function getMaterialId( name )
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

