import { JSONSchema4, JSONSchema4TypeName } from 'json-schema';

export type { JSONSchema4 as Schema };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formDataToJson<T extends Record<string, any>>(
	formdata: FormData,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	schema: Record<string, any> | JSONSchema4
): T {
	const object: Partial<T> = {};

	if (schema.type !== 'object') {
		throw new Error('Invalid schema, root type must be `object`');
	}

	let name: keyof T & string;
	for (name in schema.properties) {
		const propOptions = schema.properties[name];
		const propTypeName: JSONSchema4TypeName = propOptions.type;
		let propValue: T[typeof name] | undefined = undefined;

		if (propTypeName === 'array') {
			const allValues = formdata.getAll(name);

			if (
				allValues.length === 1 &&
				typeof allValues[0] === 'string' &&
				allValues[0].startsWith('[')
			) {
				try {
					const parsed = JSON.parse(allValues[0]);
					object[name] = parsed;
					continue;
				} catch (err) {
					/* invalid json */
				}
			}

			if (Array.isArray(propOptions.items)) {
				const array = Array.from({ length: propOptions.items.length });

				for (let i = 0; i < propOptions.items.length; i++) {
					array[i] = parseValue(allValues[i], propOptions.items[i].type);
				}
				propValue = array as T[keyof T];
			} else if (typeof propOptions.items === 'object') {
				const array = Array.from({ length: allValues.length });

				for (let i = 0; i < allValues.length; i++) {
					array[i] = parseValue(allValues[i], propOptions.items.type);
				}
				propValue = array as T[keyof T];
			}
		} else {
			const entryValue = formdata.get(name);

			if (!entryValue) {
				const isRequired = schema.required?.includes(name);

				if (isRequired && typeof entryValue === 'undefined') {
					throw new Error(`missing value ${name}`);
				}
				continue;
			}

			propValue = parseValue(entryValue, propTypeName);
		}

		object[name] = propValue;
	}

	return object as T;
}

function parseValue(value: FormDataEntryValue, type: JSONSchema4TypeName) {
	switch (type) {
		case 'any':
			return value;
		case 'boolean':
			return value === 'true' || value === 'on';
		case 'integer':
			// we allow floats so we can validate later
			return Number(value.toString());
		case 'number':
			return Number(value.toString());
		case 'null':
			return value.toString();
		case 'object':
			return JSON.parse(value.toString());
		case 'array':
			return JSON.parse(value.toString());
		case 'string':
			return value.toString();
		default:
			throw new Error(`unknown property type '${type}'`);
	}
}
