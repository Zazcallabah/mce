/*
I stepped through the source, and Step 1 is:
j = base enchantability
j2 = 1 + X + X, where X is a random variable with distribution U(0,j/2) (disc.)
k = j2 + chosen enchant level
f = (N + N -1) *0.25, where N is U(0,1) (cont.)
l = k * (1 + f)+.5;

l= (1 + X + X+level) * (1 + ((N + N -1) *0.25))+.5

Which I figure can be approximated to a random variable with normal distribution, mean j/2+level+1.5 and std.dev. sqrt(0.25^2+(j^2/24)^2)


	
	writev("First iteration, base enchantment level = j" );
	writev(" X is U(0,j/2), E(X) = j/4, V(X) = j^2/48" );
	writev(" Y is N(m,s), E(Y) = m = j/2 +1, V(Y) = s = j^2/24 " );
	writev("k = Y + level, k is N(j/2+level+1,j^2/24) ");
	writev("f is N(1,0.25) ");
	writev(" final enchantment level = k*f + 0.5, is N(j/2+level+1.5, sqrt(0.25^2/6+(j^2/24)))");
	
	var m = ench / 2 + parseInt(level) +1.5;
	var s = Math.sqrt( ((ench*ench)/24) + (0.25*0.25/6) );
	
	write( "F is N( " + m + " , " + s + " )" );
*/
function approxSimulDistr( base, level, min, max )
{
	var mean  = base/2+level;
	return randomTriangular( min, max, mean );
}
function X( base )
{
	return parseInt(Math.random() * (base/2));
}

function N()
{
	return Math.random();
}

function countInterval( arr, min, max )
{
	var count = 0;
	for( var i = 0; i<arr.length; i++ )
	{
		if( arr[i] >= min && arr[i] < max )
			count++;
	}
	return count;
}

function makeSimulation( turns, generateSim )
{
	var _sim = new Array();
	var _max = -1000000;
	var _min = 1000000;
	for(var i =0;i<turns;i++)
	{
		_sim[i] = parseInt(generateSim());
		if( _sim[i] > _max ) _max = _sim[i];
		if( _sim[i] < _min ) _min = _sim[i];
	}
	
	var returnee = {
	min: _min,
	max: _max,
	sim: _sim };
	
	return returnee;
}

function createIntervals( sim, intervalcount )
{
	var delta = ( sim.max - sim.min ) / intervalcount;
	var intervals = new Array();
	for(var i = 0; i<intervalcount; i++ )
	{
		var _min = i*delta + sim.min;
		var _max = _min + delta;
		intervals[i] =
		{
			a:_min,
			b:_max,
			count: 0,
		};
	}
	intervals[intervalcount] = { a: sim.max,b: sim.max+1, count: 0};
	return {
		peak: 0,
		list: intervals,
	};
}

function clearIntervalsCount( intervals )
{
	for( var i = 0; i<intervals.list.length; i++ )
		intervals.list[i].count = 0;
	return {
		peak: intervals.peak,
		list:intervals.list,
	};
}

function fillIntervals( sim, intervals )
{
	var maxcount = 0;
	for( var i=0; i<intervals.list.length; i++)
	{
		intervals.list[i].count = countInterval( sim.sim, intervals.list[i].a, intervals.list[i].b );
		if( intervals.list[i].count > maxcount ) maxcount = intervals.list[i].count;
	}
	return {
		peak: maxcount,
		list: intervals.list,
	};
}

function makeGraph( output, intervals, divheight, columnwidth )
{
	for( var i=0;i<intervals.list.length; i++)
	{
		var percent = intervals.list[i].count / intervals.peak;
		var transformedheight = divheight * percent;
		writev( "interval #"+i+" ( "+intervals.list[i].a+" , "+ intervals.list[i].b+" ) : " + intervals.list[i].count );
		output.innerHTML += "<div style=\"height:"+ transformedheight +"px;left:"+ (i * columnwidth + 1)+"px\"></div>"
	}
}