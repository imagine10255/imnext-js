require('dotenv').config();
const path = require('path');
const DotEnv = require('dotenv-webpack');
const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');
const withFonts = require('next-fonts');
const webpackConfig = require('./webpack.config');

// https://github.com/zeit/next.js/issues/5509#issuecomment-432456576
const generateLocalePath = defaultPathMap => {
    const pathMap = {};
    const allLanguage = ['en', 'cn'];

    Object.entries(defaultPathMap).forEach(([key, value]) => {
        pathMap[key] = value;

        allLanguage.forEach(language => {
            pathMap[`/${language}${key}`] = {...value, query: {language}};
        });
    });
};

const nextConfig = {
    poweredByHeader: false,
    exportTrailingSlash: false,
    assetPrefix: process.env.ROUTE_PREFIX_PATH || '',
    publicRuntimeConfig: {
        assetPrefix: process.env.ROUTE_PREFIX_PATH || '',
    },
    enableSvg: true,

    webpack: config => {
        config.node = {
            fs: 'empty',
        };

        config.plugins = [
            ...config.plugins,

            // Read the .env file
            new DotEnv({
                path: path.join(__dirname, '.env'),
                systemvars: true,
            }),
        ];

        config.module.rules = [
            ...config.module.rules,
            // setting your custom rules...
        ];

        // 附加 webpack.config 的 alias 別名路徑設定
        config.resolve.alias = Object.assign(config.resolve.alias, webpackConfig.resolve.alias);

        return config;
    },
};

module.exports = withPlugins(
    [withCss, withSass, withFonts],
    nextConfig
);
