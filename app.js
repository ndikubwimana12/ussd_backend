const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// /ussd: Favourite Food App
app.post('/ussd', (req, res) => {
    let { text } = req.body || {};
    let response = '';
    const levels = text.split('*');

    if (text === '') {
        response = `CON Welcome to Favourite Food App, please choose language.\nMurakaza neza kuri Favourite Food App, hitamo ururimi.\n1. English\n2. Kinyarwanda`;
    } else if (text === '1') {
        response = `CON Select the dish you like most:\n1. Chips and Chicken\n2. Beef and green plantain\n3. Rice and Beans\n4. Cassava bread and greens\n0. Back`;
    } else if (text === '2') {
        response = `CON Hitamo ifunguro ukunda cyane:\n1. Ifiriti n'inkoko\n2. Agatogo\n3. Umuceri n'ibishyimbo\n4. Ubugari n'isombe\n0. Gusubira inyuma`;
    } else if (text === '1*0' || text === '2*0') {
        response = `CON Welcome to Favourite Food App, please choose language.\nMurakaza neza kuri Favourite Food App, hitamo ururimi.\n1. English\n2. Kinyarwanda`;
    } else {
        switch (text) {
            case '1*1':
                response = `END Your favourite food is Chips and Chicken. This is unhealthy. Avoid eating it regularly.`; break;
            case '1*2':
                response = `END Your favourite food is Beef and green plantain. Healthy if eaten < 5x/week.`; break;
            case '1*3':
                response = `END Your favourite food is Rice and Beans. Drink water, eat greens.`; break;
            case '1*4':
                response = `END Your favourite food is Cassava bread and greens. Avoid too much oil.`; break;
            case '2*1':
                response = `END Ifunguro ukunda cyane ni Ifiriti n'inkoko. Si byiza ku buzima.`; break;
            case '2*2':
                response = `END Ifunguro ukunda cyane ni Agatogo. Ni byiza ariko ntukabirye kenshi.`; break;
            case '2*3':
                response = `END Ifunguro ukunda cyane ni Umuceri n'ibishyimbo. Nywa amazi kandi urye imboga.`; break;
            case '2*4':
                response = `END Ifunguro ukunda cyane ni Ubugari n'isombe. Reba ko isombe itarimo amavuta menshi.`; break;
            default:
                response = `END Invalid option. Please try again.`;
        }
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

// /ussd2: BMI Calculator App
app.post('/ussd2', (req, res) => {
    let { text } = req.body || {};
    let response = '';
    const levels = text.split('*');

    const step = levels.length;

    // Level 1: Language
    if (text === '') {
        response = `CON Welcome! / Murakaza neza!\n1. English\n2. Kinyarwanda`;
    }

    // English Flow
    else if (levels[0] === '1') {
        if (text === '1*0') {
            response = `CON Welcome! / Murakaza neza!\n1. English\n2. Kinyarwanda`;
        } else {
            switch (step) {
                case 1:
                    response = `CON Enter your weight in KG:\n0. Back`; break;
                case 2:
                    response = `CON Enter your height in CM:\n0. Back`; break;
                case 3:
                    const weight = parseFloat(levels[1]);
                    const heightCM = parseFloat(levels[2]);
                    if (isNaN(weight) || isNaN(heightCM)) {
                        response = `END Invalid weight or height. Please enter valid numbers.`; break;
                    }
                    const bmi = weight / ((heightCM / 100) ** 2);
                    let status = '';
                    if (bmi < 18.5) status = 'Underweight';
                    else if (bmi < 25) status = 'Normal';
                    else if (bmi < 30) status = 'Overweight';
                    else status = 'Obese';

                    response = `CON Your BMI is ${bmi.toFixed(1)}.\nYou are ${status}.\nWould you like health tips?\n1. Yes\n2. No\n0. Back`; break;
                case 4:
                    if (levels[3] === '1') {
                        response = `END Health Tip:\nDrink water, avoid junk food, and exercise regularly.`; break;
                    } else if (levels[3] === '2') {
                        response = `END Thank you! Stay healthy.`; break;
                    } else if (levels[3] === '0') {
                        response = `CON Enter your height in CM:\n0. Back`; break;
                    } else {
                        response = `END Invalid option.`; break;
                    }
            }
        }
    }

    // Kinyarwanda Flow
    else if (levels[0] === '2') {
        if (text === '2*0') {
            response = `CON Welcome! / Murakaza neza!\n1. English\n2. Kinyarwanda`;
        } else {
            switch (step) {
                case 1:
                    response = `CON Andika ibiro byawe (KG):\n0. Gusubira inyuma`; break;
                case 2:
                    response = `CON Andika uburebure bwawe (CM):\n0. Gusubira inyuma`; break;
                case 3:
                    const ibiro = parseFloat(levels[1]);
                    const uburebure = parseFloat(levels[2]);
                    if (isNaN(ibiro) || isNaN(uburebure)) {
                        response = `END Ibipimo si byo. Andika imibare nyayo.`; break;
                    }
                    const bmi = ibiro / ((uburebure / 100) ** 2);
                    let status = '';
                    if (bmi < 18.5) status = 'Ufite umubyibuho muke';
                    else if (bmi < 25) status = 'Uri muzima';
                    else if (bmi < 30) status = 'Ufite ibiro byinshi';
                    else status = 'Ufite umubyibuho ukabije';

                    response = `CON BMI yawe ni ${bmi.toFixed(1)}.\n${status}.\nWifuza inama z’ubuzima?\n1. Yego\n2. Oya\n0. Gusubira inyuma`; break;
                case 4:
                    if (levels[3] === '1') {
                        response = `END Inama:\nKunywa amazi, wirinde ibiryo bibi, ujye ukora imyitozo.`; break;
                    } else if (levels[3] === '2') {
                        response = `END Murakoze! Mugire ubuzima bwiza.`; break;
                    } else if (levels[3] === '0') {
                        response = `CON Andika uburebure bwawe (CM):\n0. Gusubira inyuma`; break;
                    } else {
                        response = `END Igisubizo si cyo.`; break;
                    }
            }
        }
    }

    else {
        response = `END Invalid option. Please try again.`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`USSD app running on port ${PORT}`);
});
