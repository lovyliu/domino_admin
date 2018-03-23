var api = angular.module('api', []);
api.service('api.apiBaseService',function(){
    this.api_base = function() {
        // return 'http://192.168.0.180:8000/';
        return 'http://api.yusiontech.com:8000/';
    };
    this.oss_sts = function(){
        return 'http://oss.alpha.yusiontech.com:9100/';
    };
    this.zebra_base = function() {
        return 'http://zebra.yusiontech.com:8090/';
    };
});
