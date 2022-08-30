/* eslint-disable no-param-reassign */
const csv = require('csvtojson');
const dateFns = require('date-fns');
const { parse } = require('json2csv');
const fs = require('fs');
const ratesService = require('./rates-service');

const csvPath = `${__dirname}/AUDUSD.csv`;
// const csvPath = `${__dirname}/closedpositions.csv`;

const DAYS_IN_A_YEAR = 365;
const HEADER_NAMES = [
  'Position ID',
  'Action',
  'Amount',
  'Units',
  'Open Date',
  'Close Date',
  'Leverage',
  'Spread',
  'Profit',
  'Open Rate',
  'Close Rate',
  'Take profit rate',
  'Stop lose rate',
  'Rollover Fees and Dividends',
  'Copied From',
  'Type',
  'ISIN',
  'Notes',
  'AUD',
  'TYPE (SHORT/LONG)',
  'ProfitInAud',
]

const extractDateFromString = (dateString = '01/12/1970 00:00:00') => dateString.substring(0, 10).split('/');

const readAndParseRates = () => {
  csv().fromFile(csvPath)
    .on('data', async (d) => {
      const jsonStr = d.toString('utf8');
      const j = JSON.parse(jsonStr);
      j.date = new Date(j.Date).toISOString();
      j.aud = Number.parseFloat(j.AUD.replace('$', ''));
      delete j.Date;
      delete j.AUD;
      await ratesService.createRates(j);
    });
};

const r = [];
const readAndParseEtoro = async (filePath) => csv().fromFile(filePath)
  .on('data', async (d) => {
    const jsonStr = d.toString('utf8');
    const j = JSON.parse(jsonStr);
    r.push(j);
  })
  .on('end', async () => {
    const requestPromises = r.map(async (j) => {
      const [closeDD, closeMM, closeYYYY] = extractDateFromString(j['Close Date']);
      const [openDD, openMM, openYYYY] = extractDateFromString(j['Open Date']);
      const dayRate = await ratesService.getAllByDate(`${closeYYYY}-${closeMM}-${closeDD}`);
      const rate = dayRate.data[0];

      // Compare dates
      const differenceInDays = dateFns.differenceInDays(
        new Date(`${closeYYYY}-${closeMM}-${closeDD}`),
        new Date(`${openYYYY}-${openMM}-${openDD}`),
      );

      j.ProfitInAud = (rate.aud * j.Profit).toFixed(2);
      j['TYPE (SHORT/LONG)'] = differenceInDays >= DAYS_IN_A_YEAR ? 'LONG' : 'SHORT';
      return j;
    });
    const v = await Promise.all(requestPromises);
    parse(v, { fields: HEADER_NAMES });
    fs.writeFileSync('result.csv', parse(v, { fields: HEADER_NAMES }));
  })
  .on('error', (error) => { throw error; });

module.exports = {
  readAndParseEtoro,
  readAndParseRates,
};
