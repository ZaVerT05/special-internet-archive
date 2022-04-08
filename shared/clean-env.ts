import { config } from "dotenv-flow";
import * as envalid from "envalid";

import { UserFriendlyError } from "./user-friendly-error";

export const cleanEnv = <T>(specs: {
  [K in keyof T]: envalid.ValidatorSpec<T[K]>;
}) => {
  config({ silent: true });

  return envalid.cleanEnv(process.env, specs, {
    reporter: ({ errors }) => {
      if (Object.keys(errors).length === 0) {
        return;
      }

      envalid.envalidErrorFormatter(errors);
      throw new UserFriendlyError();
    },
  });
};
