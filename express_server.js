var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();
var PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true})); // populates req.bodyw with the variables

app.use(cookieParser());

var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xk": "http://www.google.com"
};

var users = {"dhfjh3": {id: "dhfjh3", email: "smt", password:"1234"}}

function generateRandomString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 6; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

function checkEmails (newEmail) {
    for (usersid in users) {
        if (newEmail === users[usersid].email) {
            return true;
        } else {
            return false;
        }
    }
}

app.get("/", (request, response) => {
    response.end("Hello!");
});

app.get("urls.json", (request, response) => {
    response.json(urlDatabase);
});

app.get("/urls", (request, response) =>{
    var email = ""
    if (!request.cookies["id"]) {
        response.render("/register");
    }
    let templateVars = {urls: urlDatabase,
                        email: users[request.cookies["id"]].email};
    response.render("urls_index", templateVars)
});

app.get("/urls/new", (request, response) => {
    var email = ""
    if (!request.cookies["id"]) {
        response.redirect("/register");


} else {
    response.render("urls_new", {email: users[request.cookies["id"]].email})

}});

app.get("/urls/:id", (request, response) => {

    var email = ""
    if (!request.cookies["id"]) {
        response.render("/register");
        return;
    }

    let templateVars = {shortURL: request.params.id,
                        urls: urlDatabase,
                        email: users[request.cookies["id"]].email};
    response.render("urls_show", templateVars);
});

app.get("/register", (request, response) => {
    response.render("urls_register");
});

app.post("/register", (request, response) => {
    if (request.body["email"] === "" || request.body["password"] === "") {
        response.status(400).send("You must fill in the inputs!")
    } if (checkEmails(request.body["email"]) === true) {
        response.status(400).send("something wrong");
    } else {
    let id = generateRandomString();
    let templateVars = {id: id,
                        email: request.body["email"],
                        password: request.body["password"]};
    users[id] = templateVars;
    response.cookie("id", id)
    console.log(users[id]);
    response.redirect("/");
    }
});

app.post("/urls/new", (request, response) => {
    var email = ""
    if (!request.cookies["id"]) {
        response.render("/register");
    }
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
});

app.post("/login", (request, response) => {
    let email = request.body.email;
    response.cookie('user', email);
    response.redirect("/urls");
});

app.post("/logout", (request, response) => {
    response.clearCookie('user');
    response.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});







