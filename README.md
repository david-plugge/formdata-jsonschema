# formdata-jsonschema

Parse FormData into a json object using [jsonschema](https://json-schema.org/).

## Installation

```bash
npm i formdata-jsonschema
```

```bash
yadn i formdata-jsonschema
```

```bash
pnpm i formdata-jsonschema
```

## Usage

```ts
import { Schema, formdataToJson } from 'formdata-jsonschema';

const schema: Schema = {
	type: 'object',
	properties: {
		string: { type: 'string' },
		integer: { type: 'integer' },
		number: { type: 'number' },
		boolean: { type: 'boolean' },
		json: { type: 'object', properties: { value: { type: number } } },
		array: { type: 'array', items: [{ type: 'string' }, { type: 'integer' }, { type: 'number' }] }
	}
};

const formdata = new FormData();
formdata.set('string', 'Hello World!');
formdata.set('integer', '1234');
formdata.set('number', '-1234.5678');
formdata.set('boolean', 'true');
formdata.set('json', JSON.stringify({ value: 123 }));
formdata.append('array', 'one');
formdata.append('array', '2');
formdata.append('array', '3.3');

const data = formDataToJson(formdata, schema);

console.log(data);
```
