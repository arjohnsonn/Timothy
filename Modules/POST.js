const fetch = require("node-fetch");

module.exports.POST = function POST(url, body) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not OK");
    })
    .then(function (data) {
      return data;
    })
    .catch(function (error) {
      console.log(`Error: ${error.message}`);
    });
};
