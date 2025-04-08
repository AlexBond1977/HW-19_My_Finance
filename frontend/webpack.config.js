const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const autoprefixer = require('autoprefixer');

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: () => [
                                    autoprefixer
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/img", to: "img"},
                {from: "./node_modules/@fortawesome/fontawesome-free/webfonts", to: "webfonts"},
                {from: "./node_modules/@fortawesome/fontawesome-free/css/all.min.css", to: "css"},
                {from: "./node_modules/jquery/dist/jquery.min.js", to: "js"},
                {from: "./node_modules/jquery-ui/dist/jquery-ui.min.js", to: "js"},
                {from: "./node_modules/jquery-ui/dist/themes/base/jquery-ui.min.css", to: "css"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "js"},
                {from: "./node_modules/bootstrap-datetime-picker/css/bootstrap-datetimepicker.min.css", to: "css"},
                {from: "./node_modules/tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css", to: "css"},
                {from: "./node_modules/tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js", to: "js"},
                {from: "./node_modules/moment/moment.js", to: "js"},
                {from: "./node_modules/moment/locale/ru.js", to: "js/moment-ru-locale.js"},
                {from: "./node_modules/bootstrap-datetime-picker/js/bootstrap-datetimepicker.min.js", to: "js"},
                {from: "./node_modules/bootstrap-datetime-picker/js/locales/bootstrap-datetimepicker.ru.js", to: "js"},
                {from: "./node_modules/chart.js/dist/chart.umd.js", to: "js"},
            ],
        })
    ],
};