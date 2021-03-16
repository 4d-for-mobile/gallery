var path = require("path");
var webpack = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/dist/",
        filename: "build.js"
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        scss: ["vue-style-loader", "css-loader", "sass-loader"],
                        sass: ["vue-style-loader", "css-loader", "sass-loader"]
                    }
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]?[hash]"
                }
            },
            {
                test: /\.(woff)$/,
                loader: "file-loader",
                options: {
                    name: "../node_modules/@primer/css/fonts/[name].[ext]?[hash]"
                }
            },
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    {
                        "loader": "css-loader",
                        "options": { "url": false } // to fix bug : or we receive boolean as string
                    }
                ]
            },
            {
                test: /\.(sass|scss)$/,
                use: [{
                        "loader": "vue-style-loader"
                    },
                    {
                        "loader": "css-loader",
                        "options": { "url": false } // to fix bug : or we receive boolean as string
                    },
                    {
                        "loader": "sass-loader",
                        options: {
                            sassOptions: {
                                includePaths: [ // to find primer scss files
                                    path.resolve(__dirname, '.'),
                                    path.join(path.dirname(module.filename), 'node_modules')
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js"
        },
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        writeToDisk: true
    },
    performance: {
        hints: false
    },
    optimization: {
        moduleIds: 'deterministic'
    },
    devtool: "eval-source-map"
};

module.exports.plugins = (module.exports.plugins || []).concat([
    new VueLoaderPlugin()
]);

if (process.env.NODE_ENV === "production") {
    module.exports.devtool = "#source-map";
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: '"production"'
            }
        })
    ]);


    module.exports.devtool = "eval-source-map";
}