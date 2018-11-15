"use strict"

// GraphQL as a server docs
// https://graphql.github.io/graphql-js/running-an-express-graphql-server/
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const PORT = '3001';

// we can have models as standard classes
// https://graphql.org/graphql-js/object-types/
const RandomDie = require('./RandomDieModel');
const ExampleModel = require('./ExampleModel');

// let's mock our data store for simple examples
let mockStorage = {};

// see Basic Types for Query building docs
// https://graphql.org/graphql-js/basic-types/

// and Passing Arguments for accepting params
// https://graphql.org/graphql-js/passing-arguments/

// and Object Types
// https://graphql.org/graphql-js/object-types/

// and Mutations and Inputs (data input)
// https://graphql.github.io/graphql-js/mutations-and-input-types/
const schema = buildSchema(`
	input ExampleModelInput {
		fieldA: String
		fieldB: String
	}

	type ExampleModel {
		id: ID!
		fieldA: String
		fieldB: String
	}

	type Mutation {
		createModel(input: ExampleModelInput): ExampleModel
		updateModel(id: ID!, input: ExampleModelInput): ExampleModel
	}

	type RandomDie {
		numSides: Int!
		rollOnce: Int!
		roll(numRolls: Int!): [Int]
	}

	type Query {
		hello: String
		random: Float!
		getDie(numSides: Int): RandomDie
		rollDice(numDice: Int!, numSides: Int): [Int]
		getModel(id: ID!): ExampleModel
	}
`);

const root = {
	// maps to "hello" above in Schema
	hello: () => {
		return 'Hello World';
	},

	random: () => {
		return Math.random();
	},
	// accepts a single parameter with all named arguments from request as defined in schema
	// -- ex: numDice, numSides for this method
	// rollDice: (args) => {

	// also supports deconstruction in argument definition
	rollDice: ({numDice, numSides}) => {
		let output = [];
		console.log(args);
		for (let i = 0; i < numDice; i++) {
			output.push(1 + Math.floor(Math.random() * (numSides || 6)));
		}
		return output;
	},

	getDie: ({numSides}) => {
		return new RandomDie(numSides || 6);
	},

	// 
	getModel: ({id}) => {
		if (!mockStorage[id]) {
			throw new Error(`model [${id}] does not exist`);
		}
		return new ExampleModel(id, mockStorage[id]);
	},

	// defined in the Mutation above
	createModel: ({input}) => {
		const id = Date.now();
		mockStorage[id] = input;
		return new ExampleModel(id, mockStorage[id]);
	},

	//defined in the Mutation above
	updateModel: ({id, input}) => {
		if (!mockStorage[id]) {
			throw new Error(`model [${id}] does not exist`);
		}
		return new ExampleModel(id, mockStorage[id]);
	},
};

const graphQLConfig = {
	schema: schema,
	rootValue: root,
	graphiql: true,
};

const graphQLServer = graphqlHTTP(graphQLConfig);

let app = express();
app.use('/gql', graphQLServer);
app.listen(PORT);
console.log(`GraphQL API started on localhost:${PORT}/gql`);