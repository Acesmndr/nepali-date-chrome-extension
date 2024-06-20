const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const ENV = process.env.NODE_ENV;
const BROWSER = process.env.BROWSER;
const packageJSON = require("./package.json");

const CHROME_ICONS = {
  from: "./src/chrome-icons/",
  to: "icons/",
};
const FIREFOX_ICONS = {
  from: "./src/firefox-icons/",
  to: "icons/",
};
const POPUP = {
  from: "./popup/popup.html",
  to: "../assets/",
}
const ICONS = BROWSER === "chrome" ? CHROME_ICONS : FIREFOX_ICONS;
const copyPlugin = new CopyWebpackPlugin({
  patterns: [
    {
      from: "./src/manifest.json",
      transform: (content) => {
        const manifestJSON = JSON.parse(content.toString());
        return JSON.stringify(
          Object.assign({}, manifestJSON, { version: packageJSON.version }),
          null,
          " "
        );
      },
      to: "../",
    },
    ICONS,
    POPUP
  ],
});
const cleanPlugin = new CleanWebpackPlugin(
  {
    root: __dirname,
    cleanOnceBeforeBuildPatterns: ["dist/**", "production/**", "build/**", "development/**"],
  }
);

module.exports = [
  {
    mode: ENV === "production" ? "production" : "none",
    entry: {
      serviceWorker: `${__dirname}/serviceWorker/worker.js`,
      popup: `${__dirname}/popup/popup.js`
    },

    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          use: ['babel-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [cleanPlugin, copyPlugin],
    output: {
      filename: "[name].js",
      path: `${__dirname}/${ENV}/assets/`,
      clean: true,
    },
  },
];
