var upload = angular.module('upload',['api']);

upload.service('upload.uploadService',
[
    '$http',
    '$q',
    'api',
    function(
        $http,
        $q,
        api
    ){
        this.uploadPromise = function(file,type){
            var defer = $q.defer();
            var url = api.upload[type]();
            $http({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    file: file
                },
                transformRequest: function (data, headersGetter) {
                    console.log(data);
                    var formData = new FormData();
                    angular.forEach(data, function (value, key) {
                        formData.append(key, value);
                    });
                    return formData;
                }
            })
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.getTableTitlePromise = function(upload_type){
            var defer = $q.defer();
            var url = api.upload[upload_type]();
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.saveUploadPromise = function(params,upload_type){
            var defer = $q.defer();
            var url = api.upload[upload_type]() + (params || '');
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
