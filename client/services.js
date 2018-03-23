var client = angular.module('client',['api']);

client.service('client.clientService',
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
            var url = api.client.list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.detailPromise = function(client_id){
            var defer = $q.defer();
            var url = api.client.detail(client_id);
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.createClientPromise = function(data){
            var defer = $q.defer();
            var url = api.client.list();
            $http.post(url,data)
            .then(function(response){
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.updateClientPromise = function(client_id,data){
            var defer = $q.defer();
            var url = api.client.detail(client_id);
            $http.put(url,data)
            .then(function(response){
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.deleteClientPromise = function(client_id){
            var defer = $q.defer();
            var url = api.client.detail(client_id);
            $http.delete(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.clientImgListPromise = function(client_id){
            var defer = $q.defer();
            var url = api.client.img_list(client_id);
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.clientImeiListPromise = function(params){
            var defer = $q.defer();
            var url = api.client.ubt_imei_list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.clientContactListPromise = function(data){
            var defer = $q.defer();
            var url = api.client.contact_list();
            $http.post(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.clientContactNetPromise = function(params){
            var defer = $q.defer();
            var url = api.client.contact_net() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.smsImeiListPromise = function(params){
            var defer = $q.defer();
            var url = api.client.ubt_imei_list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.smsPhoneListPromise = function(params){
            var defer = $q.defer();
            var url = api.client.sms_phone_list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.smsMsgListPromise = function(params){
            var defer = $q.defer();
            var url = api.client.sms_msg_list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.ubtImeiListPromise = function(params){
            var defer = $q.defer();
            var url = api.client.ubt_imei_list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.ubtPvCountPromise = function(params){
            var defer = $q.defer();
            var url = api.client.ubt_pv_count() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.ubtPvListPromise = function(params){
            var defer = $q.defer();
            var url = api.client.ubt_pv_list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.ubtPvCountHourPromise = function(params){
            var defer = $q.defer();
            var url = api.client.ubt_pv_count_hour() + params;
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
