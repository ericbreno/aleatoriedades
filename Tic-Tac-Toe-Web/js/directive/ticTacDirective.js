(function () {
    app.directive('ticTac', [function () {
        return {
            scope: {
                peca: '='
            },
            template: '<div class="peca-{{peca|lowercase}} text-center">{{peca}}</div>'
        }
    }]);
} ())