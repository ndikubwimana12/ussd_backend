const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ussd', (req, res) => {
    // Read the variables sent via POST from our API
    const {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    } = req.body || {};

    let response = '';

    if (text == '') {
        // This is the first request. Note how we start the response with CON
        response = `COM Welcome to Favourite Food App, please choose language.
        Murakaza neza kuri Favourite Food App, hitamo ururimi.
        1. English
        2. Kinyarwanda`;
    } else if (text == '1') {
        // Business logic for first level response
        response = `CON Select the dish you like most:
        1.Chips and Chicken
        2.Beef and green plantain
        3.Rice and Beans
        4.Cassava bread and greens
        `;
    }
    else if (text == '2') {
        // Business logic for first level response
        response = `CON Hitamo ifunguro ukunda cyane:
        1.Ifiriti n'inkoko
        2.Agatogo
        3.Umuceri n'ibishyimbo
        4.Ubugari n'isombe
        `;
    } else if (text == '1*1') {

        response = `END Your Favourite food is Chips and Chicken, this is so unhealthy, do not eat it reguraly.`;
    } else if (text == '1*2') {

        response = `END Your Favourite food is Beef and green plantain, this is healthy, as long as you eat it less than 5 times a week.`;
    }
    else if (text == '1*3') {

        response = `END Your Favourite food is Rice and Beans, this is healthy, as long as you drink water and eat greens.`;
    }
    else if (text == '1*4') {

        response = `END Your Favourite food is Cassava bread and greens, this is healthy, verfiy that there is no too oil in greens.`;
    }
    else if (text == '2*1') {

        response = `END Ifunguro ukunda cyane ni Ifiriti n'inyama, nibyiza kubuzima igihe utarengejwe inshuro 5 mucyuru.`;
    }
    else if (text == '2*2') {

        response = `END Ifunguro ukunda cyane ni agatogo, ni byiza, ariko ntukabirye kenshi.`;
    }
    else if (text == '2*3') {

        response = `END Ifunguro ukunda cyane ni Umuceri n'ibishyimbo, ni byiza, ariko unywe amazi kandi urye imboga.`;
    }
    else if (text == '2*4') {

        response = `END Ifunguro ukunda cyane ni ubugari n'isombe, ni byiza, reba ko nta mavuta menshi ari mu mboga.`;
    }
    else {

        response = `END Invalid option. Please try again.`;
    }

    // Send the response back to the API
    res.set('Content-Type: text/plain');
    res.send(response);


});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`USSD app listening on port ${PORT}`);
});