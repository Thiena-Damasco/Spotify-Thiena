const db = require('../config/db');

const songInformation = {
    save: (data, callback) => {
        const query = "INSERT INTO songs (title, artist, image_path, file_path) VALUES (?, ?, ?, ?)";
        db.query(query, [data.title, data.artist, data.image_path, data.file_path], callback);
    },
    getAllSongs: (callback) => {
        const query = "SELECT * FROM songs";
        db.query(query, callback);
    },
    update: (id, data, callback) => {
        const query = "UPDATE songs SET title = ?, artist = ?, image_path = ?, file_path = ? WHERE id = ?";
        db.query(query, [data.title, data.artist, data.image_path, data.file_path, id], callback);
    },
    delete: (id, callback) => {
        const query = "DELETE FROM songs WHERE id = ?";
        db.query(query, [id], callback);
    },
    like: (id, callback) => {
        const query = "UPDATE songs SET likes = likes + 1 WHERE id = ?";
        db.query(query, [id], callback);
    }
};

module.exports = songInformation;
