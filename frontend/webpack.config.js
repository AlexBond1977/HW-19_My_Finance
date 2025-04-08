// Импорт зависимостей:
// - **`path`**: Встроенный модуль Node.js для работы с путями файловой системы.
// - **`HtmlWebpackPlugin`**: Плагин, который упрощает создание HTML-файлов для вашего приложения,
// инжектируя в него сгенерированные скрипты и стили.
// - **`CopyPlugin`**: Плагин для копирования файлов и директорий в папку сборки (например, в `dist`).
// - **`autoprefixer`**: Плагин PostCSS, который автоматически добавляет вендорные префиксы
// для CSS-свойств, обеспечивая поддержку различных браузеров.
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const autoprefixer = require('autoprefixer');

// Конфигурация Webpack экспортируется с помощью объекта, содержащего следующие параметры:
module.exports = {
    // Указывает, из какого файла начинать сборку приложения. В данном случае это `app.js`, расположенный в папке `src`.
    entry: './src/app.js',
    // Указывает режим сборки. Значение `'development'` включает функции для упрощенной отладки и вывода сообщений об ошибках.
    mode: 'development',
    // Выходные данные
    output: {
        // Имя итогового файла (в данном случае `app.js`), который будет сгенерирован.
        filename: 'app.js',
        // Путь к папке, куда будет сохранен сгенерированный файл. Используется `path.resolve(__dirname, 'dist')` для указания абсолютного пути.
        path: path.resolve(__dirname, 'dist'),
        // Указывает базовый путь, используемый для всех ресурсов. Здесь это `'/'`, что означает корневую директорию.
        publicPath: '/'
    },
    // Настройки сервера разработки
    devServer: {
        // Указывает папку для статических файлов, которые будут обслуживаться сервером (в данном случае `public`).
        static: {
            directory: path.join(__dirname, 'public'),
        },
        // Включает сжатие для лучшей производительности.
        compress: true,
        // Порт, на котором будет запущен сервер (9000).
        port: 9000,
        // Используется для поддержки HTML5 History API. Это позволяет браузеру корректно обрабатывать навигацию.
        historyApiFallback: true
    },
    // Условия загрузки модулей
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
    // Список плагинов, которые расширяют функциональность Webpack.
    plugins: [
        // Создает HTML-файл, добавляя все определить скрипты и ссылки на стили.
        // В данном случае используется файл `index.html` как шаблон.
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        // Копирует файлы и папки из одного места в другое. В примере указаны несколько путей, которые будут копироваться в выходную директорию
        // (например, изображения, шрифты и другие статические файлы).
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