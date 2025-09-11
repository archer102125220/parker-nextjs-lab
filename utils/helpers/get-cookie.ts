export function getCookie(cname: string = '', cookie: string): string {
  const name: string = cname + '=';
  const decodedCookie: string = decodeURIComponent(cookie);
  const ca: Array<string> = decodedCookie.split(';');

  for (let i: number = 0; i < ca.length; i++) {
    let c: string = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

interface CookieInterface {
  [key: string]: string;
}

export function getJsonCookie(cookieString: string): CookieInterface {
  const cookie: CookieInterface = {};
  const decodedCookie = decodeURIComponent(cookieString);
  const ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    const c = ca[i]?.split('=');
    cookie[c[0]] = c[1];
  }
  return cookie;
}

export function asciiToText(text: string): string {
  const strings: Array<string> = text.split('\\');

  const result: string = strings.reduce(
    (result: string, string: string, index: number): string => {
      let t: string = string;
      if (index !== 0) t = String.fromCharCode(parseInt(string, 8));
      return result.concat(t);
    },
    ''
  );

  return result;
}
