var _storage = makeStorage();
describe('storage', function(){

	it('can store generic data', function(){

		var obj = {
			one: "one",
			two: "trolol",
			three: 2.0
		};

		_storage.saveData( obj );

		var r = _storage.getData();

		expect( obj.one ).toBe( r.one );
		expect( obj.two ).toBe( r.two );
		expect( obj.three ).toBe( r.three );
	});
});