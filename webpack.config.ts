import typescriptIsTransformer from "typescript-is/lib/transform-inline/transformer";
import config from "config";
import webpack from "webpack";
import path from "path";
import WebpackShellPluginNext from "webpack-shell-plugin-next";

const {
  NODE_ENV = "production",
} = process.env;

module.exports = {
  entry: "./src/index.ts",
  watch: NODE_ENV === "development",
  mode: NODE_ENV,
  target: "node",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js"
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({ CONFIG: JSON.stringify(config) }),
    new WebpackShellPluginNext({
      onBuildEnd:{
        scripts: ["npm run dev:run"],
        blocking: false,
        parallel: true
      }
    })
  ],
  module: {
      rules: [
        {
          use: {
            loader: "ts-loader",
            options: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              getCustomTransformers: (program: any) => ({
                before: [typescriptIsTransformer(program)],
              }),
            },
          },
          exclude: /node_modules/,
        }
      ]
    }
};