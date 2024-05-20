const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://yogayata:<password>@cluster0.eaovnqs.mongodb.net/"; // replace with your actual connection string

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function connect() {
    try {
        await client.connect();
        console.log("MongoDB Connected");
    } catch (e) {
        console.error("Error connecting to MongoDB Atlas", e);
    }
}

connect();

module.exports = client;
