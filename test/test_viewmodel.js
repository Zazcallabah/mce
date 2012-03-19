describe('a viewmodel', function(){
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
});
