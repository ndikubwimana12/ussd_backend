const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const { Pool } = require('pg');
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




// BMI App with Neon DB;
const pool = new Pool({
    connectionString: 'postgresql://bmi_owner:npg_WA2l7PwsxLNg@ep-broad-surf-a8d6tuvn-pooler.eastus2.azure.neon.tech/bmi?sslmode=require',
    ssl: { rejectUnauthorized: false }
});

app.post('/ussd2', async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body || {};
    let response = '';
    const levels = text.split('*');
    const step = levels.length;

    try {
        if (text === '') {
            const prev = await pool.query(`
                SELECT bmi, status, age, weight, height, created_at
                FROM bmi_records
                WHERE session_id IN (
                    SELECT session_id FROM sessions WHERE phone_number = $1
                )
                ORDER BY created_at DESC LIMIT 1
            `, [phoneNumber]);

            if (prev.rows.length > 0) {
                response = `CON Welcome back!\n1. New BMI Check\n2. View Last BMI`;
            } else {
                response = `CON Welcome! / Murakaza neza!\n1. English\n2. Kinyarwanda`;
            }
        } else if (text === '2') {
            const last = await pool.query(`
                SELECT bmi, status, age, weight, height, created_at
                FROM bmi_records
                WHERE session_id IN (
                    SELECT session_id FROM sessions WHERE phone_number = $1
                )
                ORDER BY created_at DESC LIMIT 1
            `, [phoneNumber]);

            if (last.rows.length > 0) {
                const r = last.rows[0];
                response = `END Last BMI:\nBMI: ${r.bmi.toFixed(1)}\nStatus: ${r.status}\nWeight: ${r.weight}kg\nHeight: ${r.height}cm\nAge: ${r.age}\nDate: ${new Date(r.created_at).toLocaleDateString()}`;
            } else {
                response = `END No previous BMI record found.`;
            }
        } else if (levels[0] === '1' || levels[0] === '2') {
            const lang = levels[0] === '1' ? 'English' : 'Kinyarwanda';
            switch (step) {
                case 1:
                    response = lang === 'English' ? `CON Enter your weight in KG:\n0. Back` : `CON Andika ibiro byawe (KG):\n0. Gusubira inyuma`; break;
                case 2:
                    response = lang === 'English' ? `CON Enter your age:\n0. Back` : `CON Andika imyaka yawe:\n0. Gusubira inyuma`; break;
                case 3:
                    response = lang === 'English' ? `CON Enter your height in CM:\n0. Back` : `CON Andika uburebure bwawe (CM):\n0. Gusubira inyuma`; break;
                case 4:
                    const weight = parseFloat(levels[1]);
                    const age = parseInt(levels[2]);
                    const height = parseFloat(levels[3]);
                    if (isNaN(weight) || isNaN(age) || isNaN(height)) {
                        response = lang === 'English' ? `END Invalid input.` : `END Ibipimo si byo.`; break;
                    }

                    const bmi = weight / ((height / 100) ** 2);
                    let status = '';
                    if (bmi < 18.5) status = lang === 'English' ? 'Underweight' : 'Ufite umubyibuho muke';
                    else if (bmi < 25) status = lang === 'English' ? 'Normal' : 'Uri muzima';
                    else if (bmi < 30) status = lang === 'English' ? 'Overweight' : 'Ufite ibiro byinshi';
                    else status = lang === 'English' ? 'Obese' : 'Ufite umubyibuho ukabije';

                    await pool.query(`
                        INSERT INTO sessions (session_id, phone_number, service_code, language)
                        VALUES ($1, $2, $3, $4)
                        ON CONFLICT (session_id) DO NOTHING
                    `, [sessionId, phoneNumber, serviceCode, lang]);

                    await pool.query(`
                        INSERT INTO bmi_records (session_id, weight, height, age, bmi, status)
                        VALUES ($1, $2, $3, $4, $5, $6)
                    `, [sessionId, weight, height, age, bmi, status]);

                    response = lang === 'English'
                        ? `CON Your BMI is ${bmi.toFixed(1)}.\nYou are ${status}.\nWant health tips?\n1. Yes\n2. No\n0. Back`
                        : `CON BMI yawe ni ${bmi.toFixed(1)}.\n${status}.\nWifuza inama z’ubuzima?\n1. Yego\n2. Oya\n0. Gusubira inyuma`;
                    break;
                case 5:
                    if (levels[4] === '1') {
                        await pool.query(`UPDATE bmi_records SET tips_requested = true WHERE session_id = $1`, [sessionId]);
                        response = lang === 'English'
                            ? `END Health Tip:\nDrink water, avoid junk food, and exercise.`
                            : `END Inama:\nKunywa amazi, wirinde junk food, ujye ukora imyitozo.`;
                    } else if (levels[4] === '2') {
                        response = lang === 'English' ? `END Thank you! Stay healthy.` : `END Murakoze! Mugire ubuzima bwiza.`;
                    } else {
                        response = lang === 'English' ? `END Invalid option.` : `END Igisubizo si cyo.`;
                    }
                    break;
                default:
                    response = lang === 'English' ? `END Invalid input.` : `END Igisubizo si cyo.`;
            }
        } else {
            response = `END Invalid option.`;
        }

        res.set('Content-Type', 'text/plain');
        res.send(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('END Internal error');
    }
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`USSD app running on port ${PORT}`);
});
