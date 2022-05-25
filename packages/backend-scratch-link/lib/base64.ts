export const base64ToUint8Array = (base64: string) => {
  const binaryString = Buffer.from(base64, 'base64').toString();
  const len = binaryString.length;
  const array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    array[i] = binaryString.charCodeAt(i);
  }
  return array;
};

export const uint8ArrayToBase64 = (array: Uint8Array) =>
  Buffer.from(array).toString('base64');
