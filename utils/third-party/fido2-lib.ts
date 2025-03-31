import { Fido2Lib } from 'fido2-lib';
import type { Fido2LibOptions } from 'fido2-lib';

type Fido2LibType = Fido2Lib;

let f2l: Fido2LibType;
let option: Fido2LibOptions;

export * from 'fido2-lib';

export function fido2LibIsInitialized() {
  return f2l instanceof Fido2Lib;
}

export function getFido2Lib() {
  if (f2l instanceof Fido2Lib === false) {
    throw new Error('Fido2Lib Not initialized');
  }

  return f2l;
}

export function fido2LibInitialize(_option: Fido2LibOptions) {
  option = _option;
  return (f2l = new Fido2Lib(option));
}

export function newFido2Lib(_option: Fido2LibOptions) {
  return new Fido2Lib(_option);
}

export function reNewFido2Lib() {
  return new Fido2Lib(option);
}

export function setFido2Lib(newF2l: Fido2LibType) {
  if (newF2l instanceof Fido2Lib === false) {
    throw new Error('Not Fido2Lib Object');
  }
  f2l = newF2l;
}

export default {
  getFido2Lib,
  fido2LibInitialize,
  fido2LibIsInitialized,
  newFido2Lib,
  setFido2Lib
};
