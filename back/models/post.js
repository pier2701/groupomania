// importer le module mongoose qui va créer un model "schema" pour structurer notre doc/schema
const mongoose = require("mongoose");

// on importe le module qui interprètera les erreurs en http, ainsi que les codes appropriés
const MongooseErrors = require("mongoose-errors");

// contruction du "schema" pour notre model réutilisable
const PostSchema = mongoose.Schema(
    {
        userId: { type: String, required: true, },
        message: { type: String, trim: true, maxlength: 400 },
        imageUrl: { type: String },
        likers: { type: [String], required: true },
        comments: {
            type: [{
                commenterId: String,
                commenterPseudo: String,
                text: String,
                timestamp: Number,
            }], required: true
        }
    },
    {
        timestamps: true
    }
);

PostSchema.plugin(MongooseErrors);

// on exporte le model pour l'utliser, 1er argument 'post' (nom du model), 2ème argument PostSchema (model/schema)
module.exports = mongoose.model('post', PostSchema);
