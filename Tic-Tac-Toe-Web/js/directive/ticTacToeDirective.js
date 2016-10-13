(function () {
    /**
     * Diretiva relacionada ao jogo de damas.
     * 
     * @author Eric Breno - 12/10/2016
     */
    app.directive('ticTacToe', [function () {
        return {
            restrict: 'E',
            templateUrl: 'view/ticTacToe.html'
        };
    }])
} ())