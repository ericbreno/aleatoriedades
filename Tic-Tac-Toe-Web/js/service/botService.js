(function () {
    /**
     * Service que gerencia o Bot jogador de jogo da velha.
     */
    app.service('BotTicTacService', [function () {
        var self = this;

        var X = 'X';

        var O = 'O';

        this.tab;

        /**
         * Realiza uma jogada, verificando as condições atuais do tabuleiro.
         */
        this.jogar = function (tab) {
            self.tab = tab;
            var casa = podeVencerLinhas() || podeVencerColunas() || podeVencerDiagonais()
                || podePerderLinhas() || podePerderColunas() || podePerderDiagonais()
                || jogaAleatorio();
            return casa;
        };

        /**
         * Verifica se existe alguma linha prestes a ser perdida, então
         * retorna a casa para ser jogada em.
         */
        function podePerderLinhas() {
            for (var i = 0; i < 3; i++) {
                var casa = podePerderLinha(getTab()[i]);
                if (typeof (casa) !== 'undefined') {
                    return casa;
                }
            }
        }

        /**
         * Verifica se existe alguma coluna prestes a ser perdida, então
         * retorna a casa para ser jogada em.
         */
        function podePerderColunas() {
            for (var i = 0; i < 3; i++) {
                var casa = podePerderLinha(colunaComoLinha(i));
                if (typeof (casa) !== 'undefined') {
                    return casa;
                }
            }
        }

        /**
         * Verifica para uma linha passada se existe a chance
         * do jogador vencer, então retorna a casa que deve se
         * jogar caso exista.
         */
        function podePerderLinha(elems) {
            return (elems[0].peca === elems[1].peca) && elems[0].peca === X && elems[2].peca !== O ? elems[2]
                : (elems[0].peca === elems[2].peca) && elems[0].peca === X && elems[1].peca !== O ? elems[1]
                    : (elems[1].peca === elems[2].peca) && elems[1].peca === X && elems[0].peca !== O ? elems[0]
                        : undefined;
        }

        /**
         * Verifica se existe alguma coluna prestes a ser perdida, então
         * retorna a casa para ser jogada em.
         */
        function podePerderDiagonais() {
            var d1 = [getTab()[0][0], getTab()[1][1], getTab()[2][2]];
            var d2 = [getTab()[2][0], getTab()[1][1], getTab()[0][2]];;
            return podePerderLinha(d1) || podePerderLinha(d2);
        }

        /**
         * Recupera o tabuleiro.
         */
        function getTab() {
            return self.tab;
        }

        /**
         * Verifica se o bot pode vencer marcando em alguma das linhas, então
         * retorna a casa que deve ser marcada.
         */
        function podeVencerLinhas() {
            for (var i = 0; i < 3; i++) {
                var casa = podeVencerLinha(getTab()[i]);
                if (typeof (casa) !== 'undefined') {
                    return casa;
                }
            }
        }

        /**
         * Verifica se o bot pode vencer marcando em alguma das colunas, então
         * retorna a casa que deve ser marcada.
         */
        function podeVencerColunas() {
            for (var i = 0; i < 3; i++) {
                var casa = podeVencerLinha(colunaComoLinha(i));
                if (typeof (casa) !== 'undefined') {
                    return casa;
                }
            }
        }

        /**
         * Verifica se o bot pode vencer marcando em alguma das
         * diagonais, então retorna a casa que deve ser marcada.
         */
        function podeVencerDiagonais() {
            var d1 = [getTab()[0][0], getTab()[1][1], getTab()[2][2]];
            var d2 = [getTab()[2][0], getTab()[1][1], getTab()[0][2]];;
            return podeVencerLinha(d1) || podeVencerLinha(d2);
        }

        /**
         * Verifica se o bot pode vencer marcando alguma casa da linha passada,
         * então retorna a casa.
         */
        function podeVencerLinha(elems) {
            return (elems[0].peca === elems[1].peca) && elems[0].peca === O && elems[2].peca !== X ? elems[2]
                : (elems[0].peca === elems[2].peca) && elems[0].peca === O && elems[1].peca !== X ? elems[1]
                    : (elems[1].peca === elems[2].peca) && elems[1].peca === O && elems[0].peca !== X ? elems[0]
                        : undefined;
        }

        /**
         * Transforma uma coluna para um linha.
         */
        function colunaComoLinha(coluna) {
            var elems = [];
            for (var i = 0; i < 3; i++) {
                elems.push(getTab()[i][coluna]);
            }
            return elems;
        }

        /**
         * Escolhe a primeira casa livre e então retorna ela para ser jogada em.
         */
        function jogaAleatorio() {
            for (; ;) {
                var i = Math.floor((Math.random() * 20));
                var linha = getTab()[i % 3];
                var j = Math.floor((Math.random() * 20));
                var casa = linha[j % 3];
                if (typeof (casa.peca) === 'undefined') {
                    return casa;
                }
            }
        }

    }])
} ())