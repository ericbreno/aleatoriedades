(function () {
    /**
     * Controller que gerencia o jogo de damas.
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
         * Indica se é a vez do branco jogar.
         */
        this.branco = false;

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
                cor: undefined
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
                if (casa.cor || casa.cor == 'branco' && self.branco || casa.cor == 'preto' && !self.branco) {
                    $scope.erro = "Você deve escolher uma casa válida";
                } else {
                    $scope.erro = "";
                    marcarCasa(casa);
                    self.branco = !self.branco;
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
            if (self.branco) {
                casa.cor = 'branco';
            } else {
                casa.cor = 'preto';
            }
        }

        /**
         * Atualiza o status do jogo, informando se houve algum ganhador
         * ou se o jogo terminou.
         */
        function attStatus() {
            self.finalizado = temVencedor() || jogadas === LIMITE_JOGADAS;
            if (!self.finalizado) {
                $scope.jogadorDaVez = "Vez do jogador ".concat(self.branco ? "branco" : "preto");
            } else if (jogadas === LIMITE_JOGADAS) {
                $scope.erro = "Jogo empatado. Clique em resetar";
            } else {
                $scope.jogadorDaVez = "Fim de jogo, ".concat(self.branco ? "preto" : "branco").concat(" venceu!");
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
            return (t[0][0].cor === t[1][1].cor && t[0][0].cor === t[2][2].cor) && t[0][0].cor
                || (t[0][2].cor === t[1][1].cor && t[0][2].cor === t[2][0].cor) && t[0][2].cor;
        }

        /**
         * Verifica se houve algum ganhador para a coluna passada.
         * 
         * @param coluna Coluna a ser verificada.
         */
        function verificaColuna(coluna) {
            var t = self.tab;
            return t[0][coluna].cor === t[2][coluna].cor && t[1][coluna].cor === t[2][coluna].cor && t[0][coluna].cor;
        }

        /**
         * Verifica se houve algum ganhador para a linha passada.
         * 
         * @param linha Linha a ser verificada.
         */
        function verificaLinha(linha) {
            var t = self.tab;
            return t[linha][0].cor === t[linha][1].cor && t[linha][0].cor === t[linha][2].cor && t[linha][0].cor;
        }

        /**
         * Limpa o tabuleiro, zera as jogadas e limpa a mensagem de erro.
         */
        this.resetar = function () {
            self.tab = [];
            for (var i = 0; i < 3; i++) {
                var linha = [];
                for (var j = 0; j < 3; j++) {
                    linha.push(new Casa());
                }
                self.tab.push(linha);
            }
            $scope.erro = "";
            jogadas = 0;
            attStatus();
        };

        /**
         * Função inicial.
         */
        (function () {
            self.resetar();
        })();
    }]);
} ())