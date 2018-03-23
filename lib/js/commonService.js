var common = angular.module('common', []);
common.service('common.commonService', [
    '$q',
    '$http',
    '$rootScope',
    '$filter',
    'api',
    function($q,$http,$rootScope,$filter,api) {
    this.constructURLParams = function(fields) {
        if (angular.isObject(fields)) {
            var params = '?';
            angular.forEach(fields, function(value, key) {
                if (angular.isArray(value)) {
                    if (value.length) {
                        if (params !== '?') {
                            params += '&';
                        }
                        params += key + '=' + encodeURIComponent(value).join(
                            ',');
                    }
                } else if (value || value === 0) {
                    if (params !== '?') {
                        params += '&';
                    }
                    params += key + '=' + encodeURIComponent(value);
                }
            });
            return params;
        }
        return '';
    };
    this.name_map = function() {
        var name_map = {
            '银行卡号': {
                first: 'card',
                second: 'num'
            },
            '开户行名称': {
                first: 'card',
                second: 'bank'
            },
            '银行名称': {
                first: 'card',
                second: 'bank'
            },
            '客户身份证号码': {
                first: 'digest',
                second: 'clt_id_num'
            },
            '品牌': {
                first: 'vehicle',
                second: 'brand',
                third: 'brand'
            },
            '子品牌': {
                first: 'vehicle',
                second: 'brand',
                third: 'sub_brand'
            },
            '车系': {
                first: 'vehicle',
                second: 'brand',
                third: 'series'
            },
            '型号': {
                first: 'vehicle',
                second: 'model',
                third: 'model_name'
            },
            '颜色': {
                first: 'vehicle',
                second: 'color'
            },
            '车架号': {
                first: 'vehicle',
                second: 'vim'
            },
            '经销商名称': {
                first: 'dealer',
                second: 'name'
            },
            'SP 名称': {
                first: 'dealer',
                second: 'sp'
            },
            '放款审核通过时间': {
                first: 'uw',
                second: 'uw_time'
            },
            '回盘文件上传时间': {
                first: 'uw',
                second: 'x_time'
            }
        }
        return name_map;
    };
    this.errorModal = function(status_code) {
        console.log(status_code)
        if (status_code == '500') {
            $rootScope.openModal('modal-confirm',
                '服务器出错，请联系程序员葛格', '操作提示');
        } else if (status_code == '401') {
            $rootScope.openModal('modal-confirm',
                '用户未授权，请尝试注销重新登录', '操作提示');
        } else if (status_code == '400') {
            $rootScope.openModal('modal-confirm',
                '请求出错，请联系前端er', '操作提示');
        }
    };
    this.responseModal = function(status_code,response){
        status_code = status_code.toString();
        if(response && status_code != '500' && typeof(response) == 'object'){
            var msg = '';
            angular.forEach(response,function(error_msg,error_name){
                console.log(error_msg)
                msg += error_msg + ' ';
            });
            // var msg = response.data.msg || response.data;
            $rootScope.openModal('modal-confirm', '操作失败：' + msg, '操作提示');
        }
        else{
            if (status_code[0] == '2') {
                $rootScope.openModal('modal-confirm','操作成功', '操作提示');
            }else if (status_code == '500') {
                $rootScope.openModal('modal-confirm','请求出错，请联系程序员葛格', '操作提示');
            } else if (status_code == '401') {
                $rootScope.openModal('modal-confirm','用户未授权，请尝试注销重新登录', '操作提示');
            } else if (status_code == '404') {
                $rootScope.openModal('modal-confirm','请求出错，请联系程序员葛格', '操作提示');
            } else if (status_code == '400') {
                $rootScope.openModal('modal-confirm','400 Bad Request', '操作提示');
            }
        }
    };
    this.client_roles = function(){
        var roles = {
            "lender": "主贷人",
            "lender_sp": "借款人配偶",
            "guarantor": "担保人",
            "guarantor_sp": "担保人配偶",
            "counter_guarantor": "反担保人",
            "counter_guarantor_sp": "反担保人配偶"
        };
        return roles;
    };
    this.get_province = function(){
        var defer = $q.defer();
        var params = params || '';
        var url = api.area.province() + params;
        $http.get(url)
        .then(function(response){
            defer.resolve(response.data);
        },function(error){
            defer.reject(error);
        });
        return defer.promise;
    };
    this.get_city_district = function(parent_id){
        var defer = $q.defer();
        // var params = params || '';
        var url = api.area.city_district(parent_id);
        $http.get(url)
        .then(function(response){
            defer.resolve(response.data);
        },function(error){
            defer.reject(error);
        });
        return defer.promise;
    };
    this.filterArea = function(id_in){
        var defer = $q.defer();
        var url = api.area.filter_area(id_in);
        $http.get(url)
        .then(function(response){
            defer.resolve(response.data);
        },function(error){
            defer.reject(error);
        });
        return defer.promise;
    };
    this.filter_area_id = function(list,areaname){
        console.log(list,areaname)
        var obj = {
            areaname: areaname
        };
        console.log($filter("filter")(list, obj))
        var area_id = $filter("filter")(list, obj) && $filter("filter")(list, obj).length ?
            $filter("filter")(list, obj)[0].id : null;
        return area_id;
    };
    this.employee_status = function(){
        return {
            A: "已激活",
            N: '未激活'
            // P: "待审核",
            // D: "失效",
            // R: "拒绝"
        };
    };
    this.staff_status = function(){
        return {
            A: "已激活",
            N: '未激活'
        };
    };
    this.employee_role = function(){
        return {
            S: '销售',
            D: 'dfim'
        };
    };
    this.dealer_role = function(){
        return {
            SP: 'SP',
            D: '直营店'
        };
    };
    this.dealer_status = function(){
        return {
            A: "已激活",
            N: '未激活'
        };
    };
    this.dealer_proto_rate_status = function(){
        return {
            A: "已激活",
            N: '未激活'
        };
    };
}]);
