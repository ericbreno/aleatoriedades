var express = require("express");
var app = express();

app.use('/js', express.static(__dirname + '/front/js'));

app.get('/', function (req, res) {
    res.sendfile('./front/index.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});