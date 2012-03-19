describe('a viewmodel', function(){
	var tools = makeTools();
	describe('with attached simulation',function(){
		it('runs sim when updating material', function(){
			var vm = makeViewModel();
			vm.material("aoeu");
			var hitcount = 0;
			vm.setOnChanged(function(){hitcount++;});
			vm.material("other");
			expect(hitcount).toBe(1);
		});
	});
	describe( 'stores item ids', function(){
		var vm = makeViewModel();

		it('supports bow',function(){
			var item = tools.where( vm.availableItems(),function(i){return i.name==="Bow"})[0];
			expect(item.value).toBe(8);
		});
	});

});
