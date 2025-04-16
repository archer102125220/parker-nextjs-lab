import '@babel/register';

import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { unflatten } from 'flat'
import fsExtra from 'fs-extra';
import { extractSheets } from 'spreadsheet-to-json';
import { zhTW as muiZhTW, enUS as muiEnUS } from '@mui/material/locale';

// import credentials from '../google-key/g-key-90f333a85fc9.mjs';
const credentials = {};

const __dirname = dirname(fileURLToPath(import.meta.url));

const I18N_DIR = join(__dirname, './');

const sheetsToExtract = [
  'System',
  'Index',
  'Reserve Room',
  'Follow Player',
  'Latest News',
  'Recommend Store',
  'Login',
  'Sign up',
  'Forgot password',
  'Member information',
  'Reset Password',
  'Member information new phone',
  'Collect stamps',
  'Points',
  'Coupons',
  'Modify registered phone number',
  'Member guide'
];

async function googleSheetToJson() {
  const en = {
    system: {
      titleTemplate: "Parker's Next.js lab"
    },
    ...muiEnUS
  };
  const zhTw = {
    system: {
      titleTemplate: 'Parker 的 Next.js 實驗室'
    },
    ...muiZhTW
  };
  let err;


  try {
    const data = await extractSheets(
      {
        spreadsheetKey: 'fake',
        credentials,
        sheetsToExtract
      },
    );
    sheetsToExtract.forEach(function (_sheetsToExtract) {
      const sheets = data[_sheetsToExtract] || [];
      sheets.forEach(function (_sheets) {
        if (_sheets.key !== null) {
          const key = (_sheetsToExtract + '.' + _sheets.key)
            .replaceAll(/\s/g, '_')
            .toLocaleLowerCase();

          const sheetsZhTw = _sheets['zh-TW'];
          const sheetsEn = _sheets['en-US'];
          const defaultLang = sheetsZhTw || '';
          en[key] = sheetsEn || defaultLang;
          zhTw[key] = sheetsZhTw || defaultLang;
        }
      });
    });
  } catch (error) {
    err = error;
  }

  const output = [
    { lang: en, file: 'locales/en.json' },
    { lang: zhTw, file: 'locales/zh-tw.json' }
  ];
  output.forEach(function (_lang) {
    fsExtra.ensureDirSync(dirname(resolve(I18N_DIR, _lang.file)));
    fsExtra.writeJSONSync(
      resolve(I18N_DIR, _lang.file),
      unflatten(_lang.lang, { object: true }),
      { spaces: 2 }
    );
  });

  if (err) {
    throw err;
  }
}

googleSheetToJson();