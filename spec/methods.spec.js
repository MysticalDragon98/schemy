const Schemy = require('../index');

describe('Schemy methods', function() {
	it('Should return all validation errors', function() {
		const schema = new Schemy({
			title: {
				type: String
			},
			age: {
				type: Number
			},
			types: {
				type: [String]
			}
		});

		const input = {
			title: 1,
			age: '21',
			types: [1],
			something: true
		};

		const expectedErrors = [
			'Property something not valid in schema',
			'Property title is number, expected string',
			'Property age is string, expected number',
			'An item in array of property types is not valid. All items must be of type string'
		];

		expect(schema.validate(input)).toBe(false);
		expect(schema.getValidationErrors()).toEqual(expectedErrors);
	});

	it('Should throw error trying to get errors without calling validate first', function() {
		const schema = new Schemy({strict: false});

		try {
			schema.getValidationErrors();
		} 
		catch (err) {
			expect(err).toBe('You need to call .validate() before .getValidationErrors()');
		}
	});

	it('Should return the validated data', function() {
		const schema = new Schemy({
			title: {
				type: String
			}
		});
		
		const input = {
			title: 'something'
		};

		expect(schema.validate(input)).toBe(true);
		expect(schema.getBody()).toEqual(input);
	});

	it('Should return validated data with extra values', function() {
		const schema = new Schemy({
			title: {
				type: String
			},
			strict: false
		});
		
		const input = {title: 'something', age: 21};

		expect(schema.validate(input)).toBe(true);
		expect(schema.getBody()).toEqual({title: 'something'});
	});

	it('Should throw error if passing not Schemy instance as validation argument', async function() {
		expect(await Schemy.validate({}, {})).toThrow('Second argument must be an instance of Schemy');
	});

	it('Should throw error if passing an invalid argument as validation argument', async function() {
		expect(await Schemy.validate({}, 'abc')).toThrow('Second argument must be an instance of Schemy or a valid schema');
	});

	it('Should validate correctly if passing two objects to validate method', async function() {
		expect(
			await Schemy.validate({
				name: 'Alan'
			}, {
				name: {
					type: String,
					required: true
				}
			})
		).toBe(true);
	});

	it('Should pass validation correctly when validating asynchronously', async function() {
		const schema = new Schemy({
			title: {
				type: String,
				required: true
			}
		});

		const input = {
			name: 'Name'
		};

		expect(await Schemy.validate(input, schema)).toBe(true);
	});

	it('Should pass validation correctly when validating using promise', function() {
		const schema = new Schemy({
			title: {
				type: String,
				required: true
			}
		});

		const input = {
			name: 'Name'
		};

		Schemy.validate(input, schema).then(result => {
			expect(result).toBe(true);
		});
	})
});