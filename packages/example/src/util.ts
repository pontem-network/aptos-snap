export function addHexPrefix(str: string): string {
  if (typeof str !== 'string') {
    return str;
  }

  return isHexPrefixed(str) ? str : '0x' + str;
}

export function isHexPrefixed(str: string): boolean {
  return str.startsWith('0x');
}
