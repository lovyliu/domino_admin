var protoRate = angular.module('protoRate',['api']);

protoRate.service('protoRate.protoRateService',
[
    '$http',
    '$q',
    'api',
    function(
        $http,
        $q,
        api
    ){
        this.listPromise = function(params){
            var defer = $q.defer();
            var params = params || '';
            var url = api.proto_rate.list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.detailPromise = function(proto_rate_id){
            var defer = $q.defer();
            var url = api.proto_rate.detail(proto_rate_id);
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.createProtoRatePromise = function(data){
            var defer = $q.defer();
            var url = api.proto_rate.list();
            $http.post(url,data)
            .then(function(response){
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.updateProtoRatePromise = function(proto_rate_id,data){
            var defer = $q.defer();
            var url = api.proto_rate.detail(proto_rate_id);
            $http.put(url,data)
            .then(function(response){
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };

        this.autoCalculatePromise = function(interest_rate){
            var defer = $q.defer();
            var url = api.proto_rate.auto_calculate_rate(interest_rate);
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.deleteProtoRatePromise = function(proto_rate_id){
            var defer = $q.defer();
            var url = api.proto_rate.detail(proto_rate_id);
            $http.delete(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };


    }
]);
