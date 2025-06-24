const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware to handle POST form data from Africa's Talking
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// USSD route
app.post('/ussd', (req, res) => {
    try {
        // Read POST variables from Africa's Talking
        let {
            sessionId,
            serviceCode,
            phoneNumber,
            text,
        } = req.body || {};

        console.log("USSD request received:", req.body);

        let response = '';

        // Convert input text into an array to support multiple levels
        const textArray = text.split('*');
        const step = textArray.length;

        if (text === '') {
            response = `CON Welcome to Favourite Food App, please choose language.\nMurakaza neza kuri Favourite Food App, hitamo ururimi.\n1. English\n2. Kinyarwanda`;
        } else if (text === '1') {
            response = `CON Select the dish you like most:\n1. Chips and Chicken\n2. Beef and green plantain\n3. Rice and Beans\n4. Cassava bread and greens`;
        } else if (text === '2') {
            response = `CON Hitamo ifunguro ukunda cyane:\n1. Ifiriti n'inkoko\n2. Agatogo\n3. Umuceri n'ibishyimbo\n4. Ubugari n'isombe`;
        } else if (text === '1*1') {
            response = `END Your favourite food is Chips and Chicken. This is unhealthy. Avoid eating it regularly.`;
        } else if (text === '1*2') {
            response = `END Your favourite food is Beef and green plantain. This is healthy if eaten fewer than 5 times a week.`;
        } else if (text === '1*3') {
            response = `END Your favourite food is Rice and Beans. Drink water and eat greens to stay healthy.`;
        } else if (text === '1*4') {
            response = `END Your favourite food is Cassava bread and greens. Healthy—just make sure the greens are not too oily.`;
        } else if (text === '2*1') {
            response = `END Ifunguro ukunda cyane ni Ifiriti n'inkoko. Si byiza ku buzima. Ntukabirye buri gihe.`;
        } else if (text === '2*2') {
            response = `END Ifunguro ukunda cyane ni Agatogo. Ni byiza, ariko ntukabirye kenshi.`;
        } else if (text === '2*3') {
            response = `END Ifunguro ukunda cyane ni Umuceri n'ibishyimbo. Nywa amazi kandi urye imboga.`;
        } else if (text === '2*4') {
            response = `END Ifunguro ukunda cyane ni Ubugari n'isombe. Reba ko isombe itarimo amavuta menshi.`;
        } else {
            response = `END Invalid option. Please try again.`;
        }

        //  Correct content type and response
        res.set('Content-Type', 'text/plain');
        res.send(response);

    } catch (error) {
        console.error('Error processing USSD request:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`USSD app listening on port ${PORT}`);
});
