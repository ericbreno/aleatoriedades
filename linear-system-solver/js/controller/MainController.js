(function() {
    app.controller('MainController', ['$rootScope', '$scope', 'MainService', function($rootScope, $scope, MainService) {
        var self = this;

        this.matrix = [];

        this.temp;

        this.isDone = false;

        this.solve = function() {
            var final = [];
            for (var i = 0; i < self.temp.length; i++) {
                var linha = self.temp[i].split(" ");
                for (var j = 0; j < linha.length; j++) {
                    linha[j] = Number(linha[j]);
                }
                final.push(linha);
            }
            self.matrix = MainService.solve(final);
            self.isDone = true;
        };

        this.getMatrix = function() {
            return self.matrix;
        };

        this.getSolucao = function() {
            var disp = "xyzwabdef";
            var final = [];
            for (var i = 0; i < self.matrix.length; i++) {
                var line = self.matrix[i];
                var str = "";
                for (var j = 0; j < line.length - 1; j++) {
                    if (line[j].get() !== 0) {
                        str += (line[j].get() > 0 ? str !== "" ? "+" : "" : "-") + disp[j] + line[j].toString();
                    }
                }
                if (str !== "") {
                    str += " = " + line[line.length - 1].toString();
                    final.push(str);
                }
            }
            return final;
        };

        this.reset = function() {
            self.matrix = [];
            self.temp = [];
            self.isDone = false;
        };

        (function() {
            self.temp = [
                "2 -1 3 11",
                "4 -3 2 0",
                "1 1 1 6",
                "3 1 1 4"
            ];
        })();
    }]);
}())