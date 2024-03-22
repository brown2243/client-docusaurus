import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { GTM_ID, G_TAG_ID, PROD_URL } from "./constant";

const config: Config = {
  title: `Braurus`,
  tagline: "",
  favicon: "img/favicon.ico",

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
    // defaultLocale: "ko",
    // locales: ["ko"],
    defaultLocale: "ko",
    locales: ["ko", "en"],
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
          routeBasePath: "/docs",
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
    algolia: {
      // The application ID provided by Algolia
      appId: "VOP80TT41G",
      apiKey: "54dbc01eb1f1039728b45b55263a4e18",
      indexName: "braurus",
      // Optional: see doc section below
      contextualSearch: true,
      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: "external\\.com|domain\\.com",
      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      replaceSearchResultPathname: {
        from: "/docs/", // or as RegExp: /\/docs\//
        to: "/",
      },
      // Optional: Algolia search parameters
      searchParameters: {},
      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: "search",
      //... other Algolia params
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
        { to: "/docs", label: "Docs", position: "left" },
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
};

export default config;
