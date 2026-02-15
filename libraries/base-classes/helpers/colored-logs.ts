const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
const orange = (text: string) => `\x1b[38;5;208m${text}\x1b[0m`;
const blue = (text: string) => `\x1b[34m${text}\x1b[0m`;
const purple = (text: string) => `\x1b[35m${text}\x1b[0m`;

module.exports = {
  green,
  red,
  orange,
  blue,
  purple,
};
