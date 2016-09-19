var app = angular.module('App', []);

'use strict';

(function () {
    app.service('MainService', [function () {
        var self = this;

        var inscritos = {};

        var preUnload = [];

        /**
         * Inscreve um callback para ser chamado quando
         * ocorrer alguma mudança no serviço específico.
         */
        this.callbackOnChange = function (servico, callback) {
            if (typeof (inscritos[servico]) === "undefined") {
                inscritos[servico] = [];
            }
            inscritos[servico].push(callback);
        };

        /**
         * Adiciona um callback para ser chamado quando a tab for fechada.
         */
        this.callbackOnUnload = function (callback) {
            preUnload.push(callback);
        };

        /**
         * Trata o evento de mudança de valor de alguma
         * propriedade, chamando os callbacks associados.
         */
        function tratarEvento(e) {
            var aAvisar = inscritos[e.key];
            if (typeof (aAvisar) !== "undefined") {
                aAvisar.forEach(function (callback) {
                    callback(e.newValue);
                });
            }
        }

        /**
         * Função inicial.
         */
        (function () {
            window.addEventListener('storage', function (e) {
                if (e.storageArea === localStorage) {
                    tratarEvento(e);
                }
            });
            window.addEventListener("beforeunload", function (e) {
                preUnload.forEach(function (callback) {
                    callback();
                });
            });
        })();
    }])
} ())