module.exports = {
    plugins: [
        require("postcss-import"),
        require("cssnano"),
        require("postcss-preset-env"),
        require("postcss-normalize"),
    ],
};
