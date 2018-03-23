var vehicle = angular.module('vehicle',
    [
        'api',
    ]
);

vehicle.service('vehicle.vehicleService',
    [
        '$http',
        '$q',
        'api',
        function(
            $http,
            $q,
            api
        ){
            this.brandListPromise = function(params){
                var defer = $q.defer();
                var params = params || '';
                // trix-list superior__id=xxx
                var url = api.vehicle.brand_list() + params;
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.modelListPromise = function(params){
                var defer = $q.defer();
                var params = params || '';
                var url = api.vehicle.model_list() + params;
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.modelDetailPromise = function(model_id){
                var defer = $q.defer();
                var url = api.vehicle.model_detail(model_id);
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.createModelPromise = function(data){
                var defer = $q.defer();
                var url = api.vehicle.model_list();
                $http.post(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.updateModelPromise = function(model_id,data){
                var defer = $q.defer();
                var url = api.vehicle.model_detail(model_id);
                $http.put(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.deleteModelPromise = function(model_id){
                var defer = $q.defer();
                var url = api.vehicle.model_detail(model_id);
                $http.delete(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
        }
    ]
);
