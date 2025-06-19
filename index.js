const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    console.log("Welcome to Favourite Food App, please choose language.");
    console.log("<br>");
    console.log("Murakazanga kuri Favourite Food App, hitamo ururimi.");
    console.log("<br>");

    console.log("1. English");
    console.log("<br>");
    console.log("2. Kinyarwanda");
    console.log("<br>");

    const language = await askQuestion("Enter your choice (1 or 2): ");

    if (language == 1) {
        console.log("Select the dish you like most: ");
        console.log("<br>");
        console.log("1. Chips and Chicken");
        console.log("<br>");
        console.log("2. Beef and green plantain");
        console.log("<br>");
        console.log("3. Rice and Beans");
        console.log("<br>");
        console.log("4. Cassava bread and greens");
        console.log("<br>");

        const dish = await askQuestion("Enter your choice (1-4): ");

        if (dish == 1) {
            console.log("Your Favourite food is Chips and Chicken, this is so unhealthy, do not eat it reguraly.");
        } else if (dish == 2) {
            console.log("Your Favourite food is Beef and green plantain, this is healthy, as long as you eat it less than 5 times a week.");
        } else if (dish == 3) {
            console.log("Your Favourite food is Rice and Beans, this is healthy, as long as you drink water and eat greens.");
        } else if (dish == 4) {
            console.log("Your Favourite food is Cassava bread and greens, this is healthy, verfiy that there is no too oil in greens.");
        } else {
            console.log("Invalid choice.");
        }
    } else if (language == 2) {
        console.log("Hitamo ifunguro ukunda cyane: ");
        console.log("<br>");
        console.log("1. ifiriti n'inkoko");
        console.log("<br>");
        console.log("2. Agatogo");
        console.log("<br>");
        console.log("3. Umuceri n'ibishyimbo");
        console.log("<br>");
        console.log("4. Ubugari n'isombe");
        console.log("<br>");

        const dish = await askQuestion("Andika igisubizo cyawe (1-4): ");

        if (dish == 1) {
            console.log("Ifunguro ukunda cyane ni Ifiriti n'inyama, nibyiza kubuzima igihe utarengejwe inshuro 5 mucyuru.");
        } else if (dish == 2) {
            console.log("Ifunguro ukunda cyane ni agatogo, ni byiza, ariko ntukabirye kenshi.");
        } else if (dish == 3) {
            console.log("Ifunguro ukunda cyane ni Umuceri n'ibishyimbo, ni byiza, ariko unywe amazi kandi urye imboga.");
        } else if (dish == 4) {
            console.log("Ifunguro ukunda cyane ni ubugari n'isombe, ni byiza, reba ko nta mavuta menshi ari mu mboga.");
        } else {
            console.log("Igisubizo kitari cyo.");
        }
    } else {
        console.log("Invalid language choice.");
    }

    rl.close();
}

main().catch(console.error);