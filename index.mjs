const express = require('express');
const fs = require('fs');
const {exec} = require('child_process');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express()

var public = 'public';
var subDirectory = 'public/uploads'

if(!fs.existsSync(public)){
    fs.mkdirSync(public);
    fs.mkdirSync(subDirectory)
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, subDirectory)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})

var uploads = multer({
    storage: storage
})