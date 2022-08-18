const axios = require('axios');

const URLS = {
  find: 'https://data.mongodb-api.com/app/data-tapjq/endpoint/data/v1/action/find',
  insertOne: 'https://data.mongodb-api.com/app/data-tapjq/endpoint/data/v1/action/insertOne',
  findOne: '',
};

const { API_KEY } = process.env;

const createDataBodyWithConfig = (action) => (payload) => {
  const data = {
    collection: 'rates',
    database: 'xchangerates',
    dataSource: 'Cluster0',
  };

  if (action === 'insertOne') {
    data.document = payload;
  }

  if (action === 'find' && payload) {
    data.filter = {
      date: { $regex: payload },
    };
  }

  return {
    method: 'post',
    url: URLS[action],
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': API_KEY,
    },
    data: JSON.stringify(data),
  };
};

const createPostDataBodyConfig = createDataBodyWithConfig('insertOne');
const createGetDataBodyConfig = createDataBodyWithConfig('find');

const makeRequest = async (config) => {
  try {
    console.log('Making request', config);
    const r = await axios(config);
    console.log('Request finished successfully');
    return { success: true, status: r.status, data: r.data.documents ? r.data.documents : r.data };
  } catch (error) {
    if (error.response) {
      console.error('Request failed with status #%d and error #%d', error.response.status, error.response.data);
      const e = { success: false, status: error.response.status, data: error.response.data };
      throw e;
    }

    console.error('There was an unexpected error', error);
    const e = { success: false, status: 500 };
    throw e;
  }
};

const getAllByDate = async (year) => {
  const payloadConfig = createGetDataBodyConfig(year);
  const resultOfGet = await makeRequest(payloadConfig);
  return resultOfGet;
};

const createRates = async (rates) => {
  const payloadConfig = createPostDataBodyConfig(rates);
  const resultOfcreate = await makeRequest(payloadConfig);
  return resultOfcreate;
};

module.exports = {
  createRates,
  getAllByDate,
};
