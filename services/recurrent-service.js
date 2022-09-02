const schedule = require('node-schedule');
const ratesService = require('./rates-service');

const t = async () => {
  console.log('I have been called');
  const r = await ratesService.getAllByDate();
  console.log('returned', r.data);
};

const createScheduler = () => {
  const rule = new schedule.RecurrenceRule();
  rule.hour = 6;
  rule.minute = 10;
  rule.tz = 'Australia/NSW';
  const job = schedule.scheduleJob(rule, ratesService.scrapeAndCreateRate);
  // const job = schedule.scheduleJob(' */1 * * * *', ratesService.scrapeAndCreateRate);
  console.log('Created job for', rule.nextInvocationDate());
  return job;
};

module.exports = {
  createScheduler,
};
