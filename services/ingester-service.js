const csv = require('csvtojson');
const ratesService = require('./rates-service');

const csvPath = `${__dirname}/AUDUSD.csv`;

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
