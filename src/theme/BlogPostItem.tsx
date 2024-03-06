import React from "react";
import OriginalBlogPostItem from "@theme-original/BlogPostItem";
import { useLocation } from "@docusaurus/router";
import Comment from "@site/src/components/Comment";

const BASIC_PATH = "/";
function BlogPostItem(props) {
  const { pathname } = useLocation();
  const isBasicPath = BASIC_PATH === pathname;

  return (
    <>
      <OriginalBlogPostItem {...props} />
      {!isBasicPath && <Comment />}
    </>
  );
}

export default BlogPostItem;
