(function () {
    /**
     * Controller que gerencia o jogo da velha.
     * 
     * @author Eric Breno - 12/10/2016
     */
    app.controller('TicTacToeController', ['$scope', function ($scope) {

        var self = this;

        /**
         * Limite máximo de jogadas que podem ocorrer no jogo.
         */
        var LIMITE_JOGADAS = 9;

        /**
         * Indica se é a vez do X jogar.
         */
        this.vezX = false;

        /**
         * Indicador se o jogo está finalizado, ou seja, não podem
         * ocorrer mais jogadas.
         */
        this.finalizado = false;

        /**
         * Quantidade de jogadas realizadas até o momento.
         */
        var jogadas = 0;

        /**
         * Objeto que representa as casas do tabuleiro.
         */
        function Casa() {
            return {
                peca: undefined
            };
        };

        /**
         * Tabuleiro.
         */
        this.tab = [];

        /**
         * Realiza a jogada na casa selecionada, marcando de acordo 
         * com o jogador da vez.
         * 
         * @param casa Casa a ser marcada.
         */
        this.realizarJogada = function (casa) {
            if (!self.finalizado) {
                if (casa.peca || casa.peca === 'X' && self.vezX || casa.peca === 'O' && !self.vezX) {
                    $scope.erro = "Você deve escolher uma casa válida";
                } else {
                    $scope.erro = "";
                    marcarCasa(casa);
                    self.vezX = !self.vezX;
                    jogadas++;
                    attStatus();
                }
            }
        };

        /**
         * Marca a casa selecionada de acordo com o jogador da vez.
         * 
         * @param casa Casa a ser marcada.
         */
        function marcarCasa(casa) {
            if (self.vezX) {
                casa.peca = 'X';
            } else {
                casa.peca = 'O';
            }
        }

        /**
         * Atualiza o status do jogo, informando se houve algum ganhador
         * ou se o jogo terminou.
         */
        function attStatus() {
            self.finalizado = temVencedor() || jogadas === LIMITE_JOGADAS;
            if (!self.finalizado) {
                $scope.infoJogo = "Vez do jogador ".concat(self.vezX ? "X" : "O");
            } else if (jogadas === LIMITE_JOGADAS && !temVencedor()) {
                $scope.erro = "Jogo empatado. Clique em resetar";
            } else {
                $scope.infoJogo = "Fim de jogo, ".concat(self.vezX ? "O" : "X").concat(" venceu!");
            }
        }

        /**
         * Informa se existe um vencedor para o jogo.
         *
         * @returns True se houver vencedor.
         */
        function temVencedor() {
            return verificaLinha(0) || verificaLinha(1) || verificaLinha(2)
                || verificaColuna(0) || verificaColuna(1) || verificaColuna(2)
                || verificaDiagonais();
        }

        /**
         * Verifica se algum jogador ganhou em algum das diagonais.
         */
        function verificaDiagonais() {
            var t = self.tab;
            return (t[0][0].peca === t[1][1].peca && t[0][0].peca === t[2][2].peca) && t[0][0].peca
                || (t[0][2].peca === t[1][1].peca && t[0][2].peca === t[2][0].peca) && t[0][2].peca;
        }

        /**
         * Verifica se houve algum ganhador para a coluna passada.
         * 
         * @param coluna Coluna a ser verificada.
         */
        function verificaColuna(coluna) {
            var t = self.tab;
            return t[0][coluna].peca === t[2][coluna].peca && t[1][coluna].peca === t[2][coluna].peca && t[0][coluna].peca;
        }

        /**
         * Verifica se houve algum ganhador para a linha passada.
         * 
         * @param linha Linha a ser verificada.
         */
        function verificaLinha(linha) {
            var t = self.tab;
            return t[linha][0].peca === t[linha][1].peca && t[linha][0].peca === t[linha][2].peca && t[linha][0].peca;
        }

        /**
         * Limpa o tabuleiro, zera as jogadas e limpa a mensagem de erro.
         */
        this.resetar = function () {
            self.tab.forEach(function(linha){
                linha.forEach(function(elemento){
                    elemento.peca = "";
                });
            });
            $scope.erro = "";
            jogadas = 0;
            attStatus();
        };

        /**
         * Função inicial.
         */
        (function () {
            for (var i = 0; i < 3; i++) {
                var linha = [];
                for (var j = 0; j < 3; j++) {
                    linha.push(new Casa());
                }
                self.tab.push(linha);
            }
            attStatus();
        })();
    }]);
} ())