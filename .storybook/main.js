/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(viteConfig, { configType }) {
    if (configType === "PRODUCTION") {
      viteConfig.base = "/storybook/";
    }

    return viteConfig;
  },
};

export default config;
