import { useEffect, useState } from "react";

const LinkPreview = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<{
    title: string;
    description: string;
    image: string;
    origin: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let origin = "";
        const urlObj = new URL(url);
        origin = urlObj.origin;

        const res = await fetch(
          `https://api.microlink.io?url=${encodeURIComponent(url)}`
        );
        const data = await res.json();
        setMeta({
          title: data.data.title || url,
          description: data.data.description || "설명 없음",
          image: data.data.image?.url || "",
          origin,
        });
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [url]);

  if (isLoading) return null;
  if (!meta)
    return (
      <div
        style={{
          padding: "1rem",
          border: "1px solid #f44336",
          borderRadius: "4px",
          backgroundColor: "#ffebee",
          color: "#b71c1c",
          textAlign: "center",
        }}
      >
        <p>링크 프리뷰 에러</p>
        <p>
          <a
            href={url}
            style={{ color: "#b71c1c", textDecoration: "underline" }}
          >
            {`URL: ${url}`}
          </a>
        </p>
      </div>
    );

  return (
    <div
      contentEditable={false}
      role="figure"
      className="link-preview-container"
    >
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
              <source srcSet={`${meta.origin}/favicon.png`} type="image/png" />
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
  );
};

export default LinkPreview;
