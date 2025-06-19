<?php
echo "Welcome to Favourite Food App, please choose language.";
echo "<br>";
echo "Murakazanga kuri Favourite Food App, hitamo ururimi.";
echo "<br>";

echo "1. English";
echo "<br>";
echo "2. Kinyarwanda";
echo "<br>";

$language = readline("Enter your choice (1 or 2): ");
if ($language == 1) {
    echo "Select the dish you like most: ";
    echo "<br>";
    echo "1. Chips and Chicken";
    echo "<br>";
    echo "2. Beef and green plantain";
    echo "<br>";
    echo "3. Rice and Beans";
    echo "<br>";
    echo "4. Cassava bread and greens";
    echo "<br>";
    $dish = readline("Enter your choice (1-4): ");
    if ($dish == 1) {
        echo "Your Favourite food is Chips and Chicken, this is so unhealthy, do not eat it reguraly.";
    } elseif ($dish == 2) {
        echo "Your Favourite food is Beef and green plantain, this is healthy, as long as you eat it less than 5 times a week.";
    } elseif ($dish == 3) {
        echo "Your Favourite food is Rice and Beans, this is healthy, as long as you drink water and eat greens.";
    } elseif ($dish == 4) {
        echo "Your Favourite food is Cassava bread and greens, this is healthy, verfiy that there is no too oil in greens.";
    } else {
        echo "Invalid choice.";
    }
} elseif ($language == 2) {
    echo "Hitamo ifunguro ukunda cyane: ";
    echo "<br>";
    echo "1. ifiriti n'inkoko";
    echo "<br>";
    echo "2. Agatogo";
    echo "<br>";
    echo "3. Umuceri n'ibishyimbo";
    echo "<br>";
    echo "4. Ubugari n'isombe";
    echo "<br>";
    $dish = readline("Andika igisubizo cyawe (1-4): ");
    if ($dish == 1) {
        echo "Ifunguro ukunda cyane ni Ifiriti n'inyama, nibyiza kubuzima igihe utarengejwe inshuro 5 mucyuru.";
    } elseif ($dish == 2) {
        echo "Ifunguro ukunda cyane ni agatogo, ni byiza, ariko ntukabirye kenshi.";
    } elseif ($dish == 3) {
        echo "Ifunguro ukunda cyane ni Umuceri n'ibishyimbo, ni byiza, ariko unywe amazi kandi urye imboga.";
    } elseif ($dish == 4) {
        echo "Ifunguro ukunda cyane ni ubugari n'isombe, ni byiza, reba ko nta mavuta menshi ari mu mboga.";
    } else {
        echo "Igisubizo kitari cyo.";
    }
} else {
    echo "Invalid language choice.";
}
