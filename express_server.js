var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xk": "http://www.google.com"
};

function generateRandomString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 6; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

app.get("/", (request, response) => {
    response.end("Hello!");
});

app.get("urls.json", (request, response) => {
    response.json(urlDatabase);
});

app.get("/urls", (request, response) =>{
    let templateVars = {urls: urlDatabase};
    response.render("urls_index", templateVars)
});

app.get("/urls/new", (request, response) => {
    response.render("urls_new");
});

app.get("/urls/:id", (request, response) => {
    let templateVars = {shortURL: request.params.id, urls: urlDatabase};
    response.render("urls_show", templateVars);
});


// app.post("/urls", (request, response) => {
//     console.log(request.body);
//     response.send("Ok");
// });

app.post("/urls/new", (request, response) => {
    // console.log(request.body)
    var longURL = request.body["longURL"];
    var shortURL = generateRandomString();

    urlDatabase[shortURL] = longURL;
    // console.log(urlDatabase);
    response.redirect("/urls/" + shortURL);
});

app.get("/u/:x", (request, response) => {
  let longURL = urlDatabase[request.params.x];
  // console.log(request.params);
  response.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (request, response) => {
    let obj = request.params.shortURL;
    delete urlDatabase[obj]
    response.redirect("/urls");
});


app.post("/urls/:shortURL", (request, response) => {
    let shortURL = request.params.shortURL;
    let newLongURL = request.body.newlongURL;

    urlDatabase[shortURL] = newLongURL;
    response.redirect("/urls/")
})




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});