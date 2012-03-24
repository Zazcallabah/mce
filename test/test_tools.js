describe('tools', function(){
	describe('when foreaching over a collection object', function(){
		it('calls properties in order',function(){
			var t = makeTools();
			var c = makeCollection(t);

			c.report(1);
			c.report(3);
			c.report(2);

			c.report(3);
			c.report(3);
			c.report(2);

			var count = 0;
			c.foreach( function(item,label)
			{
					expect(label).toBe(''+(count+1));
					expect(item.x).toBe((count+1));
				count++;
			}
			);

		});
	});
});