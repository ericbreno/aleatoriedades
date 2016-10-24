(function () {
    /**
     * Service que gerencia o Bot jogador de jogo da velha.
     */
    app.service('BotTicTacService', [function () {
        var self = this;

        var PECA_ADV = 'X';

        var PECA_BOT = 'O';

        /** 
         * Indica se é a primeira jogada do bot.
         */
        var PRIMEIRA_JOGADA = true;

        var IS_TAB_VAZIO = false;

        /**
         * Peça jogada pelo player. Utilizado apenas para a primeira jogada.
         */
        var PECA_JOGADA = {};

        /**
         * Última peça jogada pelo bot.
         */
        var ULTIMA_JOGADA;

        /**
         * Nível de dificuldade do bot.
         */
        var dificuldade;

        this.tab;

        /**
         * Altera o nível de dificuldade para o passado, valores válidos: 0, 1, 2 e 3.
         * @param nivel Nivel de dificuldade a ser setado para o bot.
         */
        this.setDificuldade = function (nivel) {
            dificuldade = nivel;
        };

        /**
         * Verifica as condições atuais do tabuleiro e decide em
         * qual casa deve se realizar a jogada, então a retorna.
         * @param tab Tabuleiro do jogo.
         * @param peca Peca que o bot está jogando.
         * @return Casa em que se deve realizar a jogada.
         */
        this.jogar = function (tab, peca) {
            if (!isUndf(peca)) {
                PECA_BOT = peca;
                PECA_ADV = peca === 'X' ? 'O' : 'X';
            }
            self.tab = tab;
            isTabVazio();
            var a = jogarParaVencer(),
                b = jogarParaNaoPerder(),
                c = armarJogada(),
                d = primeiraJogada(),
                e = jogaAleatorio();
            console.log(a, b, c, d, e);
            var casa;
            if (dificuldade < 1) {
                casa = a || b || e;
            } else if (dificuldade < 2) {
                casa = a || b || d || e;
            } else if (dificuldade < 3) {
                casa = a || b || c || e;
            } else {
                casa = a || b || c || d || e;
            }
            PRIMEIRA_JOGADA = false;
            IS_TAB_VAZIO = false;
            ULTIMA_JOGADA = casa;
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
            var d2 = [getTab()[2][0], getTab()[1][1], getTab()[0][2]];
            ;
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
            var a = armarDoisLugares();
            var b = armarUmLugar();
            console.log("armar", b, a);
            return a || b;
        }

        /**
         * Verifica se é possível fazer uma jogada que arma para
         * se poder vencer em duas casas.
         * @returns Casa a ser jogada, caso seja possível.
         */
        function armarDoisLugares() {
            var diag = podeArmarDiagonal() || [];
            var lin = [];
            var col = [];
            for (var i = 0; i < 3; i++) {
                var l = podeArmarLinha(i);
                var c = podeArmarColuna(i);
                if (l) {
                    lin = l;
                }
                if (c) {
                    col = c;
                }
            }
            return diag.lenth > 0 && col.length > 0
                ? acharComum(diag, col) : diag.lenth > 0 && lin.length > 0
                    ? acharComum(diag, lin) : lin.length > 0 && col.length > 0
                        ? acharComum(lin, col) : null;
        }

        /**
         * Acha a casa em comum entre as duas listas de posições.
         * @param posicoes1 Primeira lista de casas.
         * @param posicoes2 Segunda lista de casas.
         * @returns Casa em comum.
         */
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
            for (var i = 0; i < 3; i++) {
                if (res && decidirEntrePossiveisArmar(res)) {
                    return decidirEntrePossiveisArmar(res);
                }
                res = podeArmarColuna(i) || podeArmarLinha(i);
            }
            if (res) {
                return decidirEntrePossiveisArmar(res);
            }
        }

        /**
         * Decide entre as possibilidades de jogada onde se deve
         * jogar. Escolhendo a melhor opção de acordo com a
         * configuração do tabuleiro.
         * Ordem da verificação:
         * 1 - O adversário fechou minha peça em um canto.
         * 2 - Adversário armando tipo 1, jogar em uma das quinas.
         * 3 - Deixar de jogar no meio se possível.
         * 4 - Não está armando no tipo 1, então pode jogar no meio.
         * @param possiveis Possiveis lugares a se jogar.
         * @returns Casa a ser jogada.
         */
        function decidirEntrePossiveisArmar(possiveis) {
            var armandoTipoUm = oponenteArmandoUm();
            var armandoTipoDois = oponenteArmandoDois();
            var armandoTipoTres = oponenteArmandoTres();
            var fechouTipoUm = oponenteFechouTipoUm();
            var jogarNaSegundaOpcao = possiveis.length > 1
                && armandoTipoUm
                && isQuina(possiveis[1]) // preferível se jogar em quinas
                && (ULTIMA_JOGADA.x === possiveis[1].x || ULTIMA_JOGADA.y === possiveis[1].y); // não jogar em diagonal
            var temMeioJogarLado = possiveis.length > 1
                && getTab()[1][1].peca === PECA_BOT
                && isQuina(possiveis[1]);
            // Caso o jogador tenha fechado minha peça na quina ou esteja armando no tipo
            // dois e o meio não esteja marcado
            if ((fechouTipoUm || armandoTipoDois) && isUndf(getTab()[1][1].peca)) {
                return getTab()[1][1];
            }
            // Se ele estiver armando do tipo um mas não tiver fechado minha peça no canto.
            if (armandoTipoUm) {
                return desarmarTipoUm();
            }
            // Se estiver armando do tipo dois, jogar na quina que fecha a jogada e força
            // ele a me bloquear.
            if (armandoTipoDois) {
                return desarmarTipoDois();
            }
            // Caso o bot tenha jogado no meio, é melhor não jogar em quinas 
            // ou caso o jogador esteja armando o tipo 1 e não me prendeu.
            if (jogarNaSegundaOpcao || temMeioJogarLado) {
                return getTab()[possiveis[1].x][possiveis[1].y];
            }
            var podeNaoJogarMeio = possiveis.length > 1
                && possiveis[0].x === possiveis[0].y && possiveis[0].x === 1;
            var emDiagonalComUltima = ULTIMA_JOGADA.x === possiveis[1].x || ULTIMA_JOGADA.y === possiveis[1].y;
            // Se for possível não jogar no meio (com a segunda jogada), apenas jogará se estiver
            // armando do tipo um e a segunda jogada não estiver na diagonal com a última peça jogada. 
            if (podeNaoJogarMeio && armandoTipoUm && emDiagonalComUltima) {
                return getTab()[possiveis[1].x][possiveis[1].y];
            // Se estiver armando do tipo três e a peça a ser jogada não estiver na quina.
            } else if (armandoTipoTres && !isQuina(possiveis[0])) {
                return getTab()[possiveis[0].x][possiveis[0].y];
            }
        }

        /**
         * Desarma quando o tabuleiro está no tipo
         * - X -
         * X O -
         * - - -
         * ou qualquer variante, jogando na quina cercada por X's,
         * forçando o jogador e me bloquear.
         */
        function desarmarTipoUm() {
            var t = getTab();
            var peca;
            if (t[0][1].peca === PECA_ADV) {
                peca = t[1][0].peca === PECA_ADV ? t[0][0] : t[0][2];
            }
            if (isUndf(peca)) {
                peca = t[1][0].peca === PECA_ADV ? t[2][0] : t[1][2];
            }
            return isUndf(t[peca.x][peca.y].peca) ? peca : null;
        }

        /**
         * Desarma quando o tabuleiro está no tipo
         * - X -
         * - O -
         * X - -
         * ou qualquer variante, jogando na quina ao lado do X,
         * forçando o jogador a me bloquear.
         */
        function desarmarTipoDois() {
            var t = getTab();
            if (t[0][0].peca === PECA_ADV) {
                return t[1][2].peca === PECA_ADV ? t[0][2] : t[2][0];
            }
            if (t[0][2].peca === PECA_ADV) {
                return t[1][0].peca === PECA_ADV ? t[0][0] : t[2][2];
            }
            if (t[2][2].peca === PECA_ADV) {
                return t[1][0].peca === PECA_ADV ? t[2][0] : t[0][2];
            }
            if (t[2][0].peca === PECA_ADV) {
                return t[1][2].peca === PECA_ADV ? t[2][2] : t[0][0];
            }
        }

        /**
         * Verifica se o adversário está armando uma jogada com peças
         * no tipo:
         * X - -
         * - O -
         * - - X
         * ou qualquer variante, jogando em alguma casa que não seja quina,
         * forçando o jogador a me bloquear e travando o tabuleiro.
         */
        function oponenteArmandoTres() {
            var t = getTab();
            return t[0][0].peca === PECA_ADV && t[2][2].peca === PECA_ADV
                || t[0][2].peca === PECA_ADV && t[2][0].peca === PECA_ADV;
        }

        /**
         * Verifica se o adversário está armando uma jogada com peças
         * no tipo:
         * - X -
         * X - -
         * - - -
         * ou qualquer variante.
         */
        function oponenteArmandoUm() {
            var t = getTab();
            return (t[0][1].peca === PECA_ADV || t[2][1].peca === PECA_ADV)
                && (t[1][0].peca === PECA_ADV || t[1][2].peca === PECA_ADV);
        }

        /**
         * Verifica se o adversário está armando uma jogada com peças
         * no tipo:
         * - X -
         * - - -
         * X - -
         * ou qualquer variante.
         */
        function oponenteArmandoDois() {
            var t = getTab();
            return t[0][0].peca === PECA_ADV && (t[1][2].peca === PECA_ADV || t[2][1].peca === PECA_ADV)
                || t[2][0].peca === PECA_ADV && (t[1][2].peca === PECA_ADV || t[0][1].peca === PECA_ADV)
                || t[0][2].peca === PECA_ADV && (t[1][0].peca === PECA_ADV || t[2][1].peca === PECA_ADV)
                || t[2][2].peca === PECA_ADV && (t[1][0].peca === PECA_ADV || t[0][1].peca === PECA_ADV);
        }

        /**
         * Verifica se o adversário fechou minha peça no tipo:
         * O X -
         * X - -
         * - - -
         * ou qualquer variante
         */
        function oponenteFechouTipoUm() {
            var t = getTab();
            return t[0][0].peca === PECA_BOT && t[1][0].peca === PECA_ADV && t[0][1].peca === PECA_ADV ? t[0][0] :
                t[0][2].peca === PECA_BOT && t[1][2].peca === PECA_ADV && t[0][1].peca === PECA_ADV ? t[0][2] :
                    t[2][2].peca === PECA_BOT && t[1][2].peca === PECA_ADV && t[2][1].peca === PECA_ADV ? t[2][2] :
                        t[2][0].peca === PECA_BOT && t[2][1].peca === PECA_ADV && t[1][0].peca === PECA_ADV ? t[2][0] : null;


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
            return lista[0].peca === PECA_BOT && isUndf(lista[1].peca) && isUndf(lista[2].peca)
                ? lista[0] : lista[1].peca === PECA_BOT && isUndf(lista[0].peca) && isUndf(lista[2].peca)
                    ? lista[1] : lista[2].peca === PECA_BOT && isUndf(lista[0].peca) && isUndf(lista[1].peca)
                        ? lista[2] : null;
        }

        /**
         * Realiza a primeira jogada para o bot.
         */
        function primeiraJogada() {
            if (PRIMEIRA_JOGADA) {
                console.log("primeira jogada", PECA_JOGADA);
                var i, j;
                if (PECA_JOGADA.x === 1 && PECA_JOGADA.y === 1) {
                    i = Math.random() > 0.5 ? 0 : 2;
                    j = Math.random() > 0.5 ? 0 : 2;
                    return getTab()[i][j];
                }
                return getTab()[1][1];
            }
        }

        /**
         * Verifica se o tabuleiro está vazio.
         */
        function isTabVazio() {
            IS_TAB_VAZIO = true;
            var preenchidas = 0;
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    var peca = getTab()[i][j];
                    if (!isUndf(peca.peca)) {
                        PECA_JOGADA = peca;
                        preenchidas++;
                        IS_TAB_VAZIO = false;
                    }
                }
            }
            PRIMEIRA_JOGADA = preenchidas <= 1;
        }

        /**
         * Retorna uma lista com os número de zero a 3 exceto o passado.
         */
        function vPos(x) {
            return [(x + 1) % 3, (x + 2) % 3];
        }

        /**
         * @return True se o parametro for undefined ou null.
         */
        function isUndf(e) {
            return typeof (e) === 'undefined' || e === null;
        }

        /**
         * Verifica se uma peça está na quina do tabuleiro.
         * @return True se a peça estiver na quina.
         */
        function isQuina(peca) {
            return peca.x === 2 && (peca.y === 0 || peca.y === 2)
                || peca.y === 0 && (peca.x === 0 || peca.x === 2);
        }

        /**
         * Objeto posição, que guarda uma posição de 2 dimensões x e y.
         * @param x Posição x.
         * @param y Posição y.
         * @return Objeto Posição.
         */
        function Pos(x, y) {
            return {
                x: x,
                y: y
            };
        }
    }])
} ())