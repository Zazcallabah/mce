function cdfT( min, max, peak, x )
{
	if( x < min ) return 0;
	if( x < peak ) return ((x-min)*(x-min))/((max-min)*(peak-min));
	if( x == peak ) return (peak-min)/(max-min);
	if( x <= max ) return 1-((max-x)*(max-x))/((max-min)*(max-peak));
	return 1;
}

function Phi( x, m, s )
{
	if ( m === undefined ) {
      m = 0;
   }
	if ( s === undefined ) {
      s = 1;
   }
	return 0.5*(   1 + erf( (x-m) / (s * Math.sqrt(2)) )   );
}

function erf( z, n )
{
	if ( n === undefined ) {
      n = 5;
   }
	var pie = 3.141592653589793;
	var f1 = 2/Math.sqrt(pie);
	var sum = 0;
	for(var i = 0; i<n; i++ )
	{
		var t =Math.pow(-1,i)*Math.pow(z,2*i+1);
		var d = factorial(i)*(2*i+1);
		sum += t/d;
	}
	return sum*f1;
}

function factorial( n )
{
	if (n < 2) return 1;
	return (n * factorial(n-1));
}

function randomTriangular( start, end, peak )
{
	var randomValue = Math.random();
	if( randomValue <= ( peak - start ) / ( end - start ) )
		randomValue = start + 
		Math.sqrt( randomValue * ( end - start ) * ( peak - start ) );
	else
		randomValue = end - 
		Math.sqrt( ( 1 - randomValue ) * ( end - start ) * ( end - peak ) );
	return randomValue;
}

function randomNormal( mean, deviation )
{
	var x1 = 0;
	var w = 0;
	do
	{
		x1 = ( 2.0 * Math.random() ) - 1.0;
		var x2 = ( 2.0 * Math.random() ) - 1.0;
		w = ( x1 * x1 ) + ( x2 * x2 );
	} while( w >= 1.0 );

	w = Math.sqrt( ( -2.0 * Math.log( w ) ) / w );

	return mean + ( x1 * w * deviation );
}
