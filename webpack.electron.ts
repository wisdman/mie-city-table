import { resolve } from "path"
import {
  DefinePlugin,
  LoaderOptionsPlugin,
  ProgressPlugin,
  Configuration,
  WebpackPluginInstance,
} from "webpack"

import CopyWebpackPlugin from "copy-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"

const isProduction = process.env.NODE_ENV === "production"
const PATH = (...p: Array<string>) => resolve(__dirname, ...p)
const PKG = require(PATH("./package.json"))

export default {
  name: PKG.name,

  mode: isProduction ? "production" : "development",
  target: "electron-main",

  context: PATH("./src"),

  entry: {
    main: PATH("./src/main.js"),
  },

  resolve: {
    extensions: [".ts", ".js", ".json"],
    mainFields: ["es2015", "module", "main", "browser"],
    symlinks: true,
  },

  output: {
    path: PATH("./artifacts"),
    filename: `[name].js`,
    crossOriginLoading: false,
  },

  experiments: {
    asset: true
  },

  plugins: [
    new ProgressPlugin({}),

    new LoaderOptionsPlugin({
      debug: !isProduction,
      sourceMap: !isProduction,
      minimize: isProduction,
    }),

    new DefinePlugin({
      DEFINE_APP_NAME: JSON.stringify(PKG.name.trim()),
      DEFINE_APP_VERSION: JSON.stringify(PKG.version.trim()),
      DEFINE_DEBUG: JSON.stringify(!isProduction),
    }),

    new CopyWebpackPlugin({
      patterns: [{
        from: PATH("./package.json"),
        transform(content) {
          const input = JSON.parse(content.toString())
          const output = {...input, main: "main.js" }
          delete output.devDependencies
          delete output.scripts
          return Buffer.from(JSON.stringify(output))
        },
      }],
    }),
  ],

  optimization: {
    noEmitOnErrors: true,
    removeEmptyChunks: true,
    splitChunks: { chunks: "all" },

    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: !isProduction,
        terserOptions: {
          ecma: 2020,
          output: {
            ascii_only: true,
            comments: false,
          },
          compress: {
            passes: 3,
          },
        }
      }) as WebpackPluginInstance
    ]
  },

  performance: {
    hints: false,
  },

  node: false,
  profile: false,
  devtool: false,

  stats: "errors-warnings",

} as Configuration