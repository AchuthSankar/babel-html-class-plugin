var path = require('path');

 module.exports = {
     entry: './webcomponent.js',
     mode: 'development',
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'main.bundle.js'
     },
     module: {
         rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader"
                }
            }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };