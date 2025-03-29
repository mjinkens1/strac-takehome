/* eslint-disable @typescript-eslint/no-require-imports */

require('whatwg-fetch');

if (typeof window !== 'undefined') {
  require('@testing-library/jest-dom');

  const { getComputedStyle } = window;
  window.getComputedStyle = (elt) => getComputedStyle(elt);
  window.HTMLElement.prototype.scrollIntoView = () => {};

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  
  window.ResizeObserver = ResizeObserver;
}

if (typeof Request === 'undefined') {
  const fetch = require('node-fetch');
  global.Request = fetch.Request;
  global.Headers = fetch.Headers;
  global.Response = fetch.Response;
}
