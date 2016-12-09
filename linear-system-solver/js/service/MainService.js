var app = angular.module('App', []);
'use strict';
(function() {
    app.service('MainService', [function() {
        var self = this;

        // Exemplo de sistema que tem solução.
        // 2 -1 3 11 4 -3 2 0 1 1 1 6 3 1 1 4

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
                    temp.push(new EricNumber(matrix[i][j]));
                }
                final.push(temp);
            }
            return final;
        }

        /**
         * Resolve o sistema de equações lineares, passado em forma
         * de sua matriz estendida [A|B].
         */
        this.solve = function(matrix) {
            matrix = prepare(matrix);
            for (var pos = 0; pos < matrix.length - 1; pos++) {
                if (done(matrix, pos)) {
                    return;
                }
                zeroThisLine(matrix, pos);
                swapZeroHere(matrix, pos);
                tryPutOneFirst(matrix, pos);
                makePivot(matrix, pos);
                zeroColumn(matrix, pos);
            }
            return matrix;
        };

        /**
         * Checa se o processo de resolução foi concluído, verificando
         * se ainda existem linhas não nulas que precisam ser processadas.
         */
        function done(matrix, pos) {
            for (var i = pos; i < matrix.length; i++) {
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
         * Verifica se a linha atual é múltipla de alguma outra,
         * caso seja, ela será zerada.
         */
        function zeroThisLine(matrix, pos) {
            var baseLine = matrix[pos];
            for (var i = 0; i < matrix.length; i++) {
                if (i === pos) {
                    continue;
                }
                if (isMultiple(baseLine, matrix[pos])) {
                    for (var i = 0; i < baseLine.length; i++) {
                        baseLine[i] = new EricNumber(0);
                    }
                    return;
                }
            }
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
         * Verifica se uma linha é múltipla de outra, ou seja,
         * todos os elementos de uma sejam divisíveis pelos da outra.
         */
        function isMultiple(line1, line2) {
            for (var i = 0; i < line1.length; i++) {
                if (line1[i].get() % line2[i].get() !== 0 &&
                    line2[i].get() % line1[i].get() !== 0) {
                    return false;
                }
            }
            return true;
        }

        /**
         * Verifica se o elemento na posição atual, que deveria
         * ser o pivot (1) é zero, caso seja, e não seja a última
         * linha, ela é trocada com a próxima.
         */
        function swapZeroHere(matrix, pos) {
            var line = matrix[pos];
            if (line[pos].get() === 0 && pos < matrix.length) {
                swap(matrix, pos, pos + 1);
            }
        }

        /**
         * Realiza a operação elementar de múltiplicar uma
         * dada linha por um coeficiente para que o pivot,
         * elemento que esteja na pos-ésima linha e pos-
         * ésima coluna se torne um.
         * @param matrix Matriz
         * @param pos Posição de referência.
         */
        function makePivot(matrix, pos) {
            var lineOn = matrix[pos];
            var coef = lineOn[pos];
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
         */
        function zeroColumn(matrix, pos) {
            var baseLine = matrix[pos];
            for (var lin = 0; lin < matrix.length; lin++) {
                if (lin === pos) {
                    continue;
                }
                var lineToZeroCol = matrix[lin];
                for (var i = 0; i < lineToZeroCol.length; i++) {
                    var coef = angular.copy(lineToZeroCol[pos]);
                    var base = angular.copy(baseLine[i]);
                    lineToZeroCol[i].add(base.mult(coef.mult(-1)));
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
         */
        function tryPutOneFirst(matrix, pos) {
            var toSwap = checkNHere(1, pos, matrix);
            if (toSwap && toSwap > pos) {
                var temp = matrix[toSwap];
                matrix[toSwap] = matrix[pos];
                matrix[pos] = temp;
            }
        }

        function checkNHere(n, pos, matrix) {
            for (var i = 0; i < matrix.length; i++) {
                if (matrix[i][pos].get() === n) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * Encontra o MMC (LCM) de dois números.
         * @return MMC.
         */
        function findLCM(num1, num2) {
            var temp;
            var a = num1;
            var b = num2;
            do {
                temp = a % b;

                a = b;
                b = temp;
            } while (temp != 0);
            return (num1 * num2) / a;
        }

        /**
         * Objeto que representa um número no sistema.
         * Dá suporte para as operações de adição por número de tipo
         * primitivo e outros objetos Numero, multiplicação e divisão
         * de forma similar.
         * Os métodos de operações básicas dão suporte para chaining,
         * por retornarem eles mesmos. Ex: o.add(o.mult(o.div(1)))
         * O método get retorna um valor do tipo primitivo para
         * o que o objeto representa.
         * toString retorna o número formatado, na forma inteiro ou
         * inteiro/inteiro.
         */
        function EricNumber(num) {
            return {
                n: num,
                divisor: 1,
                get: function() {
                    return this.n / this.divisor;
                },
                add: function(v) {
                    if (typeof v === 'object') {
                        var commonDivisor = v.divisor * this.divisor;
                        var thisv = commonDivisor / this.divisor * this.n;
                        var otherv = commonDivisor / v.divisor * v.n;
                        this.n = thisv + otherv;
                        this.divisor = commonDivisor;
                    } else {
                        console.log("Im adding a number, should i?");
                        this.n += v * this.divisor;
                    }
                    return this;
                },
                div: function(v) {
                    if (typeof v === 'object') {
                        var newDivisor = this.divisor * v.n;
                        var newNumerator = this.n * v.divisor;
                        this.n = newNumerator;
                        this.divisor = newDivisor;
                    } else {
                        console.log("Im dividing a number, should i?");
                        this.divisor *= v;
                    }
                    return this;
                },
                mult: function(v) {
                    if (typeof v === 'object') {
                        var newDivisor = this.divisor * v.divisor;
                        var newNumerator = this.n * v.n;
                        this.n = newNumerator;
                        this.divisor = newDivisor;
                    } else {
                        console.log("Im multiplying a number, should i?");
                        this.n *= v;
                    }
                    return this;
                },
                toString: function() {
                    var saida = "";
                    if (this.n === 0 || this.n % this.divisor === 0) {
                        saida = this.n / this.divisor;
                    } else {
                        var mmc = findLCM(this.n, this.divisor);
                        saida = (this.n / mmc) + "/" + (this.divisor / mmc);
                    }
                    return saida;
                }
            };
        }
    }]);
}())