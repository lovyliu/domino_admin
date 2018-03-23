var calculator = angular.module('calculator',['api']);

calculator.service('calculator.calculatorService',
[
    '$http',
    '$q',
    'api',
    function(
        $http,
        $q,
        api
    ){
        this.calculatePromise = function(params){
            var defer = $q.defer();
            var url = api.calculator.calculator() + params || '';
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
    }
]);
