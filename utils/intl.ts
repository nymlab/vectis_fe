export function IntlNumber(number: string | number) {
  const language = window.navigator.language;
  return new Intl.NumberFormat(language).format(parseInt(String(number)));
}

export function IntlAddress(address: string, length: number = 30): string {
  return address.slice(0, 8).concat("...") + address.substring(63 - length);
}
