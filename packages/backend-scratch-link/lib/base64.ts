export const base64ToUint8Array = (base64: string) => {
  const buf = Buffer.from(base64, 'base64');
  const len = buf.length;
  const array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    array[i] = buf[i];
  }
  return array;
};

export const uint8ArrayToBase64 = (array: Uint8Array) =>
  Buffer.from(array).toString('base64');
