const ratesService = require('./services/rates-service');

async function t() {
  const r = await ratesService.getAllByDate('2022-08-01');
  console.log(r);
  r.data.documents.forEach((element) => {
    console.log(element);
  });
  return r;
}

t();
