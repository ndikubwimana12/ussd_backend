const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route 1: Favourite Food USSD app
app.post('/ussd', (req, res) => {
    try {
        let { sessionId, serviceCode, phoneNumber, text } = req.body || {};
        console.log("Request to /ussd:", req.body);

        let response = '';
        const textArray = text.split('*');

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

        res.set('Content-Type', 'text/plain');
        res.send(response);

    } catch (error) {
        console.error('Error in /ussd:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route 2: BMI Calculator USSD app
app.post('/ussd2', (req, res) => {
    try {
        let { sessionId, serviceCode, phoneNumber, text } = req.body || {};
        console.log("Request to /ussd2:", req.body);

        let response = '';
        const textArray = text.split('*0');
        const step = textArray.length;

        // Language selection
        if (text === '') {
            response = `CON Welcome To BMI Application! /\n Murakaza neza Kuri BMI Application!\n1. English\n2. Kinyarwanda`;
        }
        // English
        else if (textArray[0] === '1') {
            switch (step) {
                case 1:
                    response = `CON Enter your weight in KG:`;
                    break;
                case 2:
                    response = `CON Enter your height in CM:`;
                    break;
                case 3:
                    const weight = parseFloat(textArray[1]);
                    const heightCM = parseFloat(textArray[2]);
                    const heightM = heightCM / 100;
                    const bmi = weight / (heightM * heightM);
                    let status = '';

                    if (bmi < 18.5) status = 'Underweight';
                    else if (bmi < 25) status = 'Normal';
                    else if (bmi < 30) status = 'Overweight';
                    else status = 'Obese';

                    response = `CON Your BMI is ${bmi.toFixed(1)}.\nYou are ${status}.\nWould you like health tips?\n1. Yes\n2. No`;
                    break;
                case 4:
                    response = textArray[3] === '1'
                        ? `END Health Tip:\nDrink water, avoid junk food, and exercise regularly.`
                        : `END Thank you! Stay healthy.`;
                    break;
            }
        }
        // Kinyarwanda
        else if (textArray[0] === '2') {
            switch (step) {
                case 1:
                    response = `CON Andika ibiro byawe (KG):`;
                    break;
                case 2:
                    response = `CON Andika uburebure bwawe (CM):`;
                    break;
                case 3:
                    const ibiro = parseFloat(textArray[1]);
                    const uburebureCM = parseFloat(textArray[2]);
                    const uburebureM = uburebureCM / 100;
                    const bmiKin = ibiro / (uburebureM * uburebureM);
                    let statusKin = '';

                    if (bmiKin < 18.5) statusKin = 'Ufite umubyibuho muke';
                    else if (bmiKin < 25) statusKin = 'Uri muzima';
                    else if (bmiKin < 30) statusKin = 'Ufite ibiro byinshi';
                    else statusKin = 'Ufite umubyibuho ukabije';

                    response = `CON BMI yawe ni ${bmiKin.toFixed(1)}.\n${statusKin}.\nWifuza inama z’ubuzima?\n1. Yego\n2. Oya`;
                    break;
                case 4:
                    response = textArray[3] === '1'
                        ? `END Inama y’ubuzima:\nKunywa amazi, wirinde ibiryo by’ifu, ujye ukora imyitozo.`
                        : `END Murakoze! Mugire ubuzima bwiza.`;
                    break;
            }
        }
        else {
            response = `END Invalid option. Please try again.`;
        }

        res.set('Content-Type', 'text/plain');
        res.send(response);

    } catch (error) {
        console.error('Error in /ussd2:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`USSD app running on port ${PORT}`);
});
