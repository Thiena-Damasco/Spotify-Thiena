const express = require('express');
const multer = require('multer');
const path = require('path');
const songInformation = require('../models/song');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

router.use('/uploads', express.static('uploads'));

router.get('/', (req, res) => {
    songInformation.getAllSongs((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving songs');
        }
        res.render('index', { songs: results }); 
    });
});

router.post('/save-song', upload.fields([{ name: 'image' }, { name: 'file' }]), (req, res) => {
    const { title, artist } = req.body;
    const image_path = req.files['image'] ? req.files['image'][0].path : null;
    const file_path = req.files['file'][0].path;

    songInformation.save({ title, artist, image_path, file_path }, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving song data');
        }
        res.redirect('/'); 
    });
});

router.get('/update-song/:id', (req, res) => {
    const id = req.params.id;
    songInformation.getAllSongs((err, songs) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving songs');
        }
        const songToUpdate = songs.find(song => song.id == id);
        if (!songToUpdate) {
            return res.status(404).send('Song not found');
        }
        res.render('update', { song: songToUpdate }); 
    });
});

router.post('/update-song/:id', upload.fields([{ name: 'image' }, { name: 'file' }]), (req, res) => {
    const id = req.params.id;
    const { title, artist } = req.body;
    const image_path = req.files['image'] ? req.files['image'][0].path : null;
    const file_path = req.files['file'] ? req.files['file'][0].path : null; 

    songInformation.update(id, { title, artist, image_path, file_path }, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating song data');
        }
        res.redirect('/'); 
    });
});


router.post('/delete-song/:id', (req, res) => {
    const id = req.params.id;
    songInformation.delete(id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting song');
        }
        res.redirect('/'); 
    });
});

router.post('/like-song/:id', (req, res) => {
    const id = req.params.id;
    songInformation.like(id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error liking song');
        }
        res.redirect('/'); 
    });
});

module.exports = router;
