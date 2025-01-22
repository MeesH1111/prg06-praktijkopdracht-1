import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema({
    title: {type: String,},
    price: {type: Number,},
    size: {type: Number,},
    body: {type: String,},
    // Size moet eigenlijk Number zijn maar dan werkt de checker niet. Dit later veranderen!
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {

            ret._links = {
                self: {
                    href: `${process.env.LOCALURL}/${ret._id}`
                },
                collection: {
                    href: `${process.env.LOCALURL}`
                }
            }

            delete ret._id
        }
    }
});
const DeckSchema = mongoose.model('Note', deckSchema);

export default DeckSchema;