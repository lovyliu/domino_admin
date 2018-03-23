var bank = angular.module('bank',['api']);

bank.service('bank.bankService',
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
            var url = api.bank.list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.detailPromise = function(bank_id){
            var defer = $q.defer();
            var url = api.bank.detail(bank_id);
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.createBankPromise = function(data){
            var defer = $q.defer();
            var url = api.bank.list();
            $http.post(url,data)
            .then(function(response){
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.updateBankPromise = function(bank_id,data){
            var defer = $q.defer();
            var url = api.bank.detail(bank_id);
            $http.put(url,data)
            .then(function(response){
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.patchBankPromise = function(bank_id,data){
            var defer = $q.defer();
            var url = api.bank.detail(bank_id);
            $http.patch(url,data)
            .then(function(response){
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.deleteBankPromise = function(bank_id){
            var defer = $q.defer();
            var url = api.bank.detail(bank_id);
            $http.delete(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.bankPlateListPromise = function(bank_id,params){
            var defer = $q.defer();
            var params = params || '';
            var url = api.bank.bank_plate(bank_id) + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.updateBankPlatePromise = function(bank_id,data){
            var defer = $q.defer();
            var url = api.bank.bank_plate(bank_id);
            $http({
                method: 'PUT',
                url: url,
                data: data
            })
            .then(function(response){
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };


    }
]);
