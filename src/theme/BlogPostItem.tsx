import React from "react";
import OriginalBlogPostItem from "@theme-original/BlogPostItem";
import Comment from "@site/src/components/Comment";

function BlogPostItem(props) {
  return (
    <>
      <OriginalBlogPostItem {...props} />
      <Comment />
    </>
  );
}

export default BlogPostItem;
