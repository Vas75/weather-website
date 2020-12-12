//this is the client side js

const weatherForm = document.querySelector("form");
const search = weatherForm.querySelector("#address");
const message1 = document.querySelector("#message-1");
const message2 = document.querySelector("#message-2");

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = search.value.trim();
  search.value = "";
  message1.textContent = "loading...";
  message2.textContent = "";

  fetch(`http://localhost:3000/weather?address=${location}`).then(
    (response) => {
      response.json().then((data) => {
        if (data.error) {
          message1.textContent = data.error;
        } else {
          message1.textContent = data.location;
          message2.textContent = data.forecast;
        }
      });
    }
  );
});

/*
fetch is a browser based api, not something that can be used in node js on the back end. fetch() in
the client side js performs an asynchronous i/o
operation, takes time to return our data. We provide
a function to handle the data when available. fetch
uses then method with a callback to handle returned
data. 
*/
