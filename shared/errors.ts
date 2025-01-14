import chalk from "chalk";

export class UserFriendlyError extends Error {}

export class AbortError extends Error {
  constructor() {
    super();
  }
}

export class EarlyExitError extends Error {
  constructor() {
    super();
  }
}

if (typeof process !== "undefined") {
  process.on("uncaughtException", (error) => {
    if (
      error instanceof AbortError ||
      error instanceof EarlyExitError ||
      error instanceof UserFriendlyError
    ) {
      if (error.message) {
        // eslint-disable-next-line no-console
        console.log(chalk.red(error.message));
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    process.exit(1);
  });
}

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return `${error as string}`;
};
