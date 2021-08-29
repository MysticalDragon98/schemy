# Schemy <sup>![Tests](https://github.com/aeberdinelli/schemy/workflows/Tests/badge.svg)</sup> | [Docs 📖](https://github.com/aeberdinelli/schemy/wiki) · [Plugins 🧩](https://github.com/aeberdinelli/schemy/wiki/List-of-plugins) · [Changes 📝](https://github.com/aeberdinelli/schemy/releases)
Schemy is an extremely simple, lightweight yet powerful schema validation library. Perfect for lightweight-oriented projects like cloud functions where size and speed are key features. It weights less than 18 KB!

## Why Schemy?
This is how Schemy looks compared to other validation libraries.

|Feature / Library|[Schemy](https://npmjs.com/package/schemy)|ajv|joi|yup|tiny|
|:--- |:---: |:---: |:---: |:---: |:---: |
|Size|18 KB|998 KB|515 KB|315 KB|195 KB|
|Fully tested|✔|✔|✔|✔|✔|
|Custom validators|✔|✔|✔|✔|✔|
|Plugin support|✔|✔|✔|❌|❌|
|Easy to read docs|✔|✔|✔|❌|❌|
|Easy to use|✔|❌|✔|✔|❌|
|Fast|✔|✔|❌|❌|❌|
|Lightweight|✔|❌|❌|❌|❌|
|Fully documented|✔|❌|❌|❌|❌|
|Easy to read codebase|✔|❌|❌|❌|❌|
|Multi-language support|🧩|🧩|🧩|❌|❌|

🧩 Plugin required

## Usage
Install using npm: `npm install --save schemy`.
Then, create a schema with the desired properties and their types:

```javascript
const Schemy = require('schemy');

const nameSchema = new Schemy({
    'firstname': String,
    'lastname': String
});

const characterSchema = new Schemy({
    'name': {
        type: nameSchema, // You can also use nested schemas
        required: true
    },
    // You can also use nested schemas with our short format
    'address': {
        street: String,
        number: Number
    },
    // Schemy has some helpers to validate string formats like v1 uuid
    'id': {
        type: 'uuid/v1'
    }
});
```

Now, to validate that schema in your validation code:
```javascript
// This is a mock of some input we want to validate
const userInput = { name: 'Alan' };

// Validate against input data
if (!characterSchema.validate(userInput)) {
    characterSchema.getValidationErrors(); // => ['Missing required property age']
}

// You can also validate asynchronously
await Schemy.validate(userInput, characterSchema);

// Or, using promises
Schemy
    .validate(userInput, characterSchema)
    .then(passed => {...})
    .catch(validationErrors => {...});
```

## Plugins
Schemy can be easily extended with new functionality. For example, we have support for spanish language:

```javascript
const Schemy = require('schemy');

// Require the plugin
const SchemySpanish = require('schemy-translations-spanish');

// Call Schemy.extend() with the plugin
Schemy.extend(SchemySpanish);

// If you have multiple plugins, you can pass an array:
Schemy.extend([plugin1, plugin2, plugin3]);

// Then use schemy as usual!
```

## API
### Schemy(object)
Takes an object with the desired structure to validate later.

```javascript
const Schemy = require('schemy');

module.exports = new Schemy({
    'name': {
        type: String,
        required: true
    },
    'age': {
        type: Number,
        min: 18,
        max: 99
    },
    'phone': {
        type: Number,
    },
    'pictures': {
        type: [String]
    },
    'type': {
        type: String,
        enum: ['type1','type2','other']
    },
    'companyId': {
        type: 'uuid/v1',
    }
});
```
<br>

### Schemy.validate(data, SchemyInstance)
Asynchronously validates some data against the passed schema. Throws error on failure.

```javascript
const exampleSchema = new Schemy({...});
const input = {'name': 'Alan'};

async function() {
    await Schemy.validate(input, exampleSchema);
}
```

### Schemy*instance*.validate(data)
Validates the schema and returns true if input data passes validation. Returns false otherwise.

```javascript
const exampleSchema = new Schemy({...});
const input = {'name': 'Alan'};

exampleSchema.validate(input); // => true if input is valid, false otherwise
```
<br>

### Schemy*instance*.getValidationErrors()
If `Schemy.validate(...)` was called before, returns an array with all the validation errors of the last validation.

```javascript
const exampleSchema = new Schemy({
    'age': {
        type: Number,
        required: 'true'
    }
});

const input = {'age': '25'};

if (!exampleSchema.validate(input)) {
    console.log(
        exampleSchema.getValidationErrors()
    ); // => ['Property age is string, expected number'] 
}
```
<br>

### Schemy*instance*.getBody(includeAll = false)
Returns the validated body as an object from the last `Schemy.validate()` call.
If includeAll is set to true, then schemy will return the object with all the extra properties not defined in the original schema.
