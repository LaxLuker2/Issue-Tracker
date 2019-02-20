const http = require('http'); // http module
const url = require('url'); // url module
const query = require('querystring'); // query string module
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponse.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  index: htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/success': jsonHandler.getSuccess,
  '/badRequest': jsonHandler.getBadRequest,
  '/unauthorized': jsonHandler.getUnauthorized,
  '/forbidden': jsonHandler.getForbidden,
  '/internal': jsonHandler.getInternal,
  '/notImplemented': jsonHandler.getNotImplemented,
};

// function to handle requests
const onRequest = (request, response) => {
  // parse url into individual parts
  // returns an object of url parts by name
  const parsedUrl = url.parse(request.url);

  // grab the query parameters (?key=value&key2=value2&etc=etc)
  // and parse them into a reusable object by field name
  const params = query.parse(parsedUrl.query);

  switch (request.method) {
    case 'GET':
      if (parsedUrl.pathname === '/') {
        // if homepage, send index
        htmlHandler.getIndex(request, response);
      } else if (parsedUrl.pathname === '/style.css') {
        // if stylesheet, send stylesheet
        htmlHandler.getCSS(request, response);
      } else if (parsedUrl.pathname === '/getUsers') {
        // if get users, send user object back
        jsonHandler.getUsers(request, response);
      } else if (parsedUrl.pathname === '/success') {
        // if success is selected
        urlStruct[parsedUrl.pathname](request, response);
      } else if (parsedUrl.pathname === '/badRequest') {
        // if success is selected
        urlStruct[parsedUrl.pathname](request, response, params);
      } else if (parsedUrl.pathname === '/unauthorized') {
        // if success is selected
        urlStruct[parsedUrl.pathname](request, response, params);
      } else if (parsedUrl.pathname === '/forbidden') {
        // if success is selected
        urlStruct[parsedUrl.pathname](request, response);
      } else if (parsedUrl.pathname === '/internal') {
        // if success is selected
        urlStruct[parsedUrl.pathname](request, response);
      } else if (parsedUrl.pathname === '/notImplemented') {
        // if success is selected
        urlStruct[parsedUrl.pathname](request, response);
      } else {
        // if not found, send 404 message
        jsonHandler.getNotFound(request, response);
      }
      break;
    case 'HEAD':
      if (parsedUrl.pathname === '/getUsers') {
        // if get users, send meta data back
        jsonHandler.getUsersMeta(request, response);
      } else {
        // if not found send 404 without body
        jsonHandler.notFoundMeta(request, response);
      }
      break;
    case 'POST':
      // if post is to /addUser (our only POST url)
      if (parsedUrl.pathname === '/addUser') {
        const res = response;

        // uploads come in as a byte stream that we need
        // to reassemble once it's all arrived
        const body = [];

        // if the upload stream errors out, just throw a
        // a bad request and send it back
        request.on('error', (err) => {
          console.dir(err);
          res.statusCode = 400;
          res.end();
        });

        // on 'data' is for each byte of data that comes in
        // from the upload. We will add it to our byte array.
        request.on('data', (chunk) => {
          body.push(chunk);
        });

        // on end of upload stream.
        request.on('end', () => {
          // combine our byte array (using Buffer.concat)
          // and convert it to a string value (in this instance)
          const bodyString = Buffer.concat(body).toString();
          // since we are getting x-www-form-urlencoded data
          // the format will be the same as querystrings
          // Parse the string into an object by field name
          const bodyParams = query.parse(bodyString);

          // pass to our addUser function
          jsonHandler.addUser(request, res, bodyParams);
        });
      }
      break;
    default:
      // send 404 in any other case
      jsonHandler.getNotFound(request, response);
  }
};

// start server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
