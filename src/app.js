const path = require("path");
//express exposes single funct,when call, makes new express app
const express = require("express");
//needed to create handlebars paritial templates
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

//define paths for express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//set() lets you set express settings, we set express' view engine to hbs/handlebars
//set up handlebars engine and views location(templates dir)
app.set("view engine", "hbs");
app.set("views", viewsPath);
//tells hbs where partials are to use
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDirPath));

//this creates route for access to index.hbs
//render lets us render hbs view to browser, renders index.hbs in veiws dir
//sec arg is obj w/ val you want view to be able to access
app.get("", (req, res) => {
  res.render("index", { title: "Weather", name: "Vas Phillipov" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About", name: "Vas Phillipov" });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "How can I help you?",
    title: "Help",
    name: "Vas Phillipov",
  });
});

app.get("/weather", (req, res) => {
  const address = req.query.address;

  if (!address) {
    return res.send({ error: "You must include an address to search for." });
  }

  geocode(address, (error, { location, latitude, longitude } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(location, latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({ forecast: forecastData, location, address });
    });
  });
});

//matches any page not matched begining with /help/, so if on help page, and try to get nonexist article, get 404
//catches any help 404s, NOTE: both below handlers render same template, but diff object vals
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Help article not found.",
    name: "Vas Phillipov",
  });
});

//route to display 404, * matches all, so if not matched above, matches here, must be last route, express will
//look 1st at public dir, if no match, looks at gets, all request will match *, catches ALL 404s
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Page not found.",
    name: "Vas Phillipov",
  });
});

//starts server and has it listen on specific port
//3000 common development port, 2nd arg is calback
//that runs when server is up
app.listen(3000, () => {
  console.log("server is up on port 3000");
});

//configure a server by calling functs on app.

//1 domain, app.com, but with multi routes, and run on sigle express server
//app.com
//app.com/help
//app.com/about

//get() method lets us set up response for when someone trys to get something from a specific route on our server

//first arg is partial url, '' for app.com, /help for app.com/help and /about, 2nd is funct for
//what we want to do when someone takes a route (what to send back to them)

//in callback, req is obj with info about the incoming request to server
//2nd is response, this had methods allowinig us to cusomize whats sent back to requester
//res.send() shown in browser
//will send html to render in browser or json

//below not needed, this route handled by express.static() adn serves index.html in public dir
// app.get("", (req, res) => {
//   res.send("<h1>The Weather</h1>");
// });

//2nd route
// app.get("/help", (req, res) => {
//   res.send([
//     { name: "Vas", age: 45 },
//     { name: "Danielle", age: 41 },
//   ]);
// });

//about
// app.get("/about", (req, res) => {
//   res.send("<h1>About</h1>");
// });

//above will show on the root url when get request
//made from browser or from code(node/postman-req)

//node app.js, run express app via node starts
//server. Once server going, node 'process' doesnt
//stop. Its job with an express server is to keep
//listening/processing incoming requests.
//ctrl c to shut down
//access app on localhost:3000
//localhost:3000/help to GET help page

//used globally installed nodemon to restart the
//server after changes to code.
//nodemon src/app.js -e js,hbs, says to watch for changes to js,hbs scripts, stop/start process on changes.
//error display on page if they try to access
//page that isnt set up in your domain

/*
SERVING STATIC ASSETS:
assets in public dir are to
be served via express, ex any
html to be returned by res.send().
express needs absolute path from root of machine
to folder we want to server up
in this case, public dir

node provides 2 variable to do get this absolute path.
__dirname, str that is path from root hard drive to dir current script(app.js) lives in(src)
__filename, str that is path to file itself(app.js)

We will take __dirname path, change a little to direct to public dir, not src dir.
Done with core node module "path", specific. path.join();
How: path.join(__dirname, "../public"), take dirname path that end at src, go up and out of src, and into
public dir. We use app.use() and the path to public dir to serve up the public dir to get request. app.use()
is method to customize server, express.static() configures the express app

app.use(express.static(publicDirPath)), now when express recieves get req to main page
ex. localhost:3000, contents of public dir/index.html served up, grabbed by default as its
the index.html.
*/

//NOTE:
//when sending json back, send obj or array
//express detects obj, auto strigify it to json

// hbs is an express.js view engine for handlebars.js, we cant just use handlebars with
//express, must use hbs to integrate handlebars into express, handlebars creates dynamic html templates

//express expects all veiws/handlebars templates to live in views folder, in root of proj.
//root is the webserver dir for this project

//serving up static assets like index.html from public is fine, and works great, but
//if you need to serve something more complex with dynamic content, handle bars is the way
//way to go.

//to use handlebars template for homepage, need to set up route w/ app.get().

/* 
app.set("view engine", "hbs");

what does this do exactly?
The express.static() middleware tells Express to look in a specific folder for the resource. All requests that come in will check if the thing that's being requested is in that folder, if not, it will move on to the next middleware.
*/

/*
expressjs.com api ref page has the documentation to do all this stuff, good idea to 
start referencing the docs when I build stuff.
*/
