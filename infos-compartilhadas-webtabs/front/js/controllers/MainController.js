var app = angular.module('App', []);

(function () {
    'use strict';
    app.controller('MainController', ['$scope', '$rootScope', function ($scope, $rootScope) {

        var self = this;

        $scope.estado = "testando...";
        $scope.descubra = "nao";

        this.popUp = function () {
            var win = window.open('/', '');
            win.focus();
        };

        this.mudarMsg = function (msg) {
            var cache = window.localStorage;
            if (cache.getItem("econn") !== msg) {
                cache.setItem("econn", msg);
            }
            $scope.textoMsg = "";
            $scope.estado = msg;
        };

        function segurarConexao() {
            $scope.descubra = "sim";
            var cache = window.localStorage;
            if (cache.segurandoConexao === "true") {
                return;
            }
            cache.setItem("segurandoConexao", "true");
            window.addEventListener("beforeunload", function (e) {
                cache.setItem("segurandoConexao", "false");
            });
            alert("segurando conexao");
        }

        (function main() {
            var cache = window.localStorage;
            if (cache.segurandoConexao !== "true") {
                segurarConexao();
            } else {
                $scope.estado = cache.econn;
            }
            window.addEventListener('storage', function (e) {
                if (e.storageArea === localStorage) {
                    self.mudarMsg(localStorage.getItem("econn"));
                    if (localStorage.segurandoConexao === "false") {
                        segurarConexao();
                    }
                    $scope.$apply();
                }
            });
        })();
    }]);
} ())