import chalk from "chalk";

export const logger = {
  info(...msg: unknown[]) {
    console.log(chalk.cyan("[INFO]"), ...msg);
  },
  error(...msg: unknown[]) {
    console.log(chalk.red("[ERROR]"), ...msg);
  },
  success(...msg: unknown[]) {
    console.log(chalk.green("[SUCCESS]"), ...msg);
  },
};
