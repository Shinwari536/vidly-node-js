const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

module.exports = function (app) {
    app.use(helmet());
    app.use(morgan('tiny'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/uploads', express.static('./uploads')) // to allow to view/download image/file
}