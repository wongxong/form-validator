const path = require('path');
const fs = require('fs');

function resolve(filename) {
  return path.join(__dirname, filename);
}

module.exports = {
  mode: "production",
  // devtool: "none",
  entry: "./src/main.js",
  output: {
    library: {
      // name: "",
      type: "umd"
    },
    filename: "form-validator.min.js",
    path: resolve("./dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  // {
                  //   // 按需加载
                  //   useBuiltIns: "usage",
                  //   // 指定core-js的版本
                  //   corejs: { version: "3.15" },
                  //   // 指定兼容性做到哪个版本的浏览器
                  //   targets: {
                  //     firefox: "50",
                  //     ie: "10",
                  //     safari: "10",
                  //     edge: "17"
                  //   }
                  // }
                ]
              ]
            }
          }
        ]
      }
    ]
  }
};