const fetch = require("node-fetch");

module.exports.GET = function GET(url) {
  return fetch(url)
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
