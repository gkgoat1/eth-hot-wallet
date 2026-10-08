/*
 * "Secure" password generator
 * adapted from: https://gist.github.com/mozfreddyb/98843b728f61958f5c31e70d57d93fb8
 *
 * Behavior-preserving port of utils/crypto.js. Draws random bytes, keeps only
 * printable ASCII (33..126) to avoid modulo bias, and repeats until `len`
 * characters are collected.
 */
export default function generateString(len: number): string {
  const genString = (): string => {
    const array = new Uint8Array(len);
    window.crypto.getRandomValues(array);
    const printable = Array.from(array).filter((x) => x > 32 && x < 127);
    return String.fromCharCode(...printable);
  };
  let tmp = genString();
  while (tmp.length < len) {
    tmp += genString();
  }
  return tmp.substr(0, len);
}
