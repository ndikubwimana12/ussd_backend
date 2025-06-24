const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ussd', (req, res) => {
    try {
        let { sessionId, serviceCode, phoneNumber, text } = req.body || {};
        let response = '';

        const textArray = text.split('*0');

        const step = textArray.length;

        // Step 1: Language selection
        if (text === '') {
            response = `CON Welcome! / Murakaza neza!
1. English
2. Kinyarwanda`;
        }

        // English Flow
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

                    response = `CON Your BMI is ${bmi.toFixed(1)}.
You are ${status}.
Would you like health tips?
1. Yes
2. No`;
                    break;
                case 4:
                    if (textArray[3] === '1') {
                        response = `END Health Tip:
Drink water, avoid junk food, and exercise regularly.`;
                    } else {
                        response = `END Thank you! Stay healthy.`;
                    }
                    break;
            }
        }

        // Kinyarwanda Flow
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

                    response = `CON BMI yawe ni ${bmiKin.toFixed(1)}.
${statusKin}.
Wifuza inama z’ubuzima?
1. Yego
2. Oya`;
                    break;
                case 4:
                    if (textArray[3] === '1') {
                        response = `END Inama y’ubuzima:
Kunywa amazi, wirinde ibiryo by’ifu, ujye ukora imyitozo.`;
                    } else {
                        response = `END Murakoze! Mugire ubuzima bwiza.`;
                    }
                    break;
            }
        }

        // Fallback
        else {
            response = `END Invalid option. Please try again.`;
        }

        res.set('Content-Type', 'text/plain');
        res.send(response);

    } catch (error) {
        console.error('USSD Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`USSD BMI App running on port ${PORT}`);
});
