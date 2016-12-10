(function() {
    app.controller('MainController', ['$rootScope', '$scope', 'SolverService', function($rootScope, $scope, SolverService) {
        var self = this;

        this.matrix = [];

        this.temp;

        this.isDone = false;

        /**
         * Soluciona o sistema linear.
         */
        this.solve = function() {
            var final = [];
            for (var i = 0; i < self.temp.length; i++) {
                var linha = self.temp[i].split(" ");
                for (var j = 0; j < linha.length; j++) {
                    linha[j] = Number(linha[j]);
                }
                final.push(linha);
            }
            self.matrix = SolverService.solve(final);
            self.isDone = true;
        };

        /**
         * Recupera a matriz.
         */
        this.getMatrix = function() {
            return self.matrix;
        };

        /**
         * Formata a solução para ser mostrada na view.
         * Retorna uma lista de strings, onde cada string
         * representa uma linha da matriz final, desde que não
         * seja nula, e com as incógnitas juntas de seus respectivos
         * coeficientes.
         * 1x + 2w = 0
         * 1w = 2
         * TODO: isso tá bem feio depois vou arrumar
         */
        this.getSolucao = function() {
            var disp = "xyzwabdef";
            var final = [];
            for (var i = 0; i < self.matrix.length; i++) {
                var line = self.matrix[i];
                var str = "";
                for (var j = 0; j < line.length - 1; j++) {
                    if (line[j].get() !== 0) {
                        var positive = line[j].get() > 0;
                        var firstNumber = str === "";
                        str += (positive && !firstNumber ? " +" : " ");
                        str += line[j].toString();
                        str += disp[j];
                    }
                }
                if (str !== "") {
                    str += " = " + line[line.length - 1].toString();
                    final.push(str);
                }
            }
            return final;
        };

        /**
         * Limpa a matriz.
         */
        this.reset = function() {
            self.matrix = [];
            self.temp = [];
            self.isDone = false;
        };

        (function() {
            var exs = [
                [
                    "2 -1 3 11",
                    "4 -3 2 0",
                    "1 1 1 6",
                    "3 1 1 4"
                ], [
                    "1 6 -8 1",
                    "2 6 -4 0"
                ], [
                    "0 1 3 -2",
                    "2 1 -4 3",
                    "2 3 2 -1"
                ], [
                    "3 5 0 1",
                    "2 0 1 3",
                    "5 1 -1 0"
                ]
            ]
            self.temp = exs[3];
        })();
    }]);
}())