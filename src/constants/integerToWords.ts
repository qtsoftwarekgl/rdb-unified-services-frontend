import { chunk, reverse } from "lodash";

export const integerToWords = (number: number): string => {
  // return a blank string for invalid input
  if (isValidInteger(number)) {
    return "";
  }
  // handle zero and -zero as a special case
  if (Object.is(number, -0)) return "negative zero";
  if (number === 0) return "zero";

  const words = toWords(Math.abs(number));

  return number < 0 ? `negative ${words}` : words;
};

export const clampToSafeIntegerString = (numberStr: string): string => {
  const number = Number.parseInt(numberStr, 10);
  if (number > Number.MAX_SAFE_INTEGER) {
    return `${Number.MAX_SAFE_INTEGER}`;
  }
  if (number < Number.MIN_SAFE_INTEGER) {
    return `${Number.MIN_SAFE_INTEGER}`;
  }
  return numberStr;
};

const isValidInteger = (int: number): boolean =>
  !Number.isInteger(int) ||
  int > Number.MAX_SAFE_INTEGER ||
  int < Number.MIN_SAFE_INTEGER;

const toWords = (num: number) =>
  reverseAndChunkDigitsByThree(num)
    .map(mapToWordGroup)
    .map(addMagnitude)
    .filter((str) => str.length)
    .reverse()
    .join(" ");

// Converts 3 (or less) digits into a word group string
// a word group is basically describing the number below 1000
// which can then be used with a magnitude (thousand, million, etc..)
const mapToWordGroup = (
  [ones = 0, tens = 0, huns = 0]: number[],
  i: number,
  c: number[][]
): string => {
  const hundredsPlace =
    huns === 0 ? "" : zeroToNineteenNames[huns] + " hundred ";
  const tensPlace =
    ones === 0 ? tensNames[tens] : tensNames[tens] && tensNames[tens] + " ";
  const onesPlace =
    zeroToNineteenNames[parseInt(`${tens}${ones}`, 10)] ||
    zeroToNineteenNames[ones];
  // This tricky little bit is required to add the word and between the
  // hundreds place and the tens/ones place (e.g. Nine hundred and six)
  // only to the last word group (or first one passed to this function)
  const addAnAnd =
    (hundredsPlace || c.length > 1) && (tensPlace || onesPlace) && i === 0
      ? "and "
      : "";

  return [hundredsPlace, addAnAnd, tensPlace, onesPlace].join("").trim();
};

const addMagnitude = (group: string, i: number) => {
  const magnitude = magnitudeName[i];
  return magnitude === "" ? group : group ? `${group} ${magnitude}` : "";
};

const zeroToNineteenNames = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const tensNames = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
const magnitudeName = [
  "",
  "thousand",
  "million",
  "billion",
  "trillion",
  "quadrillion",
];

// Typing the pipe function proved harder than I thought, so this just
// allows you to specifiy in Generics the input and output types of
// the resulting function
const pipe =
  <T extends any, R>(firstFn: (arg: T) => any, ...fns: any[]) =>
  (arg: any): R =>
    fns.reduce((argument, fn) => fn(argument), firstFn(arg));

const splitNumberIntoDigits = (n: number): number[] =>
  `${n}`.split("").map((v) => parseInt(v, 10));

const reverseAndChunkDigitsByThree = pipe<number, number[][]>(
  splitNumberIntoDigits,
  reverse,
  (a: unknown[]) => chunk(a, 3)
);
