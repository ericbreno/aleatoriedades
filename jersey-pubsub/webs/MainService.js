(function () {
    'use strict';

    var module = angular.module("App", []);

    module.service('MainService', [function () {
        var socket = atmosphere;

        var subSocket;

        this.iniciaConexao = function (servico, callback) {

            console.log("Iniciando inscricao para o canal " + servico);

            var request = {
                url: 'http://localhost:8080/pubsub/' + servico,
                trackMessageLength: true,
                transport: 'long-polling'
            };

            request.onMessage = function (response) {
                callback(response);
            };

            subSocket = socket.subscribe(request);
        };

        this.enviarMsg = function (mensagem) {
            if (subSocket === undefined) {
                alert("Voce precisa entrar em uma sala antes de começar!");
                return;
            }
            subSocket.push({ data: "message=" + mensagem });
        };
    }])
} ())