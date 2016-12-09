var solver = function(vet) {

    var buildMatrix = function (v) {
        var lines = Math.sqrt(v.length);
        var final = [];
        var done = 0;
        for (var i = 0; i < lines; i++) {
            var temp = [];
            for (var j = 0; j < lines; j++) {
                temp.push(v[done * lines + j]);
            }
            final.push(temp);
            done++;
        }
    }

    var matrix = buildMatrix(vet);
    console.log(matrix);
}