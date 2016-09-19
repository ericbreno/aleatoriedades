(function () {
    app.controller("SecController", ['$scope', 'MainService', function ($scope, MainService) {

        var self = this;

        var IDENTIFICADOR_CONEXAO = "segurandoConexao";

        var PROP_INFO_COMPARTILHADA = "econn";

        /**
         * Abre uma nova aba no endereço inicial e faz ela ficar em foco.
         */
        this.newTab = function () {
            var win = window.open('/', '');
            win.focus();
        };

        /**
         * Muda a mensagem que está sendo exibida para a tela. 
         * Esta é a ideia do callback, de quando algo mudar o que fazer.
         */
        this.mudarMsg = function (msg) {
            var cache = window.localStorage;
            var ok = false;
            if (cache.getItem(PROP_INFO_COMPARTILHADA) !== msg) {
                cache.setItem(PROP_INFO_COMPARTILHADA, msg);
            } else {
                ok = true;
            }
            $scope.textoMsg = "";
            $scope.estado = msg;
            if (ok) {
                $scope.$apply();
            }
        };

        /**
         * Faz a tab atual segurar a conexão, se ninguém tiver 
         * pego ela no meio tempo entre sua chamada e a execução.
         */
        this.segurarConexao = function () {
            var cache = window.localStorage;
            if (conexaoJaAberta()) {
                return;
            }
            cache.setItem(IDENTIFICADOR_CONEXAO, "true");
            MainService.callbackOnUnload(function () {
                cache.setItem(IDENTIFICADOR_CONEXAO, "false");
                cache.setItem(PROP_INFO_COMPARTILHADA, "");
            });
            $scope.descubra = "sim";
        };

        /**
         * Informa se a conexão com o servico já existe.
         */
        function conexaoJaAberta() {
            var cache = window.localStorage;
            return cache[IDENTIFICADOR_CONEXAO] === "true";
        }

        /**
         * Função inicial. Checa se existe alguém segurando a conexão, 
         * caso não exista ele segura a conexão, caso exista fica apenas
         * aguardando alguma atualização no evento ou alguem soltar
         * a conexão.
         */
        (function main() {
            $scope.descubra = "nao";
            $scope.estado = window.localStorage[PROP_INFO_COMPARTILHADA];
            if (!conexaoJaAberta()) {
                self.segurarConexao();
            } else {
                MainService.callbackOnChange(IDENTIFICADOR_CONEXAO, self.segurarConexao);
            }
            MainService.callbackOnChange(PROP_INFO_COMPARTILHADA, self.mudarMsg);
        })();
    }]);
} ())