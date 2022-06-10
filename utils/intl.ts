export function IntlNumber(number: string | number) {
  const language = window.navigator.language;
  return new Intl.NumberFormat(language).format(parseInt(String(number)));
}
