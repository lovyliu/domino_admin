var oss = angular.module('oss',
    [
        'api',
    ]
);

oss.service('oss.ossService',
    [
        '$http',
        '$q',
        'api',
        'common.commonService',
        function(
            $http,
            $q,
            api,
            commonService
        ){
            this.getDownloadFilePromise = function(){
                var sts_filter = {
                    duration_second: 3600,
                    method: "get"
                };
                var encode_url = encodeURI(commonService.constructURLParams(sts_filter).replace('?',''));
                var shaObj = new jsSHA("SHA-1", "TEXT");
                shaObj.setHMACKey("temp", "TEXT");
                shaObj.update(encode_url);
                sts_filter.signature = shaObj.getHMAC("B64");

                var defer = $q.defer();
                var url = api.oss.sts();
                $http.post(url,sts_filter)
                .then(function(response){
                    if(response.data){
                        var sts = response.data;
                        console.log(sts);
                        var client = new OSS.Wrapper({
                            accessKeyId: sts.AccessKeyId,
                            accessKeySecret: sts.AccessKeySecret,
                            stsToken: sts.SecurityToken,
                            endpoint: sts.FidDetail.Region,
                            bucket: sts.FidDetail.Bucket
                        });
                    }
                    defer.resolve(client);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getUploadFilePromise = function(){
                var sts_filter = {
                    duration_second: 3600,
                    method: "put"
                };
                var encode_url = encodeURI(commonService.constructURLParams(sts_filter).replace('?',''));
                var shaObj = new jsSHA("SHA-1", "TEXT");
                shaObj.setHMACKey("temp", "TEXT");
                shaObj.update(encode_url);
                sts_filter.signature = shaObj.getHMAC("B64");

                var defer = $q.defer();
                var url = api.oss.sts();
                $http.post(url,sts_filter)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.yusionUploadPromise = function(params){
                var defer = $q.defer();
                var url = api.oss.yusion_upload();
                $http.post(url,params)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            }
        }
    ]
);
