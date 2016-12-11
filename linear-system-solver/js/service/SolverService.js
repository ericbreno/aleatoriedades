(function() {
    /**
     * Service que encapsula toda a lógica para resolução de um sistema
     * de equações lineares, dada sua matriz estendida.
     */
    app.service('SolverService', ['MagicNumber', function(MagicNumber) {

        var self = this;

        var lg = console.log;

        var lge = console.error;

        var acp = angular.copy;

        /**
         * Prepara a matriz passada, composta por
         * linhas de números primitivos, gerando 
         * uma matriz de objetos Numero. 
         */
        function prepare(matrix) {
            var final = [];
            for (var i = 0; i < matrix.length; i++) {
                var temp = [];
                for (var j = 0; j < matrix[i].length; j++) {
                    temp.push(new MagicNumber(matrix[i][j]));
                }
                final.push(temp);
            }
            return final;
        }

        function addStep(matrix, steps) {
            if (steps.length === 0) {
                steps.push(acp(matrix));
                return;
            }
            var lastStep = steps[steps.length - 1];
            var someDifferent = false;
            for (var i = 0; i < matrix.length; i++) {
                for (var j = 0; j < matrix[i].length; j++) {
                    if (!matrix[i][j].equals(lastStep[i][j])) {
                        someDifferent = true;
                    }
                }
            }
            if (someDifferent) {
                steps.push(acp(matrix));
            }
        }

        /**
         * Resolve o sistema de equações lineares, passado em forma
         * de sua matriz estendida [A|B].
         * 
         */
        this.solve = function(matrix) {
            result = {
                matrix: prepare(matrix),
                steps: []
            }
            result.steps = self.getLadder(result.matrix);
            return result;
        };

        /**
         * Realiza operações sobre a matriz para a deixar na forma
         * escada reduzida.
         * @param matrix Matriz a ser trabalhada.
         */
        this.getLadder = function(matrix) {
            var finalRange = Math.min(matrix.length, matrix[0].length - 1);
            var steps = [];

            addStep(matrix, steps);
            var pivotPos = -1;
            for (var pos = 0; pos < finalRange; pos++) {
                if (done(matrix, pos, finalRange)) {
                    break;
                }
                // Caso o próximo pivot não vá ficar em j+1
                do {
                    pivotPos++;
                    swapZeroHere(matrix, pos, pivotPos);
                    tryPutOneFirst(matrix, pos, pivotPos);
                } while (matrix[pos][pivotPos].get() === 0 && pivotPos < matrix[pos].length - 1);

                makePivot(matrix, pos, pivotPos);
                addStep(matrix, steps);
                zeroColumn(matrix, pos, pivotPos);
                addStep(matrix, steps);
            }
            return steps;
        };

        /**
         * Checa se o processo de resolução foi concluído, verificando
         * se ainda existem linhas não nulas que precisam ser processadas.
         * @param matrix Matriz.
         * @param pos Linha a se iniciar a verificação.
         * @param final Linha limite para se verificar.
         */
        function done(matrix, pos, final) {
            for (var i = pos; i < final; i++) {
                var line = matrix[i];
                for (var j = 0; j < line.length - 1; j++) {
                    if (line[j].get() !== 0) {
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * Troca duas linhas entre si.
         */
        function swap(matrix, pos1, pos2) {
            var aux = matrix[pos1];
            matrix[pos1] = matrix[pos2];
            matrix[pos2] = aux;
        }

        /**
         * Verifica se o elemento na posição atual, que deveria
         * ser o pivot (1) é zero, caso seja, e não seja a última
         * linha, ela é trocada com a próxima.
         * @param matrix Matriz
         * @param pos Linha
         * @param index Coluna
         */
        function swapZeroHere(matrix, pos, index) {
            var line = matrix[pos];
            if (line[index].get() === 0 && pos < matrix.length - 1) {
                swap(matrix, pos, pos + 1);
            }
        }

        /**
         * Realiza a operação elementar de múltiplicar uma
         * dada linha por um coeficiente para que o pivot,
         * elemento que esteja na pos-ésima linha e pos-
         * ésima coluna se torne um. Caso o elemento da posição
         * seja zero, o seguinte é tentado ser convertido no
         * pivot, até que se chegue no último elemento
         * referente à matriz dos coeficientes.
         * @param matrix Matriz
         * @param pos Posição de referência - linha.
         * @param index Coluna
         */
        function makePivot(matrix, pos, index) {
            var toZero = [pos];
            var lineOn = matrix[pos];
            var coef = acp(lineOn[index]);
            for (var i = 0; i < lineOn.length; i++) {
                lineOn[i].div(coef);
            }
        }

        /**
         * Zera todos os elementos de uma dada coluna, exceto o 
         * elemento que esteja na pos-ésima coluna da pos-ésima
         * linha.
         * @param matrix Matriz
         * @param pos Posição de referência.
         * @param index Coluna
         */
        function zeroColumn(matrix, pos, index) {
            var baseLine = matrix[pos];
            for (var lin = 0; lin < matrix.length; lin++) {
                if (lin === pos) {
                    continue;
                }
                var lineToZeroCol = matrix[lin];
                var coef = acp(lineToZeroCol[index]);
                for (var i = 0; i < lineToZeroCol.length; i++) {
                    var localCoef = acp(coef);
                    var base = acp(baseLine[i]);
                    // console.log(lineToZeroCol[i].get() + "+" + base.get() + "*-" + localCoef.get());
                    lineToZeroCol[i].add(base.mult(localCoef.mult(-1)));
                    // console.log("final: " + lineToZeroCol[i].get());
                }
            }
        }

        /**
         * Checa se é possível realizar alguma trocar entre a linha
         * que se está trabalhando ou alguma sucessora, de forma que o
         * elemento que deve ser o pivot, ou seja, que esteja na
         * pos-ésima coluna e pos-ésima linha, seja um, caso não
         * seja possível, nada é feito.
         * @param matrix Matriz
         * @param pos Linha em que se está trabalhando.
         * @param index Coluna
         */
        function tryPutOneFirst(matrix, pos, index) {
            var toSwap = checkNHere(1, index, matrix);
            if (toSwap && toSwap > pos) {
                swap(matrix, pos, toSwap);
            }
        }

        /**
         * Verifica se o elemento N está na coluna pos,
         * entre a linha pos e range.
         * @param n Elemento a ser buscado nas colunas.
         * @param pos Coluna a se buscar o elemento.
         * @param matrix Matriz.
         * @return A linha que contém o elemento na dada coluna, -1
         * caso não exista.
         */
        function checkNHere(n, pos, matrix) {
            for (var i = 0; i < matrix.length; i++) {
                if (matrix[i][pos].get() === n) {
                    return i;
                }
            }
            return -1;
        }
    }]);
}())