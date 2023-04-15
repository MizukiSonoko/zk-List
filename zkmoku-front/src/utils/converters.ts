
export function asciiToBigInt(str: string): bigint {
  const hex = Buffer.from(str, 'ascii').toString('hex');
  return BigInt(`0x${hex}`);
}

export function bigIntToAscii(bigInt: bigint): string {
  const hex = bigInt.toString(16);
  return Buffer.from(hex, 'hex').toString('ascii');
}
