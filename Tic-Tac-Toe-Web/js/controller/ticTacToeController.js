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

        this.jogadas = [];

        var jogada = 1;

        this.getJogadas = function() {
            return self.jogadas;
        };

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
                    self.jogadas.push({ player: "Player", x: casa.x, y: casa.y });
                    casa.n = jogada;
                    jogada++;
                } else {
                    $scope.erro = "Você deve escolher uma casa válida";
                }
                if (vsBot() && !TicTacToeService.vezX && !self.isFinalizado()) {
                    casa = BotTicTacService.jogar(self.getTab());
                    TicTacToeService.jogar(casa);
                    casa.n = jogada;
                    jogada++;
                    $scope.infoJogo = TicTacToeService.attStatus();
                    self.jogadas.push({ player: "Bot", x: casa.x, y: casa.y });
                }
            }
        };

        /**
         * Limpa o tabuleiro, zera as jogadas e limpa a mensagem de erro.
         */
        this.resetar = function () {
            $scope.infoJogo = TicTacToeService.resetar();
            $scope.erro = "";
            if (vsBot()) {
                TicTacToeService.vezX = true;
            }
            self.jogadas = [];
            jogada = 1;
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
            if (vsBot()) {
                $scope.modoJogo = DUO_PLAYER;
            } else {
                $scope.modoJogo = SINGLE_PLAYER;
            }
            TicTacToeService.vezX = true;
            self.resetar();
            TicTacToeService.mudaTipoJogo();
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
         * Indica se o jogo é contra o bot.
         * @return True se o jogo for contra o bot.
         */
        function vsBot() {
            return TicTacToeService.vsBot; 
        }

        /**
         * Função inicial.
         */
        (function () {
            $scope.modoJogo = SINGLE_PLAYER;
            $scope.infoJogo = TicTacToeService.attStatus();
        })();
    }]);
} ())