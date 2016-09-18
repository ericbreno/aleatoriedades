var app = angular.module('App', []);

(function () {
    'use strict';
    app.controller('MainController', ['$scope', function ($scope) {

        var self = this;

        /**
         * Abre uma nova aba no endereço inicial e faz ela ficar em foco.
         */
        this.popUp = function () {
            var win = window.open('/', '');
            win.focus();
        };

        /**
         * Muda a mensagem que está sendo exibida para a tela. 
         * Esta é a ideia do callback, de quando algo mudar o que fazer.
         */
        this.mudarMsg = function (msg) {
            var cache = window.localStorage;
            if (cache.getItem("econn") !== msg) {
                cache.setItem("econn", msg);
            }
            $scope.textoMsg = "";
            $scope.estado = msg;
        };

        /**
         * Faz a tab atual segurar a conexão, se ninguém tiver 
         * pego ela no meio tempo entre sua chamada e a execução.
         */
        function segurarConexao() {
            var cache = window.localStorage;
            if (cache.segurandoConexao === "true") {
                return;
            }
            pegueiAConexao();
            cache.setItem("segurandoConexao", "true");
            window.addEventListener("beforeunload", function (e) {
                cache.setItem("segurandoConexao", "false");
            });
            alert("segurando conexao");
        }

        /**
         * Callback a ser chamado quando a tab atual ficar responsável pela conexão.
         */
        function pegueiAConexao() {
            $scope.descubra = "sim";
        }

        /**
         * Função inicial. Checa se existe alguém segurando a conexão, 
         * caso não exista ele segura a conexão, caso exista fica apenas
         * aguardando alguma atualização no evento ou alguem soltar
         * a conexão.
         */
        (function main() {
            // Esta parte é apenas para o exemplo
            $scope.descubra = "nao";
            $scope.estado = "testando...";
            // ------ //
            var cache = window.localStorage;
            if (cache.segurandoConexao !== "true") {
                segurarConexao();
            } else {
                $scope.estado = cache.econn;
            }
            window.addEventListener('storage', function (e) {
                if (e.storageArea === localStorage) {
                    // Chamada do callback para quando houver alguma atualização
                    // no cache. Modificar, especificando, se a aplicação alterar 
                    // o cache para outras finalidades.
                    self.mudarMsg(localStorage.getItem("econn"));
                    if (localStorage.segurandoConexao === "false") {
                        segurarConexao();
                    }
                    // Apenas para o exemplo
                    $scope.$apply();
                    // ------ //
                }
            });
        })();
    }]);
} ())