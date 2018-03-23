bank.controller('bankListController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    'common.commonService',
    'bank.bankService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        commonService,
        bankService
    ) {
        $scope.page_state = {
            filters: {
                limit: 20,
            }
        };

        $scope.searchBanks = function(){
            var params = commonService.constructURLParams($scope.page_state.filters);
            bankService.listPromise(params)
            .then(function(response){
                console.log(response);
                if(response){
                    $scope.bank_list = response.results;
                    $scope.page_state.count = response.count;
                }
            });
        };
        $scope.searchFirstBanks = function(){
            $scope.page_state.current_page = 1;
            $scope.page_state.filters.offset = 0;
            $scope.searchBanks();
        };
        $scope.searchFirstBanks();


        $scope.page_state.current_page = 1;
        $scope.page_state.filters.offset = 0;
        $scope.pageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.page_state.filters.offset = (page - 1) * 20;
            }
            else{
                $scope.page_state.filters.offset = 0;
            }
            $scope.searchBanks();
        };

    }
])
.controller('bankDetailController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    '$timeout',
    '$filter',
    'common.commonService',
    'protoRate.protoRateService',
    'applications.applicationsService',
    'bank.bankService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        $timeout,
        $filter,
        commonService,
        protoRateService,
        applicationsService,
        bankService
    ) {
        var bank_id = $stateParams.bank_id;
        $scope.post_data = {};
        $scope.page_state = {
            proto_rate_filters:{
                limit: 20
            },
            plate_filters: {
                limit: 20,
                offset: 0
            }
        };
        $scope.search = {};
        applicationsService.choiceConfigPromise('?tag=bank_type')
        .then(function(response){
            $scope.bank_types = response.result;
        });
        $scope.changeTab = function(tab){
            $scope.tab = tab;
            if(tab == 'proto_rate'){
                $scope.searchProtoRate();
            }
            else if(tab == 'plate'){
                if($scope.province_list){
                    $scope.selectProvince(0);
                }
                var params = '?limit=100&level=1';
                bankService.bankPlateListPromise(bank_id,params)
                .then(function(added_response){
                    if(added_response.count){
                        $scope.added_province_list = angular.copy(added_response.results);
                        $scope.selectAddedProvince(0);
                    }
                },function(error){

                });
            }
        };

        $scope.changeTab('basic');

        bankService.detailPromise(bank_id)
        .then(function(response){
            console.log(response);
            if(response){
                $scope.post_data = response;
                $scope.added_proto_rate_id_list = response.rate;
            }
        });
        commonService.get_province()
        .then(function(response){
            if(response){
                $scope.province_list = response.results;
            }
        });

        $scope.selected_place = {
            id: null,
            name: null,
            level: null
        };
        $scope.selectProvince = function(index){
            if($scope.province_list && $scope.province_list.length){
                $scope.selected_place = {
                    id: $scope.province_list[index].id,
                    name: $scope.province_list[index].areaname,
                    level: 1
                };
                getCityList(index);
            }
        };
        $scope.selectCity = function(index){
            if($scope.city_list && $scope.city_list.length){
                $scope.selected_place = {
                    id: $scope.city_list[index].id,
                    name: $scope.city_list[index].areaname,
                    level: 2
                };
                getDistrictList(index);
            }
        };
        $scope.selectDistrict = function(index){
            if($scope.district_list && $scope.district_list.length){
                $scope.selected_place = {
                    id: $scope.district_list[index].id,
                    name: $scope.district_list[index].areaname,
                    level: 3
                };
                $scope.selected_district_id = $scope.district_list[index].id;
            }
        };
        function getCityList(province_index){
            var selected_province_id = $scope.province_list[province_index].id;
            commonService.get_city_district(selected_province_id)
            .then(function(response){
                if(response) {
                    // var city_list = angular.copy(response.results);
                    $scope.city_list = angular.copy(response.results);
                    getDistrictList(0);
                    // var params = '?limit=100&level=2&parent__id=' + selected_province_id;
                    // bankService.bankPlateListPromise(bank_id,params)
                    // .then(function(added_response){
                    //     if(added_response.count){
                    //         var province_added_city_list = angular.copy(added_response.results);
                    //         if(province_added_city_list.length){
                    //             var list = angular.copy(city_list);
                    //             angular.forEach(province_added_city_list,function(added_city){
                    //                 angular.forEach(list,function(city,city_index){
                    //                     if(added_city.id == city.id){
                    //                         list.splice(city_index,1);
                    //                     }
                    //                 });
                    //             });
                    //             $scope.city_list = angular.copy(list);
                    //         }
                    //         else{
                    //             $scope.city_list = angular.copy(city_list);
                    //         }
                    //     }
                    //     else{
                    //         $scope.city_list = angular.copy(city_list);
                    //     }
                    //     getDistrictList(0);
                    // },function(error){
                    //     $scope.city_list = angular.copy(city_list);
                    //     getDistrictList(0);
                    // });
                }
            });
        };
        function getDistrictList(city_index){
            var selected_city_id = $scope.city_list[city_index].id;
            commonService.get_city_district(selected_city_id)
            .then(function(response){
                if(response) {
                    // var district_list = angular.copy(response.results);
                    $scope.district_list = angular.copy(response.results);
                    // var params = '?limit=100&level=3&parent__id=' + selected_city_id;
                    // bankService.bankPlateListPromise(bank_id,params)
                    // .then(function(added_response){
                    //     if(added_response.count){
                    //         var city_added_district_list = angular.copy(added_response.results);
                    //         if(city_added_district_list.length){
                    //             var list = angular.copy(city_list);
                    //             angular.forEach(city_added_district_list,function(added_district){
                    //                 angular.forEach(list,function(district,district_index){
                    //                     if(added_district.id == district.id){
                    //                         list.splice(district_index,1);
                    //                     }
                    //                 });
                    //             });
                    //             $scope.district_list = angular.copy(list);
                    //         }
                    //         else{
                    //             $scope.district_list = angular.copy(district_list);
                    //         }
                    //     }
                    //     else{
                    //         $scope.district_list = angular.copy(district_list);
                    //     }
                    // },function(error){
                    //     $scope.district_list = angular.copy(district_list);
                    // });

                }
            });
        };

        $scope.selected_added_place = {
            id: null,
            name: null,
            level: null
        };
        $scope.selectAddedProvince = function(index){
            if($scope.added_province_list && $scope.added_province_list.length){
                $scope.selected_added_place = {
                    id: $scope.added_province_list[index].id,
                    name: $scope.added_province_list[index].areaname,
                    level: 1
                };
                getAddedCityList(index);
            }
        };
        $scope.selectAddedCity = function(index){
            if($scope.added_city_list && $scope.added_city_list.length){
                $scope.selected_added_place = {
                    id: $scope.added_city_list[index].id,
                    name: $scope.added_city_list[index].areaname,
                    level: 2
                };
                getAddedDistrictList(index);
            }
        };
        $scope.selectAddedDistrict = function(index){
            if($scope.added_district_list && $scope.added_district_list.length){
                $scope.selected_added_place = {
                    id: $scope.added_district_list[index].id,
                    name: $scope.added_district_list[index].areaname,
                    level: 3
                };
            }
        };
        function getAddedCityList(added_province_index){
            var selected_added_province_id = $scope.added_province_list[added_province_index].id;
            var params = '?limit=100&level=2&parent__id=' + selected_added_province_id;
            bankService.bankPlateListPromise(bank_id,params)
            .then(function(added_response){
                if(added_response.count){
                    $scope.added_city_list = angular.copy(added_response.results);
                }
                getAddedDistrictList(0);
            },function(error){
            });
        };
        function getAddedDistrictList(added_city_index){
            var selected_added_city_id = $scope.added_city_list[added_city_index].id;
            var params = '?limit=100&level=3&parent__id=' + selected_added_city_id;
            bankService.bankPlateListPromise(bank_id,params)
            .then(function(added_response){
                if(added_response.count){
                    $scope.added_district_list = angular.copy(added_response.results);
                }
            },function(error){
            });
        };

        $scope.addToPlateList = function(){
            if($scope.selected_place.id){
                var ids = [];
                ids[0] = $scope.selected_place.id;
                var post_data = {
                    level: $scope.selected_place.level,
                    ids: ids,
                    method: 'add'
                };
                bankService.updateBankPlatePromise(bank_id,post_data)
                .then(function(response){
                    $scope.changeTab('plate');
                });
            }
        };
        $scope.removeFromPlateList = function(){
            if($scope.selected_added_place.id){
                var ids = [];
                ids[0] = $scope.selected_added_place.id;
                var post_data = {
                    level: $scope.selected_added_place.level,
                    ids: ids,
                    method: 'remove'
                };
                bankService.updateBankPlatePromise(bank_id,post_data)
                .then(function(response){
                    $scope.changeTab('plate');
                });
            }
        };

        $scope.addAllProvince = function(){
            var province_id_list = [];
            angular.forEach($scope.province_list,function(province){
                province_id_list.push(province.id);
            });
            var post_data = {
                level: 1,
                ids: province_id_list,
                method: 'add'
            };
            bankService.updateBankPlatePromise(bank_id,post_data)
            .then(function(response){
                $scope.changeTab('plate');
            });
        };
        var deleted_province = false;
        $scope.removeAllProvince = function(){
            deleted_province = false;
                $rootScope.openModal('modal-basic',
                    '是否删除金融机构中全部备案地？',
                    '删除备案地',
                    '确认删除',
                    '放弃',
                    'delete-confirm'
                );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!deleted_province){
                        $timeout(function(){
                            var province_id_list = [];
                            angular.forEach($scope.province_list,function(province){
                                province_id_list.push(province.id);
                            });
                            var post_data = {
                                level: 1,
                                ids: province_id_list,
                                method: 'remove'
                            };
                            bankService.updateBankPlatePromise(bank_id,post_data)
                            .then(function(response){
                                $scope.added_province_list = [];
                                $scope.added_city_list = [];
                                $scope.added_district_list = [];
                            });
                        });
                    }
                }
                deleted_province = true;
            });

        };


        $scope.updateBank = function(){
            $scope.post_data.rate = $scope.added_proto_rate_id_list;
            bankService.updateBankPromise(bank_id,$scope.post_data)
            .then(function(response){
                console.log(response);
                if(response){
                    commonService.responseModal('200');
                }
            },function(error){
                commonService.responseModal(error.status);
            });
        };

        $scope.searchAddedPlates = function(){
            $scope.page_state.plate_filters.level = 3;
            $scope.page_state.plate_filters.whatever = $scope.page_state.search_added_name;
            var params = commonService.constructURLParams($scope.page_state.plate_filters);
            bankService.bankPlateListPromise(bank_id,params)
            .then(function(response){
                $scope.added_plate_list = angular.copy(response.results);
                $scope.page_state.plate_count = response.count;
            },function(error){
            });
        };
        $scope.searchAddedPlates();

        $scope.page_state.plate_current_page = 1;
        $scope.page_state.plate_filters.offset = 0;
        $scope.platePageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.page_state.plate_filters.offset = (page - 1) * 20;
            }
            else{
                $scope.page_state.plate_filters.offset = 0;
            }
            $scope.searchAddedPlates();
        };


        $scope.searchProtoRate = function(){
            var params = '?limit=1000';
            if($scope.search.proto_rate){
                params = params + '&name=' + $scope.search.proto_rate;
            }
            protoRateService.listPromise(params)
            .then(function(response){
                if(response){
                    var proto_rate_list = angular.copy(response.results);
                    $scope.origin_proto_rate_list = angular.copy(response.results);
                    if(proto_rate_list.length){
                        console.log($scope.added_proto_rate_id_list);
                        if($scope.added_proto_rate_id_list.length){
                            var params = '?limit=1000&id_in=' + $scope.added_proto_rate_id_list;
                            protoRateService.listPromise(params)
                            .then(function(added_proto_rate_response){
                                if(response){
                                    $scope.added_proto_rate_list = angular.copy(added_proto_rate_response.results);
                                    $scope.bank_proto_rate_list = angular.copy(added_proto_rate_response.results);
                                    $scope.page_state.count = added_proto_rate_response.count;
                                    if($scope.added_proto_rate_list.length){
                                        var list = angular.copy(proto_rate_list);
                                        angular.forEach($scope.added_proto_rate_list,function(added_proto_rate){
                                            angular.forEach(list,function(proto_rate,proto_rate_index){
                                                if(added_proto_rate.id == proto_rate.id){
                                                    list.splice(proto_rate_index,1);
                                                }
                                            });
                                        });
                                        $scope.proto_rate_list = angular.copy(list);
                                        $scope.selectAddedProtoRate(0);
                                        $scope.selectProtoRate(0);
                                    }
                                    else{
                                        $scope.proto_rate_list = angular.copy(proto_rate_list);
                                    }
                                }
                                else{
                                    $scope.proto_rate_list = angular.copy(proto_rate_list);
                                }
                            },function(error){
                                $scope.proto_rate_list = angular.copy(proto_rate_list);
                            });
                        }
                        else{
                            $scope.proto_rate_list = angular.copy(proto_rate_list);
                        }
                    }
                    else{
                        $scope.proto_rate_list = angular.copy(proto_rate_list);
                    }
                    $scope.selectProtoRate(0);
                }
            });

        };
        // $scope.searchAddedProtoRate = function(){
        //     if($scope.added_proto_rate_id_list.length){
        //         var params = '?limit=1000&id_in=' + $scope.added_proto_rate_id_list + '&name=' + $scope.search.added_proto_rate;
        //         protoRateService.listPromise(params)
        //         .then(function(response){
        //             if(response){
        //                 $scope.added_proto_rate_search_list = response.results;
        //                 if($scope.added_proto_rate_search_list.length){
        //                     $scope.toggleAddedProtoRate(0);
        //                 }
        //             }
        //         });
        //     }
        // };
        $scope.selectProtoRate = function(index){
            $scope.selected_proto_rate_index = index;
            if($scope.proto_rate_list && $scope.proto_rate_list.length){
                $scope.selected_proto_rate_id = $scope.proto_rate_list[index].id;
            }
        };
        $scope.selectAddedProtoRate = function(index){
            $scope.selected_added_proto_rate_index = index;
            var list = $scope.added_proto_rate_search_list || $scope.added_proto_rate_list;
            $scope.selected_added_proto_rate_id = $scope.added_proto_rate_list[index].id;
        };

        $scope.added_proto_rate_id_list = [];
        $scope.added_proto_rate_list = [];
        // $scope.show_added_proto_rate_list = [];
        $scope.addToProtoRateList = function(){
            if($scope.added_proto_rate_id_list.indexOf($scope.selected_proto_rate_id) == -1){
                $scope.added_proto_rate_id_list.push($scope.selected_proto_rate_id);
                var list = $scope.proto_rate_list;
                $scope.added_proto_rate_list.push(list[$scope.selected_proto_rate_index]);
                $scope.proto_rate_list.splice($scope.selected_proto_rate_index,1);
                $scope.updateBankProtoRate();
                $scope.selectProtoRate(0);
                $scope.selectAddedProtoRate(0);
            }
        };
        $scope.addAllToProtoRateList = function(){
            $scope.added_proto_rate_id_list = [];
            $scope.added_proto_rate_list = [];
            var list = angular.copy($scope.origin_proto_rate_list);
            angular.forEach(list,function(proto_rate){
                $scope.added_proto_rate_id_list.push(proto_rate.id);
                $scope.added_proto_rate_list.push(proto_rate);
            });
            $scope.proto_rate_list = [];
            $scope.updateBankProtoRate();
            $scope.selectAddedProtoRate(0);
        };

        $scope.removeFromProtoRateList = function(){
            var index = $scope.added_proto_rate_id_list.indexOf($scope.selected_added_proto_rate_id);
            if(index != -1){
                $scope.added_proto_rate_id_list.splice(index,1);
                console.log($scope.added_proto_rate_list);
                angular.forEach($scope.added_proto_rate_list,function(value,id_index){
                    if(value.id == $scope.selected_added_proto_rate_id){
                        $scope.added_proto_rate_list.splice(id_index,1);
                        $scope.proto_rate_list.push(value);
                        // $scope.show_added_proto_rate_list.splice(id_index,1);
                    }
                });
                $scope.updateBankProtoRate();
                $scope.selectProtoRate(0);
                $scope.selectAddedProtoRate(0);
            }
        };
        var deleted_proto_rate = false;
        $scope.removeAllFromProtoRateList = function(){
            deleted_proto_rate = false;
            $rootScope.openModal('modal-basic',
                '是否删除金融机构中全部金融机构？',
                '删除金融机构',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!deleted_proto_rate){
                        $timeout(function(){
                            $('#modal-basic').on('hidden.bs.modal', function () {
                                $('body').addClass('modal-open');
                            });
                            $scope.added_proto_rate_id_list = [];
                            $scope.proto_rate_list = angular.copy($scope.origin_proto_rate_list);
                            $scope.updateBankProtoRate();
                            $scope.added_proto_rate_list = [];
                            $scope.selectProtoRate(0);
                        });
                    }
                }
                deleted_proto_rate = true;
            });

        };


        $scope.updateBankProtoRate = function(){
            console.log($scope.post_data);
            var post_data = {
                rate: $scope.added_proto_rate_id_list
            };
            bankService.patchBankPromise(bank_id,post_data)
            .then(function(response){
                if(response){
                    $rootScope.openModal('modal-confirm','更新成功','操作提示');
                }
            },function(error){
                $rootScope.openModal('modal-confirm','请求出错，错误代码：' + error.status,'操作提示');
            });
        }



        $scope.page_state.current_page = 1;
        $scope.page_state.proto_rate_filters.offset = 0;
        $scope.pageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.page_state.proto_rate_filters.offset = (page - 1) * 20;
            }
            else{
                $scope.page_state.proto_rate_filters.offset = 0;
            }
            $scope.searchProtoRate();
        };

        var deleted_bank = false;
        $scope.deleteBank = function(){
            deleted_bank = false;
            $rootScope.openModal('modal-basic',
                '是否删除该金融机构？',
                '删除金融机构',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!deleted_bank){
                        $timeout(function(){
                            bankService.deleteBankPromise(bank_id)
                            .then(function(response){
                                $('#modal-basic').on('hidden.bs.modal', function () {
                                    $('body').addClass('modal-open');
                                });
                                $rootScope.openModal('modal-confirm','删除成功','操作提示','','','delete-confirm');
                                $('#modal-confirm-button').click(function() {
                                    $('#modal-confirm-button').unbind();
                                    if($('#modal-confirm-button').hasClass('delete-confirm')){
                                        $state.go('menu.content.bank.list');
                                    }
                                });
                            },function(error){
                                $rootScope.openModal('modal-confirm','请求出错，错误代码：' + error.status,'操作提示');
                            });
                        });
                    }
                }
                deleted_bank = true;
            });

        };

    }
])
.controller('newBankController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$filter',
    'common.commonService',
    'applications.applicationsService',
    'bank.bankService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $filter,
        commonService,
        applicationsService,
        bankService
    ) {
        $scope.post_data = {};
        applicationsService.choiceConfigPromise('?tag=bank_type')
        .then(function(response){
            $scope.bank_types = response.result;
        });

        commonService.get_province()
        .then(function(response){
            if(response){
                $scope.province_list = response.results;
            }
        });


        $scope.createBank = function(){
            $scope.post_data.plates = $scope.added_district_id_list;
            bankService.createBankPromise($scope.post_data)
            .then(function(response){
                console.log(response);
                if(response){
                    commonService.responseModal('200');
                    $('#modal-confirm-button').click(function() {
                        $('#modal-confirm-button').unbind();
                        $state.go('menu.content.bank.detail',{bank_id:response.data.id});
                    });
                }
            },function(error){
                commonService.responseModal(error.status);
            });
        };

    }
])
;
