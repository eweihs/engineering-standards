/** @type {import("knip").KnipConfig} */
export default {
  jest: {
    // The Nest CLI names e2e tests `*.e2e-spec.ts` and matches them with `testRegex`, which knip does not read.
    entry: ["**/*.spec.ts", "**/*.e2e-spec.ts"],
  },
};
