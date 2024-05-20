const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.error('Database connection failed:', err.stack);
});

// Define Mongoose schema and models
const Schema = mongoose.Schema;

// Example schema for login
const loginSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    phone: String,
    password: String,
    role: String
});

const Login = mongoose.model('Login', loginSchema);

// Example schema for property
const propertySchema = new Schema({
    name: String,
    desci: String,
    beds: Number,
    baths: Number,
    places: String,
    location: String,
    seller_id: Schema.Types.ObjectId
});

const Property = mongoose.model('Property', propertySchema);

// Routes

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/data/login', (req, res) => {
    Login.find()
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.put('/api/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, beds, baths, placesNearby, location } = req.body;

    Property.findByIdAndUpdate(id, {
        name,
        desci: description,
        beds,
        baths,
        places: placesNearby,
        location
    })
    .then(() => {
        res.send('Property updated successfully');
    })
    .catch(error => {
        console.error('Error updating property:', error);
        res.status(500).send('Server error');
    });
});

app.post('/api/data', (req, res) => {
    const { firstName, lastName, email, phone, password, role } = req.body;

    const newLogin = new Login({
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
        password: password,
        role: role
    });

    newLogin.save()
        .then(result => {
            res.json({ message: 'Data inserted successfully', id: result._id });
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.post('/api/data/login1', (req, res) => {
    const { email, password } = req.body;

    Login.findOne({ email, password })
        .then(result => {
            if (result) {
                res.json({ message: 'Login successful', user: result });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.post('/api/property', (req, res) => {
    const { name, description, beds, baths, placesNearby, location, sellerId } = req.body;

    console.log(sellerId);
    const newProperty = new Property({
        name,
        desci: description,
        beds,
        baths,
        places: placesNearby,
        location,
        seller_id: sellerId
    });

    newProperty.save()
        .then(result => {
            res.json({ message: 'Data inserted successfully', id: result._id });
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.get('/api/properties', (req, res) => {
    Property.find()
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.get('/api/properties/:pid', (req, res) => {
    const { pid } = req.params;

    Property.findById(pid)
        .then(result => {
            console.log(result);
            res.json(result);
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.get('/api/sellers/:pid', (req, res) => {
    const { pid } = req.params;

    Property.findById(pid)
        .then(property => {
            if (!property) {
                return res.status(404).json({ error: 'Property not found' });
            }

            return Login.findById(property.seller_id);
        })
        .then(seller => {
            if (!seller) {
                return res.status(404).json({ error: 'Seller details not found' });
            }

            res.json(seller);
        })
        .catch(err => {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.delete('/api/properties/:id', (req, res) => {
    const propertyId = req.params.id;

    Property.findByIdAndDelete(propertyId)
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: 'Property not found' });
            }

            res.status(200).json({ message: 'Property deleted successfully' });
        })
        .catch(err => {
            console.error('Error deleting property:', err.stack);
            res.status(500).json({ message: 'Error deleting property' });
        });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
