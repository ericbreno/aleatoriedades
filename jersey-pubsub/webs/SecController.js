(function () {
    'use strict';

    var module = angular.module("App");

    module.controller("SecController", ['MainService', function (MainService) {

        var self = this;
        
        this.servico;

        this.msgs = [];

        this.subscrever = function (canal) {
            MainService.iniciaConexao(canal, self.callback);
            self.servico = canal;
        };

        this.enviar = function(mensagem) {
            MainService.enviarMsg(mensagem);
        };

        this.callback = function (response) {
            self.msgs.push(response.responseBody);
            console.log(response);
            console.log(self.servico);
        };

        this.getMsgs = function() {
            return self.msgs;
        };
    }]);
} ());