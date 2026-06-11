import { isDev } from "@/config";

const noop = () => {};

export const logger = {
  log: isDev ? console.log.bind(console) : noop,
  warn: isDev ? console.warn.bind(console) : noop,
  error: console.error.bind(console), // error 生产环境也保留
  info: isDev ? console.info.bind(console) : noop,
};