import React, { memo, useEffect, useState } from "react";

const LinkPreview = ({ url }) => {
  const [meta, setMeta] = useState<{
    title: string;
    description: string;
    image: string;
    origin: string;
  } | null>(null);

  useEffect(() => {
    let origin = "";
    try {
      const urlObj = new URL(url); // URL 객체로 파싱
      origin = urlObj.origin;
    } catch (error) {}

    fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        setMeta({
          title: data.data.title || url,
          description: data.data.description || "설명 없음",
          image: data.data.image?.url || "",
          origin,
        });
      });
  }, [url]);

  if (!meta) return null;

  return (
    <div
      contentEditable={false}
      role="figure"
      className="link-preview-container"
    >
      <div className="link-preview-flex">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-preview-card"
        >
          <div className="link-preview-content">
            <div className="link-preview-title">{meta.title}</div>
            <div className="link-preview-description">{meta.description}</div>
            <div className="link-preview-footer">
              <picture className="link-preview-favicon">
                <source
                  srcSet={`${meta.origin}/favicon.ico`}
                  type="image/x-icon"
                />
                <source
                  srcSet={`${meta.origin}/favicon.png`}
                  type="image/png"
                />
                <img src="./favicon.ico" alt="favicon" />
              </picture>

              <span className="link-preview-url">{url}</span>
            </div>
          </div>
          {meta.image && (
            <div className="link-preview-image-container">
              <img
                src={meta.image}
                alt={meta.title}
                className="link-preview-image"
              />
            </div>
          )}
        </a>
      </div>
    </div>
  );
};

export default LinkPreview;
