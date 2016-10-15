(function () {
    /**
     * Controller que gerencia o jogo da velha.
     * 
     * @author Eric Breno - 12/10/2016
     */
    app.controller('TicTacToeController', ['$scope', 'TicTacToeService', 'BotTicTacService', function ($scope, TicTacToeService, BotTicTacService) {

        var self = this;

        var SINGLE_PLAYER = "Player vs Bot";

        var DUO_PLAYER = "Player vs Player";

        var PRIMEIRA_MUDANCA = true;

        /**
         * Indica se está no modo contra o bot.
         */
        this.vsBot = true;

        /**
         * Realiza a jogada na casa selecionada, marcando de acordo 
         * com o jogador da vez.
         * 
         * @param casa Casa a ser marcada.
         */
        this.realizarJogada = function (casa) {
            if (!self.isFinalizado()) {
                if (TicTacToeService.jogar(casa)) {
                    $scope.erro = "";
                    $scope.infoJogo = TicTacToeService.attStatus();
                } else {
                    $scope.erro = "Você deve escolher uma casa válida";
                }
                if (self.vsBot && !TicTacToeService.vezX && !self.isFinalizado()) {
                    casa = BotTicTacService.jogar(self.getTab());
                    TicTacToeService.jogar(casa);
                    $scope.infoJogo = TicTacToeService.attStatus();
                }
            }
        };

        /**
         * Limpa o tabuleiro, zera as jogadas e limpa a mensagem de erro.
         */
        this.resetar = function () {
            $scope.infoJogo = TicTacToeService.resetar();
            $scope.erro = "";
            if (self.vsBot) {
                TicTacToeService.vezX = true;
            }
        };

        /**
         * Altera o tipo de jogo de single player para duo player
         * e vice versa.
         */
        this.mudarTipoJogo = function () {
            if (PRIMEIRA_MUDANCA) {
                alert("Ao alterar o modo de jogo o tabuleiro é resetado.");
                PRIMEIRA_MUDANCA = false;
                return;
            }
            if (self.vsBot) {
                $scope.modoJogo = DUO_PLAYER;
            } else {
                $scope.modoJogo = SINGLE_PLAYER;
            }
            TicTacToeService.vezX = true;
            self.resetar();
            self.vsBot = !self.vsBot;
        };

        /**
         * Retorna o tabuleiro do jogo.
         * @return Tabuleiro do jogo.
         */
        this.getTab = function () {
            return TicTacToeService.tab;
        };

        /**
         * Indica se o jogo está finalizado.
         * @return True se o jogo estiver finalizado.
         */
        this.isFinalizado = function () {
            return TicTacToeService.finalizado;
        };

        /**
         * Função inicial.
         */
        (function () {
            $scope.modoJogo = SINGLE_PLAYER;
            BotTicTacService.controller = self;
            $scope.infoJogo = TicTacToeService.attStatus();
        })();
    }]);
} ())