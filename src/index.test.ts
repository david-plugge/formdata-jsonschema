import { formDataToJson, Schema } from './index';
import Ajv from 'ajv';
import { FormData as UndiciFormData } from 'undici';

global.FormData = UndiciFormData as unknown as typeof global.FormData;
const ajv = new Ajv({
	removeAdditional: 'all',
	allErrors: true
});

describe('basic types', () => {
	test('should parse integer', () => {
		const formdata = new FormData();
		formdata.set('a', '1234');
		formdata.set('b', '-1234');

		const schema: Schema = {
			type: 'object',
			properties: {
				a: { type: 'integer' },
				b: { type: 'integer' }
			}
		};

		const validate = ajv.compile(schema);
		const data = formDataToJson(formdata, schema);
		const valid = validate(data);

		expect(data).toEqual({
			a: 1234,
			b: -1234
		});
		expect(valid).toBe(true);
	});

	test('should parse number', () => {
		const formdata = new FormData();
		formdata.set('a', '1234');
		formdata.set('b', '-1234');
		formdata.set('c', '1234.1234');
		formdata.set('d', '-1234.1234');

		const schema: Schema = {
			type: 'object',
			properties: {
				a: { type: 'number' },
				b: { type: 'number' },
				c: { type: 'number' },
				d: { type: 'number' }
			}
		};

		const validate = ajv.compile(schema);
		const data = formDataToJson(formdata, schema);
		const valid = validate(data);

		expect(data).toEqual({
			a: 1234,
			b: -1234,
			c: 1234.1234,
			d: -1234.1234
		});
		expect(valid).toBe(true);
	});

	test('should parse string', () => {
		const formdata = new FormData();
		formdata.set('a', '1234');
		formdata.set('b', '-1234');
		formdata.set('c', '1234.1234');
		formdata.set('d', '-1234.1234');

		const schema: Schema = {
			type: 'object',
			properties: {
				a: { type: 'string' },
				b: { type: 'string' },
				c: { type: 'string' },
				d: { type: 'string' }
			}
		};

		const validate = ajv.compile(schema);
		const data = formDataToJson(formdata, schema);
		const valid = validate(data);

		expect(data).toEqual({
			a: '1234',
			b: '-1234',
			c: '1234.1234',
			d: '-1234.1234'
		});
		expect(valid).toBe(true);
	});

	test('should parse boolean', () => {
		const formdata = new FormData();
		formdata.set('a', 'true');
		formdata.set('b', 'false');
		formdata.set('c', 'on');
		formdata.set('d', 'off');

		const schema: Schema = {
			type: 'object',
			properties: {
				a: { type: 'boolean' },
				b: { type: 'boolean' },
				c: { type: 'boolean' },
				d: { type: 'boolean' }
			}
		};

		const validate = ajv.compile(schema);
		const data = formDataToJson(formdata, schema);
		const valid = validate(data);

		expect(data).toEqual({
			a: true,
			b: false,
			c: true,
			d: false
		});
		expect(valid).toBe(true);
	});

	test('should parse json', () => {
		const formdata = new FormData();
		formdata.set('a', JSON.stringify({ a: 'one', b: 2, c: true }));
		formdata.set('b', JSON.stringify(['one', 2, true]));

		const schema: Schema = {
			type: 'object',
			properties: {
				a: {
					type: 'object',
					properties: { a: { type: 'string' }, b: { type: 'integer' }, c: { type: 'boolean' } }
				},
				b: {
					type: 'array',
					items: [{ type: 'string' }, { type: 'integer' }, { type: 'boolean' }],
					minItems: 3,
					maxItems: 3
				}
			}
		};

		const validate = ajv.compile(schema);
		const data = formDataToJson(formdata, schema);
		const valid = validate(data);

		expect(data).toEqual({
			a: { a: 'one', b: 2, c: true },
			b: ['one', 2, true]
		});
		expect(valid).toBe(true);
	});

	test('should parse multiple items', () => {
		const formdata = new FormData();
		formdata.append('a', 'one');
		formdata.append('a', '2');
		formdata.append('a', 'true');

		const schema: Schema = {
			type: 'object',
			properties: {
				a: {
					type: 'array',
					items: [{ type: 'string' }, { type: 'integer' }, { type: 'boolean' }],
					minItems: 3,
					maxItems: 3
				}
			}
		};

		const validate = ajv.compile(schema);
		const data = formDataToJson(formdata, schema);
		const valid = validate(data);

		expect(data).toEqual({
			a: ['one', 2, true]
		});
		expect(valid).toBe(true);
	});
});
