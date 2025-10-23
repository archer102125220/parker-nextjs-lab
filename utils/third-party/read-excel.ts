import _readXlsxFile from 'read-excel-file';
import type { Row, ParsedObjectsResult } from 'read-excel-file';

type readXlsxFileType = typeof _readXlsxFile;

interface Result {
  // excel?: ParsedObjectsResult<{ [key: string]: any }>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  excel?: ParsedObjectsResult<{ [key: string]: any }> | Row[];
  files?: File | ArrayBuffer;
}

export const readXlsxFile: readXlsxFileType = _readXlsxFile;

export function handleReadExcel(): Promise<Result> {
  return new Promise((resolve, reject) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept =
        '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
      input.setAttribute('type', 'file');
      input.setAttribute(
        'accept',
        '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
      );
      input.addEventListener('change', () => {
        const file = input.files?.[0] || new ArrayBuffer();
        readXlsxFile(file).then((rows) => {
          resolve({ excel: rows, files: file });
        });
      });
      input.click();
    } catch (error) {
      reject(error);
    }
  });
}
