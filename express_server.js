var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

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

app.get("/urls/:id", (request, response) => {
    let templateVars = {shortURL: request.params.id, urls: urlDatabase};
    response.render("urls_show", templateVars);
});

// app.get("/hello", (req, res) => {
//   res.end("<html><body>Hello <b>World</b></body></html>\n");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});