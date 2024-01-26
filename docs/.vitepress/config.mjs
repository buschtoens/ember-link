import { defineConfig } from "vitepress";

import typedocSidebar from "../api/typedoc-sidebar.json";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ember-link",
  description: "Links as Primitives",
  base: "/ember-link/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guides", link: "/getting-started" },
      { text: "API", link: "/api/modules", activeMatch: "/api" },
    ],

    outline: [2, 3],

    sidebar: {
      "/": [
        {
          text: "Guides",
          items: [
            { text: "Getting Started", link: "/getting-started" },
            { text: "Installation", link: "/installation" },
            { text: "Configuration", link: "/configuration" },
            { text: "Migration", link: "/migration" },
          ],
        },
        {
          text: "Usage",
          items: [
            { text: "Using Primitives", link: "/using-primitives" },
            { text: "Params", link: "/params" },
            { text: "Behavior", link: "/behavior" },
            { text: "Link Helper", link: "/helper" },
            { text: "LinkManager Service", link: "/service" },
            { text: "Testing", link: "/testing" },
          ],
        },
        {
          text: "Advanced",
          items: [
            { text: "Customization", link: "/customization" },
            { text: "Using Locales", link: "/using-locales" },
            { text: "Link Builder", link: "/link-builder" },
            { text: "Commands", link: "/commands" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API",
          items: typedocSidebar,
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/buschtoens/ember-link" },
    ],
  },
});
