
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