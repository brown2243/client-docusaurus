import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { GTM_ID, G_TAG_ID, PROD_URL } from "./constant";

const config: Config = {
  title: `Braurus`,
  tagline: "",
  favicon: "favicon.ico",

  // Set the production url of your site here
  url: PROD_URL,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "brown2243", // Usually your GitHub org/user name.
  projectName: "client-docusaurus", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "ko",
    locales: ["ko"],
  },

  presets: [
    [
      "classic",
      {
        googleTagManager: {
          containerId: GTM_ID,
        },
        gtag: {
          trackingID: G_TAG_ID,
          anonymizeIP: true,
        },
        docs: {
          routeBasePath: "/studies",
        },
        blog: {
          routeBasePath: "/",
          blogSidebarCount: 7,
          showReadingTime: true,
          archiveBasePath: "archive",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  // themes: ["@docusaurus/theme-search-algolia"],
  themeConfig: {
    metadata: [
      {
        name: "description",
        content: "개발 및 다양한 주제에 대해 작성하는 블로그입니다.",
      },
    ],
    algolia: {
      appId: "E4SFC6MK1N",
      apiKey: "1d930172b420be076364ff5d12e6d306",
      indexName: "braurus",
      contextualSearch: false,
      searchParameters: {},
    },
    // Replace with your project's social card
    image: "img/social-card.png",
    navbar: {
      title: "Braurus",
      logo: {
        alt: "Braurus Logo",
        src: "img/favicon/android-chrome-192x192.png",
      },
      items: [
        { to: "/studies", label: "Studies", position: "left" },
        { to: "/archive", label: "Archive", position: "left" },
        {
          href: "https://github.com/brown2243",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      // links: [
      //   {
      //     title: "Docs",
      //     items: [
      //       {
      //         label: "Tutorial",
      //         to: "/docs/intro",
      //       },
      //     ],
      //   },
      //   {
      //     title: "Community",
      //     items: [
      //       {
      //         label: "Stack Overflow",
      //         href: "https://stackoverflow.com/questions/tagged/docusaurus",
      //       },
      //       {
      //         label: "Discord",
      //         href: "https://discordapp.com/invite/docusaurus",
      //       },
      //       {
      //         label: "Twitter",
      //         href: "https://twitter.com/docusaurus",
      //       },
      //     ],
      //   },
      //   {
      //     title: "More",
      //     items: [
      //       {
      //         label: "Blog",
      //         to: "/blog",
      //       },
      //       {
      //         label: "GitHub",
      //         href: "https://github.com/brown2243/client-docusaurus",
      //       },
      //     ],
      //   },
      // ],
      copyright: `Copyright © ${new Date().getFullYear()} by brown, Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    [
      "vercel-analytics",
      {
        debug: true,
        mode: "auto",
      },
    ],

    [
      "@docusaurus/plugin-client-redirects",
      {
        // fromExtensions: ["html", "htm"], // /myPage.html -> /myPage
        // toExtensions: ["exe", "zip"], // /myAsset -> /myAsset.zip (if latter exists)
        redirects: [
          // /docs/oldDoc -> /docs/newDoc
          {
            from: "/blog/post/0",
            to: "/post/0",
          },
          {
            from: "/blog/post/1",
            to: "/post/1",
          },
          {
            from: "/blog/post/2",
            to: "/post/2",
          },
          {
            from: "/blog/post/3",
            to: "/post/3",
          },
          {
            from: "/blog/post/4",
            to: "/post/4",
          },
          {
            from: "/blog/post/5",
            to: "/post/5",
          },
          {
            from: "/blog/post/6",
            to: "/post/6",
          },
          {
            from: "/blog/post/7",
            to: "/post/7",
          },
          {
            from: "/blog/post/8",
            to: "/post/8",
          },
          {
            from: "/blog/post/9",
            to: "/post/9",
          },
          {
            from: "/blog/post/10",
            to: "/post/10",
          },
          {
            from: "/blog/post/11",
            to: "/post/11",
          },
          {
            from: "/blog/post/12",
            to: "/post/12",
          },
          {
            from: "/blog/post/13",
            to: "/post/13",
          },
          {
            from: "/blog/post/14",
            to: "/post/14",
          },
          {
            from: "/blog/post/15",
            to: "/post/15",
          },
          {
            from: "/blog/post/16",
            to: "/post/16",
          },
          {
            from: "/blog/post/17",
            to: "/post/17",
          },
          {
            from: "/blog/post/18",
            to: "/post/18",
          },
          {
            from: "/blog/post/19",
            to: "/post/19",
          },
          {
            from: "/blog/post/20",
            to: "/post/20",
          },
          {
            from: "/blog/post/21",
            to: "/post/21",
          },
          // // Redirect from multiple old paths to the new path
          // {
          //   to: "/docs/newDoc2",
          //   from: ["/docs/oldDocFrom2019", "/docs/legacyDocFrom2016"],
          // },
        ],
        // createRedirects(existingPath) {
        //   if (existingPath.includes("/community")) {
        //     // Redirect from /docs/team/X to /community/X and /docs/support/X to /community/X
        //     return [
        //       existingPath.replace("/community", "/docs/team"),
        //       existingPath.replace("/community", "/docs/support"),
        //     ];
        //   }
        //   return undefined; // Return a falsy value: no redirect created
        // },
      },
    ],
  ],
  clientModules: ["bgmInjector"],
};

export default config;
