const info = require('../models/song');
const path = require('path');

const print = {
    index: (req, res) => {
        info.getAllSongs((err, results) => {
            if (err) throw err;
            res.render('index', { songs: results }); 
        });
    },

    save: (req, res) => {
        const data = req.body;

        if (req.files && req.files.image) {
            const imagePath = path.join('uploads', req.files.image[0].filename); 
            data.image_path = imagePath; 
        }

        if (req.files && req.files.file) {
            const audioPath = path.join('uploads', req.files.file[0].filename); 
            data.file_path = audioPath; 
        }

        info.save(data, (err) => {
            if (err) throw err;
            res.redirect('/'); 
        });
    }
};

module.exports = print;
