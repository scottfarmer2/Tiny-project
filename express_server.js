const cookieSession = require('cookie-session');
const express = require("express");
// const cookieParser = require('cookie-parser');
const app = express();
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");

app.use(cookieSession({
    name: 'session',
    keys: ['facebutt', 'sss'],

    maxAge: 24 * 60 * 60 * 1000
}));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true})); // populates req.bodyw with the variables

// app.use(cookieParser());

var urlDatabase = {
    "b2xVn2": {shortURL: "b2xVn2",
                longURL: "http://www.lighthouselabs.ca",
                userId: "dhfjh3"}
    "9sm5xk": {shortURL: "9sm5xk",
               longURL: "http://www.google.com",
               userId: "dhfjh3"}



///////////
////create a database for the users id.

var users = {"dhfjh3": {id: "dhfjh3",
                        email: "smt",
                        password:"1234"}}

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

///////////////

app.get("/", (request, response) => {
    response.redirect("/urls");
});

//////////////

app.get("urls.json", (request, response) => {
    response.json(urlDatabase);
});

/////////////////////
/////// In urls if there is no email, send to register page.

app.get("/urls", (request, response) =>{
    var email = "";
    if (request.session["id"]) {
        email = users[request.session["id"]].email;
    }
    let templateVars = {urls: urlDatabase,
                        email: email};
    response.render("urls_index", templateVars);
    return;
});

//////////////////////
//////

app.get("/urls/new", (request, response) => {
    var email = "";
    if (request.session["id"]) {
        email = users[request.session["id"]].email
    } else {
        response.render("urls_new", {email: email});
        return;
    }
});

///////////////////////
////////

app.get("/urls/:id", (request, response) => {

    var email = ""
    if (!request.session["id"]) {
        response.redirect("/logout");
        return;
    }

    let templateVars = {shortURL: request.params.id,
                        urls: urlDatabase,
                        email: users[request.session["id"]].email};
    response.render("urls_show", templateVars);
    return;
});

////////////////////////////
//////////////

app.get("/register", (request, response) => {
    response.render("urls_register");
    return;
});

//////////////////////////////

app.get("/u/:x", (request, response) => {
  let longURL = urlDatabase[request.params.x];
  // console.log(request.params);
  response.redirect(longURL);
  return;
});

////////////////////////////

app.get("/login", (request, response) => {
    response.render("login");
    return;
})

//////////////////////////

app.post("/register", (request, response) => {
    if (request.body["email"] === "" || request.body["password"] === "") {
        response.status(400).send("You must fill in the inputs!")
    }
    if (checkEmails(request.body["email"])) {
        response.status(400).send("something wrong");
    } else {
        let id = generateRandomString();
        let password = request.body["password"];
        const hashed_password = bcrypt.hashSync(password, 10);
        let userInfo = {id: id,
                        email: request.body["email"],
                        password: hashed_password};
        users[id] = userInfo;
        request.session["id"] = id////////////////////////////////
        response.redirect("/urls");
    }
});

///////////////////////////

app.post("/urls/new", (request, response) => {
    var email = ""
    if (!request.session["id"]) {
        response.render("/register");
        return;
    }
    var longURL = request.body["longURL"];
    var shortURL = generateRandomString();

    urlDatabase[shortURL] = longURL;
    // console.log(urlDatabase);
    response.redirect("/urls/" + shortURL);
});

///////////////////////////

app.post("/urls/:shortURL/delete", (request, response) => {
    let obj = request.params.shortURL;
    delete urlDatabase[obj]
    response.redirect("/urls");
});

////////////////////////////

app.post("/urls/:shortURL", (request, response) => {
    let shortURL = request.params.shortURL;
    let newLongURL = request.body.newlongURL;

    urlDatabase[shortURL] = newLongURL;
    response.redirect("/urls/")
});

///////////////////////////

app.post("/login", (request, response) => {

    var theID = "";
    for (var key in users) {
        if (users[key].email === request.body.email) {
            theID = key;
        }
    }
    if( !theID || !bcrypt.compareSync(request.body["password"], users[theID].password)) {
        response.status(403)
        response.send("Incorrect email or password!");
        return;
    } else {
        request.session.id = theID;
        response.redirect("/")
    }
});

// //////////////////////////////

app.post("/logout", (request, response) => {
    request.session = null;
    response.redirect("/login");
});

// ////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});





