const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

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
  ["dist", "production", "build", "development"],
  {
    root: __dirname,
    verbose: false,
  }
);

module.exports = [
  {
    mode: ENV === "production" ? "production" : "none",
    entry: {
      background: `${__dirname}/backgroundscripts/background.js`,
      popup: `${__dirname}/popup/popup.js`
    },
    optimization: {
      minimizer: [
        new UglifyJSPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true,
              if_return: true,
              collapse_vars: true,
              reduce_vars: true,
            },
            minimize: true,
            output: {
              comments: false,
            },
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          options: { presets: ["es2015", "stage-0"] },
        },
      ],
    },
    plugins: [cleanPlugin, copyPlugin],
    output: {
      filename: "[name].js",
      path: `${__dirname}/${ENV}/assets/`,
    },
  },
];
