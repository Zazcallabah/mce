var _storage = makeStorage();
describe('storage', function(){

	it('can retrieve data to model', function(){

		var model = makeViewModel();
		model.mode( "aoeu");


		 _storage.getData(model);

		expect( model.mode() ).not.toBe( "aoeu" );
	});
});