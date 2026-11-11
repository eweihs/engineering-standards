/** @type {import("knip").KnipConfig} */
export default {
  // shadcn/ui components are copied in whole; keep their full API even when only part is used.
  ignoreIssues: { "**/components/ui/**": ["exports", "types"] },
};
