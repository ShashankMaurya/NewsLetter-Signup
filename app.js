const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const config = require('./config.json');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const baseURL = "https://us21.api.mailchimp.com/3.0/";

// hide these before pushing to github
const list_id = config.application_data.list_id;
const api_key = config.application_data.api_key;


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/signup.htm");
});

app.post('/', function (req, res) {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;

    // console.log(fname, lname, email);

    let data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data);

    let url = baseURL + 'lists/' + list_id;
    let options = {
        method: 'POST',
        auth: 'shashank01:' + api_key
    }

    const request = https.request(url, options, function (response) {
        console.log('status code : ', response.statusCode);
        console.log('response headers : ', response.headers);

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.htm');
        }
        else {
            res.sendFile(__dirname + "/failure.htm");
        }

        response.on('data', function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.on('error', (err) => console.error(err));
    request.write(jsonData);
    request.end();

});

app.post('/failure', function(req, res){
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('server started at port 3000');
    console.log(list_id, api_key);
});
