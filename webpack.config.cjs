const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    extensionAlias: {
      '.js': ['.ts'],
    },
    extensions: [".ts"],
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist"),
    module: true,
    chunkFormat: "module"
  },
};
