let GSAProxy = require('./gsaproxy');

module.exports = function(api) {
  // Serve requests to /api/suggest
  api.route('/api/suggest')
    .post((req, res) => {
      // Setup our proxy to use the Prod GSA and the query parameters
      let gsaProxy = new GSAProxy('http://path-to-gsa.com/', req.query);
      // Execute a GSA suggest search and give us back JSON
      gsaProxy.executeSuggest(handleData);
      // Function to handle our GSA response data
      function handleData(err, data) {
        if (err)
          // Log any errors
          console.log(err);
        // Send the user the data!
        res.send(data);
      }
    });
};
