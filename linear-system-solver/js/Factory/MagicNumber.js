var app = angular.module('App', []);
'use strict';

(function() {
    /**
     * Guess what
     */
    app.factory('MagicNumber', [function() {
        var self = this;

        this.n;

        this.divisor;

        /**
         * Construtor.
         * @param n Número real a ser encapsulado.
         */
        function MagicNumber(n) {
            this.n = n;
            this.divisor = 1;
        }

        MagicNumber.prototype = new Object();

        MagicNumber.prototype.constructor = MagicNumber;

        /**
         * Retorna o valor real encapsulado no objeto.
         */
        MagicNumber.prototype.get = function() {
            return this.n / this.divisor;
        };

        /**
         * Realiza a operação de adição ao número. Aceita adição
         * a um Number ou outro objeto do tipo MagicNumber.
         */
        MagicNumber.prototype.add = function(v) {
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
        };

        /**
         * Realiza a operação de divisão ao número. Aceita divisão
         * por um Number ou outro objeto do tipo MagicNumber.
         */
        MagicNumber.prototype.div = function(v) {
            if (typeof v === 'object') {
                var newDivisor = this.divisor * v.n;
                var newNumerator = this.n * v.divisor;
                this.n = newNumerator;
                this.divisor = newDivisor;
            } else {
                // console.log("Im dividing a number, should i?");
                this.divisor *= v;
            }
            return this;
        };

        /**
         * Realiza a operação de multiplicação ao número. Aceita multiplicação
         * a um Number ou outro objeto do tipo MagicNumber.
         */
        MagicNumber.prototype.mult = function(v) {
            if (typeof v === 'object') {
                var newDivisor = this.divisor * v.divisor;
                var newNumerator = this.n * v.n;
                this.n = newNumerator;
                this.divisor = newDivisor;
            } else {
                // console.log("Im multiplying a number, should i?");
                this.n *= v;
            }
            return this;
        };

        /**
         * Formata o número encapsulado para uma saída em String.
         */
        MagicNumber.prototype.toString = function() {
            var saida = "";
            if ((this.n === 0 || this.n % this.divisor === 0) && this.n % 1 === 0) {
                saida = this.n / this.divisor;
            } else {
                var mmc = findLCM(this.n, this.divisor);
                this.n /= mmc;
                this.divisor /= mmc;
                var invertSignal = this.divisor < 0;
                if (invertSignal) {
                    this.n *= -1;
                    this.divisor *= -1;
                }
                saida = this.n + "/" + this.divisor;
            }
            return saida;
        };

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
            return a;
        }
        return MagicNumber;
    }]);
}())