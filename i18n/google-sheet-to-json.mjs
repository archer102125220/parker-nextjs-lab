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
    metadata: {
      systemName: "Parker's Next.js lab",
      defaultTitle: "Parker's Next.js lab",
      titleTemplate: "%s | Parker's Next.js lab",
      description: "Parker's Next.js Laboratory"
    },
    components: {
      MuiBreadcrumbs: {
        defaultProps: {
          expandText: 'Show path',
        }
      },
      MuiTablePagination: {
        defaultProps: {
          getItemAriaLabel: (type) => {
            if (type === 'first') {
              return 'Go to first page';
            }
            if (type === 'last') {
              return 'Go to last page';
            }
            if (type === 'next') {
              return 'Go to next page';
            }
            // if (type === 'previous') {
            return 'Go to previous page';
          },
          labelRowsPerPage: 'Rows per page:',
          labelDisplayedRows: ({ from, to, count }) =>
            `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`,
        }
      },
      MuiRating: {
        defaultProps: {
          getLabelText: value => `${value} Star${value !== 1 ? 's' : ''}`,
          emptyLabelText: 'Empty',
        }
      },
      MuiAutocomplete: {
        defaultProps: {
          clearText: 'Clear',
          closeText: 'Close',
          loadingText: 'Loading…',
          noOptionsText: 'No options',
          openText: 'Open',
        }
      },
      MuiAlert: {
        defaultProps: {
          closeText: 'Close',
        }
      },
      MuiPagination: {
        defaultProps: {
          'aria-label': 'Pagination navigation',
          getItemAriaLabel: (type, page, selected) => {
            if (type === 'page') {
              return `${selected ? '' : 'Go to '}page ${page}`;
            }
            if (type === 'first') {
              return 'Go to first page';
            }
            if (type === 'last') {
              return 'Go to last page';
            }
            if (type === 'next') {
              return 'Go to next page';
            }
            // if (type === 'previous') {
            return 'Go to previous page';
          },
        }
      },
    },
    ...muiEnUS
  };
  const zhTw = {
    metadata: {
      systemName: "Parker 的 Next.js實驗室",
      defaultTitle: "Parker 的 Next.js實驗室",
      titleTemplate: "%s | Parker 的 Next.js實驗室",
      description: "Parker 的 Next.js實驗室"
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