(function () {
    'use strict';

    var module = angular.module("App");

    module.controller("MainController", ['MainService', function (MainService) {

        var self = this;

        this.msgs = ['bril', 'pqntaindo', 'scrr'];

        this.subscrever = function (canal) {
            MainService.iniciaConexao(canal, self.callback);
        };

        this.enviar = function(mensagem) {
            MainService.enviarMsg(mensagem);
        };

        this.callback = function (response) {
            self.msgs.push(response.responseBody);
            console.log(self.msgs);
        };

        this.getMsgs = function() {
            return self.msgs;
        };
    }]);
} ());