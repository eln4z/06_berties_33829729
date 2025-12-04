const express = require("express");
const router = express.Router();
const request = require("request");

router.get('/', function(req, res, next) {
    res.render('index.ejs', {
        shopData: req.app.locals.shopData
    });
});

router.get('/about', function(req, res, next) {
    res.render('about.ejs', {
        shopData: req.app.locals.shopData
    });
});

router.get('/books/addbook', function(req, res, next) {
    res.render('addbook.ejs', {
        shopData: req.app.locals.shopData
    });
});

router.post('/books/bookadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    // execute sql query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send(' This book is added to database, name: ' +
                     req.body.name + ' price ' + req.body.price);
        }
    });
});

//  WEATHER ROUTE

router.get('/weather', function (req, res, next) {
    let city = req.query.city || 'London';

    let apiKey = 'YOUR_OPENWEATHERMAP_API_KEY_HERE';

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            return next(err);
        }

        let weather;
        try {
            weather = JSON.parse(body);
        } catch (e) {
            return res.render('weather.ejs', {
                shopData: req.app.locals.shopData,
                message: "Sorry, could not read weather data right now.",
                city: city
            });
        }

        if (weather && weather.main && weather.name) {
            const wmsg = 'It is ' + weather.main.temp +
                ' degrees in ' + weather.name +
                '! <br> The humidity now is: ' +
                weather.main.humidity;

            res.render('weather.ejs', {
                shopData: req.app.locals.shopData,
                message: wmsg,
                city: weather.name
            });
        } else {
            res.render('weather.ejs', {
                shopData: req.app.locals.shopData,
                message: "No data found for that place. Please try again.",
                city: city
            });
        }
    });
});

module.exports = router;
