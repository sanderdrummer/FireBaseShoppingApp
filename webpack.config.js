var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/app.ts',
    output: {
        path: './dist/',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.less', '.css']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
            {test: /\.less$/, exclude: /node_modules/, loader:  ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')},
            {test: /\.css/, loader: 'style-loader!css-loader'}
        ]
    },
    plugins: [
        new ExtractTextPlugin('main.css'),
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: {
        //         except: ['exports', 'require']
        //     }
        // })
    ]
};
