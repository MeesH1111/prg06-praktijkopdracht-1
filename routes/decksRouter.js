import {Router} from "express"
import Deck from "../models/DeckSchema.js"
import { faker } from "@faker-js/faker"
import DecksRouter from "./decksRouter.js";


const decksRouter = new Router()

const validateFields = (req, res, next) => {
    const { title, size, price, body } = req.body

    if (!title || !size || !price || !body ) {
        return res.status(400).json({error: 'Alle velden moeten ingevuld zijn'})
    }
    // Ook hier moet nog price bij, maar met checker werkt dat niet omdat het een Number is (DeckSchema). Dit later veranderen!
    next();
}

decksRouter.get('/decks', async (req, res) => {
    const decks = await Deck.find({});
    res.json(
        {
        "items": decks,
        "_links": {
            "self": {
                "href": `${process.env.LOCALURL}`
            },
            "collection": {
                "href": `${process.env.LOCALURL}`
            }
        }
    })

    //


});


decksRouter.get('/decks/:id', async (req, res) => {
    const id = req.params.id
    const deck = await Deck.findById(id)
    if (!deck) {
        return res.status(404).json({message: 'Deck does not exist'})
    }
    res.json(deck)
});
// Body (DeckSchema) pas meesturen als je de details wilt laten zien

decksRouter.post('/decks/seed/:number', async (req, res) => {
    await Deck.deleteMany({});
    const number = req.params.number
    for (let i = 0; i < number; i++) {
        let deck = new Deck({
            title: faker.lorem.slug(),
            price: faker.number.int(),
            size: faker.number.int(),
            body: faker.lorem.text(),
        })

        await deck.save()
    }

    res.json({
        message: 'Note seeded'
    })
});

decksRouter.post('/decks', validateFields, async (req, res) => {
    const { title, price, size, body } = req.body

    const deck = new Deck({
        title,
        price,
        size,
        body,
    })

    const savedDeck = await deck.save()
    res.status(201).json({ savedDeck })

    console.log(req.body);
});

decksRouter.put('/decks/:id', validateFields, async (req, res) => {
    try {
        const { title, price, size, body } = req.body;
        const id = req.params.id;
        const deckToUpdate = await Deck.findById(id);

        if (!deckToUpdate) {
            return res.status(404).json({ message: "Deck not found" });
        }

        deckToUpdate.title = title;
        deckToUpdate.price = price;
        deckToUpdate.size = size;
        deckToUpdate.body = body;

        const updateDeck = await deckToUpdate.save();
        res.status(200).json({ updateDeck });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

decksRouter.delete('/decks/:id', async (req, res) => {
    const id = req.params.id
    try {
        const deletedDeck = await Deck.findByIdAndDelete(id);

        if (!deletedDeck) {
            return res.status(404).json({ error: 'Deck not found' });
        } else {
            res.status(204).json({ message: 'Deck deleted successfully', note: deletedDeck });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the deck' });
    }
});

decksRouter.options('/decks', async (req, res) => {
    // const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    // res.json(`Allowed methods: ${allowedMethods}`);

    res.setHeader('Allow', 'GET, POST, OPTIONS')
    res.status(204).send()
})

decksRouter.options('/decks/:id', async (req, res) => {
    // const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    // res.json(`Allowed methods: ${allowedMethods}`);

    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS')
    res.status(204).send()

})





export default decksRouter;