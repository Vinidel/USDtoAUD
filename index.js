const ingestService = require('./services/ingester-service');

const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const BgBlack = '\x1b[40m';

async function t() {
  const supportedFiles = ['csv'];
  const args = process.argv;
  const filePath = args[2];
  const outputFilePath = 'result.csv';

  if (!filePath) {
    console.error(`${FgRed}%s${BgBlack} %s`, 'Please provide a path to the file in the command line', 'node index file/path.csv');
    // eslint-disable-next-line no-useless-return
    return;
  }

  const fileExtension = filePath.substring(filePath.length - 3);
  if (!supportedFiles.includes(fileExtension)) {
    console.error(`${FgRed}%s${BgBlack}`, `Brow I only except ${supportedFiles.join(',')}`);
    // eslint-disable-next-line no-useless-return
    return;
  }

  try {
    console.log(`${FgGreen}%s${BgBlack} %s`, 'Ingesting file', `${__dirname}/services/${filePath}`);
    await ingestService.readAndParseEtoro(`${__dirname}/${filePath}`);
    console.log(`${FgGreen}%s${BgBlack} %s`, 'File ingested you should get new file in folder', outputFilePath);
  } catch (error) {
    console.log(`${FgRed}%s${BgBlack}`, error);
  }
}

t();
