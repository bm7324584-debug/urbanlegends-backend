const mongoose = require("mongoose");

const multimediaSchema = new mongoose.Schema({

    titulo: {
        type: String,
        required: true,
        trim: true
    },

    descripcion: {
        type: String,
        default: ""
    },

    tags: [{
        type: String
    }],

    imagenUrl: {
        type: String,
        required: true
    },

    audioUrl: {
        type: String,
        required: true
    },

    fechaCreacion: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Multimedia", multimediaSchema);