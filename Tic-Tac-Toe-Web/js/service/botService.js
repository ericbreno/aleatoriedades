(function () {
    /**
     * Service que gerencia o Bot jogador de jogo da velha.
     */
    app.service('BotTicTacService', [function () {
        var self = this;

        var PECA_ADV = 'X';

        var PECA_BOT = 'O';

        this.tab;

        /**
         * Verifica as condições atuais do tabuleiro e decide em
         * qual casa deve se realizar a jogada, então a retorna.
         * @param tab Tabuleiro do jogo.
         * @param peca Peca que está jogando.
         * @return Casa em que se deve realizar a jogada.
         */
        this.jogar = function (tab, peca) {
            if (!isUndf(peca)) {
                PECA_BOT = peca;
                PECA_ADV = peca === 'X' ? 'O' : 'X';
            }
            self.tab = tab;
            var casa = jogarParaVencer() 
                || jogarParaNaoPerder()
                || desarmarJogada()
                || armarJogada() || primeiraJogada() || jogaAleatorio();
            return casa;
        };

        /**
         * Verifica se é possível fazer uma jogada e ganhar o jogo, caso seja possível
         * retorna a casa em que se deve jogar.
         */
        function jogarParaVencer() {
            return podeVencerLinhas() || podeVencerColunas() || podeVencerDiagonais();
        }

        /**
         * Verifica se é possível perder o jogo em uma jogada, caso seja possível
         * retorna a casa que deve ser jogada para não se perder.
         */
        function jogarParaNaoPerder() {
            return podePerderLinhas() || podePerderColunas() || podePerderDiagonais();
        }

        /**
         * Verifica se existe alguma linha prestes a ser perdida, então
         * retorna a casa para ser jogada em.
         */
        function podePerderLinhas() {
            for (var i = 0; i < 3; i++) {
                var casa = podeVencerLinha(getTab()[i], PECA_ADV);
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
                var casa = podeVencerLinha(colunaComoLinha(i), PECA_ADV);
                if (typeof (casa) !== 'undefined') {
                    return casa;
                }
            }
        }

        /**
         * Verifica se existe alguma coluna prestes a ser perdida, então
         * retorna a casa para ser jogada em.
         */
        function podePerderDiagonais() {
            var d1 = [getTab()[0][0], getTab()[1][1], getTab()[2][2]];
            var d2 = [getTab()[2][0], getTab()[1][1], getTab()[0][2]];
            return podeVencerLinha(d1, PECA_ADV) || podeVencerLinha(d2, PECA_ADV);
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
         * Verifica se a peca passada pode vencer marcando alguma casa da linha passada,
         * então retorna a casa.
         */
        function podeVencerLinha(elems, peca) {
            if (isUndf(peca)) {
                peca = PECA_BOT;
            }
            return (elems[0].peca === elems[1].peca) && elems[0].peca === peca && isUndf(elems[2].peca) ? elems[2]
                : (elems[0].peca === elems[2].peca) && elems[0].peca === peca && isUndf(elems[1].peca) ? elems[1]
                    : (elems[1].peca === elems[2].peca) && elems[1].peca === peca && isUndf(elems[0].peca) ? elems[0]
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

        /**
         * Verifica se existe a possibilidade de armar alguma
         * jogada no tabuleiro, caso seja possível retorna
         * a casa que deve ser jogada.
         */
        function armarJogada() {
            var r = armarDoisLugares() || armarUmLugar();
            console.log("vou armar? ", r);
            return r;
        }

        function armarDoisLugares() {
            var diag = podeArmarDiagonal() || [];
            var lin = [];
            var col = [];
            for (var i = 0; i < 3; i++) {
                var l = podeArmarLinha(i);
                var c = podeArmarColuna(i);
                if (l) { lin = l; }
                if (c) { col = c; }
            }
            return diag.lenth > 0 && col.length > 0
                ? acharComum(diag, col) : diag.lenth > 0 && lin.length > 0
                ? acharComum(diag, lin) : lin.length > 0 && col.length > 0
                ? acharComum(lin, col) : null;
        }

        function acharComum(posicoes1, posicoes2) {
            for (var i = 0; i < posicoes1.length; i++) {
                for (var j = 0; j < posicoes2.length; j++) {
                    if (posicoes1[i].x === posicoes2[j].x && posicoes1[i].y === posicoes2[j].y) {
                        return getTab()[posicoes1[i].x][posicoes1[i].y];
                    }
                }
            }
        }

        /**
         * Verifica se pode armar alguma jogada que deixe disponível
         * uma casa possível para a vitória, caso seja possível
         * retorna a casa que deve ser jogada.
         */
        function armarUmLugar() {
            var res = podeArmarDiagonal();
            if (res) {
                return getTab()[res[0].x][res[0].y];
            }
            for (var i = 0; i < 3; i++) {
                res = podeArmarColuna(i) || podeArmarLinha(i);
                if (res) {
                    return getTab()[res[0].x][res[0].y];
                }
            }
        }

        /**
         * Verifica se pode armar uma jogada para ganhar em
         * alguma das colunas, caso seja possível retorna
         * as posições em que se pode jogar.
         */
        function podeArmarColuna(coluna) {
            var linha = [getTab()[0][coluna], getTab()[1][coluna], getTab()[2][coluna]];
            var res = checaArmarLinha(linha);
            if (res) {
                var posicoes = vPos(res.x);
                return [new Pos(posicoes[0], coluna), new Pos(posicoes[1], coluna)];
            }
        }

        /**
         * Verifica se pode armar uma jogada para ganhar
         * em alguma das diagonais, caso seja possível retornar
         * as posições em que se pode jogar.    
         */
        function podeArmarDiagonal() {
            var d1 = [getTab()[0][0], getTab()[1][1], getTab()[2][2]];
            var d2 = [getTab()[2][0], getTab()[1][1], getTab()[0][2]];
            var res = checaArmarLinha(d1);
            if (res) {
                var posicoes = vPos(res.x);
                return [new Pos(posicoes[0], posicoes[0]), new Pos(posicoes[1], posicoes[1])];
            }
            res = checaArmarLinha(d2);
            if (res) {
                var posicoes = vPos(res.x);
                var invs = [2, 1, 0];
                return [new Pos(posicoes[0], invs[posicoes[0]]), new Pos(posicoes[0], invs[posicoes[2]])];
            }
        }

        /**
         * Verifica se pode armar uma jogada para ganhar
         * em alguma das linhas, caso seja possível retorna
         * as posições em que se pode jogar.
         */
        function podeArmarLinha(linha) {
            var res = checaArmarLinha(getTab()[linha]);
            if (res) {
                var posicoes = vPos(res.y);
                return [new Pos(linha, posicoes[0]), new Pos(linha, posicoes[1])];
            }
        }

        /**
         * Checa se pode armar uma jogada para ganhar na linha passada, caso
         * seja possível, retorna a casa com a peça do bot.
         */
        function checaArmarLinha(lista) {
            return lista[0].peca === 'O' && isUndf(lista[1].peca) && isUndf(lista[2].peca)
                ? lista[0] : lista[1].peca === 'O' && isUndf(lista[0].peca) && isUndf(lista[2].peca)
                ? lista[1] : lista[2].peca === 'O' && isUndf(lista[0].peca) && isUndf(lista[1].peca)
                ? lista[2] : null;
        }

        function primeiraJogada() {

        }

        function desarmarJogada() {

        }

        /**
         * Desarma uma jogada do tipo set-1
         *  - X 
         *  X -
         * ou qualquer variante para posição do tabuleiro.
         */
        function desarmaSetUm() {
            
        }

        /**
         * Retorna uma lista com os número de zero a 3 exceto o passado.
         */
        function vPos(x) {
            return [(x+1)%3, (x+2)%3];
        }

        /**
         * @return True se o parametro for undefined ou null.
         */
        function isUndf(e) {
            return typeof (e) === 'undefined' || e === null;
        } 

        function Pos(x, y) {
            return {
                x: x,
                y: y
            };
        }
    }])
} ())