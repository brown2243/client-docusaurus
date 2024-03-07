import React from "react";
import BlogLayout from "@theme-original/BlogLayout";

// import { inject } from "@vercel/analytics";
// import { injectSpeedInsights } from "@vercel/speed-insights";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function BlogLayoutWrapper(props) {
  return (
    <>
      <BlogLayout {...props} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
