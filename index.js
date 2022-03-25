const express = require('express');
const fs = require('fs');
const {exec} = require('child_process');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const { nextTick } = require('process');

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

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(public));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/upload', uploads.single('file'), (req, res) => {
    if(req.file){
        console.log(req.file.path);

        var output = Date.now() + "convertall.mp3";

        exec (`ffmpeg -i ${req.file.path} -f mp3 ${subDirectory}/${output}`, (err, stdout, stderr) => {
            if(error){
                console.log(`error: ${error.message}`);
                return;
            }else{
                console.log('File Telah Terconvert!')
            res.download(output, (err) => {
                if(err)throw err

                fs.unlinkSync(req.file.path)
                fs.unlinkSync(output)

                next()


            })
        }
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})