export function handlePolyfillScrollEnd(
  el: HTMLElement,
  handler: Function,
  wait: number = 100
) {
  if (typeof el?.addEventListener !== 'function') {
    console.error('missing scroll end element');
    return;
  }
  if (typeof handler !== 'function') {
    console.error('missing scroll end handler');
    return;
  }

  const _el: HTMLElement = el;
  if ('onscrollend' in _el) {
    function handleScrollEnd(event: Event, ...arg: any[]): void {
      setTimeout(() => handler(event, ...arg), wait);
    }
    el.addEventListener('scrollend', handleScrollEnd);
    return () => el.removeEventListener('scrollend', handleScrollEnd);
  }

  let setTimeoutTimer: NodeJS.Timeout | number = 0;
  function polyfillScrollEnd(event: Event, ...arg: any[]) {
    if (setTimeoutTimer !== 0) {
      clearTimeout(setTimeoutTimer);
      setTimeoutTimer = 0;
    }

    setTimeoutTimer = setTimeout(() => {
      setTimeoutTimer = 0;
      handler(event, ...arg);
    }, wait);
  }
  el.addEventListener('scroll', polyfillScrollEnd);

  return () => el.removeEventListener('scroll', polyfillScrollEnd);
}

export default handlePolyfillScrollEnd;
