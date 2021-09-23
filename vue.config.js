const CompressionWebpackPlugin = require("compression-webpack-plugin");
module.exports = {
  lintOnSave: false,
  publicPath: "./",
  configureWebpack: config => {
    const plugins = [];

    // Begin 生成 gzip 压缩文件
    plugins.push(
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        threshold: 10240,
        minRatio: 0.8
      })
    );
    // End 生成 gzip 压缩文件

    config.plugins = [...config.plugins, ...plugins];
  }
};
