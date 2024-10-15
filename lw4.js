const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// URL сайту для парсингу
const url = 'https://sport.ua/';

// Функція для отримання HTML з сайту
async function fetchData() {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (error) {
        console.error("Помилка завантаження сторінки: ", error);
    }
}

// Функція для парсингу HTML і збереження даних
async function parseAndSave() {
    const html = await fetchData();
    if (!html) return;

    const $ = cheerio.load(html);

    // Масив для збереження новин
    const newsData = [];

    // Парсинг заголовків новин (для прикладу використано селектори новин)
    $('.news__title').each((index, element) => {
        const title = $(element).text().trim();
        const link = $(element).find('a').attr('href');
        const description = $(element).next('.news__description').text().trim();

        // Додаємо новину до масиву
        newsData.push({
            title: title,
            link: link ? `https://sport.ua${link}` : '',
            description: description
        });
    });

    // Записуємо дані у файл news.json
    const filePath = path.join(__dirname, 'news.json');
    fs.writeFileSync(filePath, JSON.stringify(newsData, null, 2), 'utf-8');

    console.log("Дані успішно записані у файл news.json");
}

// Виклик функції для парсингу та збереження
parseAndSave();
