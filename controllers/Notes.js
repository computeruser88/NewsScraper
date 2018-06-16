const Note = require("../models/Note");

module.exports = {
    get: function (data, callback) {
        Note.find({
            _headlineId: data._headlineId
        }, callback);
    },
    save: function (data, callback) {
        const newNote = {
            _headlineId: data._id,
            noteText: data.noteText
        };

        Note.create(newNote, function(error, doc) {
            if (error) {
                console.log(error);
            } else {
                console.log(doc);
                callback(doc);
            }
        });
    },
    delete: function(data, callback) {
        Note.remove({
            _id: data._id
        }, callback);
    }
};