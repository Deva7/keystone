const { Implementation } = require('../../Implementation');
const { MongooseFieldAdapter } = require('@keystonejs/adapter-mongoose');

class Integer extends Implementation {
  constructor() {
    super(...arguments);
  }

  getGraphqlOutputFields() {
    return `
      ${this.path}: Int
    `;
  }
  getGraphqlOutputFieldResolvers() {
    return { [`${this.path}`]: item => item[this.path] };
  }

  getGraphqlQueryArgs() {
    return `
        ${this.path}: Int
        ${this.path}_not: Int
        ${this.path}_lt: Int
        ${this.path}_lte: Int
        ${this.path}_gt: Int
        ${this.path}_gte: Int
        ${this.path}_in: [Int]
        ${this.path}_not_in: [Int]
    `;
  }
  getGraphqlUpdateArgs() {
    return `
      ${this.path}: Int
    `;
  }
  getGraphqlCreateArgs() {
    return `
      ${this.path}: Int
    `;
  }
}

class MongoIntegerInterface extends MongooseFieldAdapter {
  addToMongooseSchema(schema) {
    const { mongooseOptions } = this.config;
    const required = mongooseOptions && mongooseOptions.required;

    schema.add({
      [this.path]: {
        type: Number,
        validate: {
          validator: required
            ? Number.isInteger
            : a => {
                if (typeof a === 'number' && Number.isInteger(a)) return true;
                if (typeof a === 'undefined' || a === null) return true;
                return false;
              },
          message: '{VALUE} is not an integer value',
        },
        ...mongooseOptions,
      },
    });
  }

  getQueryConditions() {
    return {
      [this.path]: value => ({ [this.path]: { $eq: value } }),
      [`${this.path}_not`]: value => ({ [this.path]: { $ne: value } }),
      [`${this.path}_lt`]: value => ({ [this.path]: { $lt: value } }),
      [`${this.path}_lte`]: value => ({ [this.path]: { $lte: value } }),
      [`${this.path}_gt`]: value => ({ [this.path]: { $gt: value } }),
      [`${this.path}_gte`]: value => ({ [this.path]: { $gte: value } }),
      [`${this.path}_in`]: value => ({ [this.path]: { $in: value } }),
      [`${this.path}_not_in`]: value => ({ [this.path]: { $not: { $in: value } } }),
    };
  }
}

module.exports = {
  Integer,
  MongoIntegerInterface,
};