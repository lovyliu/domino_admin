dealer.controller('dealerListController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    'common.commonService',
    'staff.staffService',
    'dealer.dealerService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        commonService,
        staffService,
        dealerService
    ) {
        console.log('dealer')
        $scope.page_state = {
            filters: {
                limit: 20,
                ordering: '',
            }
        };
        $scope.dealer_role = commonService.dealer_role();
        staffService.listPromise('?limit=1000&department=销售部')
        .then(function(response){
            $scope.page_state.staff_list = response.results;
        });

        commonService.get_province()
        .then(function(response){
            if(response){
                $scope.province_list = response.results;
            }
        });
        $scope.$watch('page_state.filters.address__province',function(new_value,old_value){
            if(!new_value){
                $scope.city_list = [];
            }
            else{
                if(new_value != old_value){
                    var selected_province_id = commonService.filter_area_id($scope.province_list,new_value);
                    commonService.get_city_district(selected_province_id)
                    .then(function(response){
                        if (response) {
                            console.log(response);
                            $scope.city_list = response.results;
                        }
                    });
                }
            }
        });

        $scope.searchDealers = function(){
            var params = commonService.constructURLParams($scope.page_state.filters);
            console.log(params);
            dealerService.listPromise(params)
            .then(function(response){
                console.log(response);
                if(response){
                    $scope.dealers = response.results;
                    console.log($scope.dealers)
                    $scope.page_state.count = response.count;
                }
            });
        };
        $scope.searchFirstDealers = function(){
            $scope.page_state.current_page = 1;
            $scope.page_state.filters.offset = 0;
            $scope.searchDealers();
        };
        $scope.searchFirstDealers();

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
            $scope.searchDealers();
        };

    }
])
.controller('newDealerController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    'common.commonService',
    'staff.staffService',
    'dealer.dealerService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        commonService,
        staffService,
        dealerService
    ) {
        console.log('new dealer');
        $scope.post_data = {};
        $scope.dealer_status = commonService.dealer_status();
        commonService.get_province()
        .then(function(response){
            if(response){
                $scope.province_list = response.results;
                    console.log($scope.province_list)
            }
        });
        $scope.$watch('post_data.province',function(new_value,old_value){
            if(!new_value){
                $scope.city_list = [];
            }
            else{
                if(new_value != old_value){
                    var selected_province_id = commonService.filter_area_id($scope.province_list,new_value);
                    commonService.get_city_district(selected_province_id)
                    .then(function(response){
                        if (response) {
                            console.log(response);
                            $scope.city_list = response.results;
                        }
                    });
                }
            }
        });
        $scope.$watch('post_data.city',function(new_value,old_value){
            if(!new_value){
                $scope.district_list = [];
            }
            else{
                if(new_value != old_value){
                    var selected_city_id = commonService.filter_area_id($scope.city_list,new_value);
                    commonService.get_city_district(selected_city_id)
                    .then(function(response){
                        if (response) {
                            console.log(response);
                            $scope.district_list = response.results;
                        }
                    });
                }
            }
        });
        $scope.$watch('post_data.bank_province',function(new_value,old_value){
            console.log(new_value)
            if(!new_value){
                $scope.city_list = [];
            }
            else{
                console.log($scope.province_list);
                if(new_value != old_value){
                    var selected_province_id = commonService.filter_area_id($scope.province_list,new_value);
                    commonService.get_city_district(selected_province_id)
                    .then(function(response){
                        if (response) {
                            $scope.bank_city_list = response.results;
                            console.log($scope.bank_city_list);
                        }
                    });
                }
            }
        });
        staffService.listPromise('?limit=1000&department=销售部')
        .then(function(response){
            $scope.staff_list = response.results;
        });

        $scope.createDealer = function() {
            dealerService.createDealerPromise($scope.post_data)
            .then(function(response){
                console.log(response);
                if(response){
                    $rootScope.openModal('modal-confirm','新建门店成功','操作提示');
                    $('#modal-confirm-button').click(function() {
                        $('#modal-confirm-button').unbind();
                        $state.go('menu.content.dealer.detail',{dealer_id:response.id});
                    });
                }
            },function(error){
                $rootScope.openModal('modal-confirm','新建门店失败','操作提示');
            });
        };
    }
])
.controller('dealerDetailController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$timeout',
    '$window',
    'api',
    'common.commonService',
    'employee.employeeService',
    'bank.bankService',
    'protoRate.protoRateService',
    'employee.employeeService',
    'vehicle.vehicleService',
    'applications.applicationsService',
    'staff.staffService',
    'dealer.dealerService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $timeout,
        $window,
        api,
        commonService,
        employeeService,
        bankService,
        protoRateService,
        employeeService,
        vehicleService,
        applicationsService,
        staffService,
        dealerService
    ) {
        var dealer_id = $scope.dealer_id = $stateParams.dealer_id;
        $scope.dealer_status = commonService.dealer_status();
        $scope.added_trix_list = [];
        $scope.trix_id_list = [];
        $scope.selected_added_trix_index = 0;
        $scope.employee_role = commonService.employee_role();
        $scope.employee_status = commonService.employee_status();
        $scope.employee_relation_filters = {
            limit: 20,
            offset: 0
        };
        $scope.now = new Date().toString();
        $scope.post_data = {
            // dlr_nm: null,
            // dtype: null,
            // bank_account_num: null,
            // bank_account_name: null,
            // bank_branch_name: null,
            // tel_num: null,
            // fax_num: null,
            // email: null,
            // wx_num: null,
            // province: null,
            // city: null,
            // district: null,
            // manage_staff: null
        };
        $scope.page_state = {
            plate_filters:{
                limit: 20,
                offset: 0
            }
        };
        applicationsService.choiceConfigPromise('?tag=region')
        .then(function(response){
            $scope.regions = response.result;
        });

        dealerService.detailPromise(dealer_id)
        .then(function(detail_response){
            if(detail_response){
                $scope.dealer = detail_response;
                $scope.added_bank_id_list = detail_response.bank;
                $scope.added_brand_id_list = detail_response.vehicle;
                commonService.get_province()
                .then(function(response){
                    if(response){
                        $scope.province_list = response.results;
                        if(detail_response.province){
                            var selected_province_id = commonService.filter_area_id($scope.province_list,detail_response.province);
                            commonService.get_city_district(selected_province_id)
                            .then(function(response){
                                if (response) {
                                    $scope.city_list = response.results;
                                    if(detail_response.city){
                                        var selected_city_id = commonService.filter_area_id($scope.city_list,detail_response.city);
                                        commonService.get_city_district(selected_city_id)
                                        .then(function(response){
                                            if (response) {
                                                console.log(response);
                                                $scope.district_list = response.results;
                                                $scope.post_data = detail_response;
                                            }
                                        });
                                    }
                                    else{
                                        $scope.post_data = detail_response;
                                    }
                                }
                                else{
                                    $scope.post_data = detail_response;
                                }
                            });
                        }
                        else{
                            $scope.post_data = detail_response;
                        }
                    }

                });

            }
        });

        staffService.listPromise('?limit=1000&department=销售部')
        .then(function(response){
            $scope.staff_list = response.results;
        });

        $scope.$watch('post_data.province',function(new_value,old_value){
            if(!new_value){
                $scope.city_list = [];
            }
            else{
                if(new_value != old_value){
                    var selected_province_id = commonService.filter_area_id($scope.province_list,new_value);
                    commonService.get_city_district(selected_province_id)
                    .then(function(response){
                        if (response) {
                            $scope.city_list = response.results;
                        }
                    });
                }
            }
        });
        $scope.$watch('post_data.city',function(new_value,old_value){
            if(!new_value){
                $scope.district_list = [];
            }
            else{
                if(new_value != old_value){
                    var selected_city_id = commonService.filter_area_id($scope.city_list,new_value);
                    commonService.get_city_district(selected_city_id)
                    .then(function(response){
                        if (response) {
                            console.log(response);
                            $scope.district_list = response.results;
                        }
                    });
                }
            }
        });
        $scope.$watch('post_data.bank_province',function(new_value,old_value){
            console.log(new_value)
            if(!new_value){
                $scope.city_list = [];
            }
            else{
                console.log($scope.province_list);
                if(new_value != old_value){
                    var selected_province_id = commonService.filter_area_id($scope.province_list,new_value);
                    commonService.get_city_district(selected_province_id)
                    .then(function(response){
                        if (response) {
                            $scope.bank_city_list = response.results;
                            console.log($scope.bank_city_list);
                        }
                    });
                }
            }
        });
        $scope.updateDealer = function(){
            dealerService.updateDealerPromise(dealer_id,$scope.post_data)
            .then(function(response){
                console.log(response);
                if(response)
                commonService.responseModal(response.status);
            },function(error){
                commonService.responseModal(error.status);
            });
        };

        $scope.changeTab = function(tab){
            $scope.tab = tab;
            console.log($scope.tab)
            if(tab == 'employee'){
                $scope.searchEmployee();
                $scope.searchEmployeeRelation();
            }
            else if(tab == 'vehicle'){
                $scope.searchBrand();
            }
            else if(tab == 'proto_rate'){
                $scope.searchBank();
                // $scope.getAddedBankList();
            }
            else if(tab == 'plate'){
                commonService.get_province()
                .then(function(response){
                    if(response.count){
                        $scope.province_list = angular.copy(response.results);
                        var params = '?limit=100&level=1';
                        dealerService.dealerPlateListPromise(dealer_id,params)
                        .then(function(added_response){
                            if(response.count){
                                $scope.added_province_list = angular.copy(added_response.results);
                                $scope.selectAddedProvince(0);
                            }
                            $scope.selectProvince(0);
                        },function(error){
                            $scope.selectProvince(0);
                        });
                    }
                });
            }
        };
        $scope.changeTab('basic');

        var deleted_dealer = false;
        $scope.deleteDealer = function(){
            deleted_dealer = false;
            $rootScope.openModal('modal-basic',
                '是否删除该经销商？',
                '删除经销商',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!deleted_dealer){
                        $timeout(function(){
                            dealerService.deleteDealerPromise(dealer_id)
                            .then(function(response){
                                $('#modal-basic').on('hidden.bs.modal', function () {
                                    $('body').addClass('modal-open');
                                });
                                $rootScope.openModal('modal-confirm','删除成功','操作提示','','','delete-confirm');
                                $('#modal-confirm-button').click(function() {
                                    $('#modal-confirm-button').unbind();
                                    if($('#modal-confirm-button').hasClass('delete-confirm')){
                                        $state.go('menu.content.dealer.list');
                                    }
                                });
                            },function(error){
                                $rootScope.openModal('modal-confirm','请求出错，错误代码：' + error.status,'操作提示');
                            });
                        });
                    }
                }
                deleted_dealer = true;
            });

        };

        $scope.search = {};

        // brand
        $scope.toggleBrandList = function(bool){
            $scope.show_full_brand_list = bool;
        };
        function calculateHeight(){
            var wrapper_height = angular.element(document.querySelector('#limitWrapper')).height();
            if(wrapper_height > 40){
                $scope.more_than_one_line = true;
            }
            else{
                $scope.more_than_one_line = false;
            }
        };
        $scope.searchBrand = function(){
            var params = '?limit=1000&level=0';
            if($scope.search.brand){
                params = params + '&brand_name=' + $scope.search.brand;
            }
            vehicleService.brandListPromise(params)
            .then(function(response){
                if(response){
                    var brand_list = angular.copy(response.results);
                    $scope.origin_brand_list = angular.copy(response.results);
                    if(brand_list.length){
                        if($scope.added_brand_id_list.length){
                            var params = '?limit=1000&id_in=' + $scope.added_brand_id_list;
                            vehicleService.brandListPromise(params)
                            .then(function(added_brand_response){
                                if(response){
                                    $scope.added_brand_list = angular.copy(added_brand_response.results);
                                    if($scope.added_brand_list.length){
                                        $scope.toggleBrand(0);
                                        $timeout(function () {
                                            calculateHeight();
                                        });
                                        var list = angular.copy(brand_list);
                                        angular.forEach($scope.added_brand_list,function(added_brand){
                                            angular.forEach(list,function(brand,brand_index){
                                                if(added_brand.id == brand.id){
                                                    list.splice(brand_index,1);
                                                }
                                            });
                                        });
                                        $scope.brand_list = angular.copy(list);
                                        $scope.selectAddedBrand(0);
                                        $scope.selectBrand(0);
                                    }
                                    else{
                                        $scope.brand_list = angular.copy(brand_list);
                                    }
                                }
                                else{
                                    $scope.brand_list = angular.copy(brand_list);
                                }
                            },function(error){
                                $scope.brand_list = angular.copy(brand_list);
                            });
                        }
                        else{
                            $scope.brand_list = angular.copy(brand_list);
                        }
                    }
                    else{
                        $scope.brand_list = angular.copy(brand_list);
                    }
                    $scope.selectBrand(0);
                }
            });

        };
        $scope.selectBrand = function(index){
            $scope.selected_brand_index = index;
            if($scope.brand_list && $scope.brand_list.length){
                $scope.selected_brand_id = $scope.brand_list[index].id;
            }
        };
        $scope.selectAddedBrand = function(index){
            $scope.selected_added_brand_index = index;
            if($scope.added_brand_list && $scope.added_brand_list.length){
                $scope.selected_added_brand_id = $scope.added_brand_list[index].id;
            }
        };

        $scope.added_brand_id_list = [];
        $scope.added_brand_list = [];
        // $scope.show_added_proto_rate_list = [];
        $scope.addToBrandList = function(){
            if($scope.selected_brand_id && $scope.added_brand_id_list.indexOf($scope.selected_brand_id) == -1){
                $scope.added_brand_id_list.push($scope.selected_brand_id);
                var list = angular.copy($scope.brand_list);
                $scope.added_brand_list.push(list[$scope.selected_brand_index]);
                $scope.brand_list.splice($scope.selected_brand_index,1);
                $scope.updateDealerBrand();
                $scope.toggleBrand(0);
                $scope.selectBrand(0);
                $scope.selectAddedBrand(0);
            }
        };
        $scope.addAllToBrandList = function(){
            $scope.added_brand_id_list = [];
            $scope.added_brand_list = [];
            var list = angular.copy($scope.origin_brand_list);
            angular.forEach(list,function(brand){
                $scope.added_brand_id_list.push(brand.id);
                $scope.added_brand_list.push(brand);
            });
            $scope.brand_list = [];
            $scope.updateDealerBrand();
            $scope.toggleBrand(0);
            $scope.selectAddedBrand(0);
        };

        $scope.removeFromBrandList = function(){
            var index = $scope.added_brand_id_list.indexOf($scope.selected_added_brand_id);
            if(index != -1){
                $scope.added_brand_id_list.splice(index,1);
                angular.forEach($scope.added_brand_list,function(value,id_index){
                    if(value.id == $scope.selected_added_brand_id){
                        $scope.added_brand_list.splice(id_index,1);
                        $scope.brand_list.push(value);
                    }
                });
                $scope.updateDealerBrand();
                $scope.toggleBrand(0);
                $scope.selectBrand(0);
                $scope.selectAddedBrand(0);
            }
        };
        var deleted_brand = false;
        $scope.removeAllFromBrandList = function(){
            deleted_brand = false;
            $rootScope.openModal('modal-basic',
                '是否删除全部品牌？',
                '删除品牌',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!deleted_brand){
                        $timeout(function(){
                            $scope.added_brand_id_list = [];
                            $scope.brand_list = angular.copy($scope.origin_brand_list);
                            $scope.updateDealerBrand();
                            $scope.added_brand_list = [];
                            $scope.toggleBrand(0);
                            $scope.selectBrand(0);
                        });
                    }
                }
                deleted_brand = true;
            });

        };

        $scope.toggleBrand = function(index){
            $scope.brand_filters.offset = 0;
            $scope.brand_current_page = 1;
            $scope.selected_added_toggle_brand_index = index;
            if($scope.added_brand_list.length){
                var brand_id = $scope.added_brand_list[index].id;
                $scope.brand_filters.superior__id = brand_id;
                getBrandList();
            }
            else{
                $scope.trix_list = []
                $scope.brand_count = 0;
            }
        };
        function getBrandList(){
            var params = commonService.constructURLParams($scope.brand_filters);
            vehicleService.brandListPromise(params)
            .then(function(response){
                if(response){
                    $scope.trix_list = response.results;
                    $scope.brand_count = response.count;
                }
            });
        };

        $scope.updateDealerBrand = function(){
            console.log($scope.post_data);
            var post_data = {
                vehicle: $scope.added_brand_id_list
            };
            dealerService.patchDealerPromise(dealer_id,post_data)
            .then(function(response){
                if(response){
                    calculateHeight();
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm','更新成功','操作提示');
                }
            },function(error){
                $rootScope.openModal('modal-confirm','请求出错，错误代码：' + error.status,'操作提示');
            });
        }

        $scope.brand_filters = {
            limit: 20,
            offset: 0
        };
        $scope.brand_current_page = 1;
        $scope.brand_filters.offset = 0;
        $scope.brandPageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.brand_filters.offset = (page - 1) * 20;
            }
            else{
                $scope.brand_filters.offset = 0;
            }
            getBrandList();
        };

        // employee
        $scope.employee_filters = {
            limit: 5,
            offset: 0
        };
        $scope.searchEmployee = function(){
            var params = commonService.constructURLParams($scope.employee_filters);
            employeeService.listPromise(params)
            .then(function(response){
                $scope.employee_list = response.results;
                $scope.employee_count = response.count;
                if(response.results){
                    angular.forEach($scope.employee_list,function(employee){
                        employee.status = 'A';
                        employee.role = 'S';
                    });
                }
            });
        };
        $scope.selectEmployee = function(index){
            var employee = $scope.employee_list[index];
            if(employee.selected){
                var filter = {
                    dealer: dealer_id,
                    employee: employee.id,
                    role: employee.role,
                    status: employee.status
                };
                var params = commonService.constructURLParams(filter);
                dealerService.dealerEmployeeRelationPromise(params)
                .then(function(response){
                    if(response.count){
                        $scope.employee_list[index].selected = false;
                        $rootScope.openModal('modal-confirm','该关系已存在，请重新选择','操作提示');
                    }
                });
            }
        };
        $scope.selectAllEmployee = function(){
            if($scope.employee_list.length){
                angular.forEach($scope.employee_list,function(employee){
                    employee.selected = $scope.selected_all_employee;
                });
            }
        };
        $scope.createEmployeeRelation = function(){
            if($scope.employee_list.length){
                // var failed_list = [];
                angular.forEach($scope.employee_list,function(employee){
                    if(employee.selected){
                        var post_data = {
                            dealer: dealer_id,
                            employee: employee.id,
                            role: employee.role,
                            status: employee.status
                        };
                        dealerService.createDealerEmployeeRelationPromise(post_data)
                        .then(function(response){
                            if(response){
                                $scope.searchEmployeeRelation();
                                employee.selected = false;
                            }
                        },function(error){
                            commonService.responseModal(error.status,error.data);
                        });
                    }
                });
            }
        };

        $scope.selectAllEmployeeRelation = function(){
            if($scope.employee_relation_list.length){
                angular.forEach($scope.employee_relation_list,function(relation){
                    relation.selected = $scope.selected_all_employee_relation;
                });
            }
        };
        var deleted_employee = false;
        $scope.deleteEmployeeRelation = function(){
            deleted_employee = false;
            $rootScope.openModal('modal-basic',
                '是否在当前经销商中删除选中员工？',
                '删除员工',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!deleted_employee){
                        $timeout(function(){
                            if($scope.employee_relation_list.length){
                                // var failed_list = [];
                                angular.forEach($scope.employee_relation_list,function(relation){
                                    if(relation.selected){
                                        dealerService.deleteDealerEmployeeRelationPromise(relation.id)
                                        .then(function(response){
                                            $scope.searchEmployeeRelation();
                                            employee.selected = false;
                                        },function(error){
                                            // failed_list.push(employee);
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
                deleted_employee = true;
            });

        };

        $scope.employee_current_page = 1;

        $scope.employeePageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.employee_filters.offset = 5*(page-1);
            }
            else{
                $scope.employee_filters.offset = 0;
            }
            $scope.searchEmployee();
        };

        // employee relation

        $scope.downloadEmployeeFile = function(){
            var url = api.dealer.download_employee_file(dealer_id);
            window.open(url,'_blank');
        };

        $scope.searchEmployeeRelation = function(){
            $scope.employee_relation_filters.dealer = dealer_id;
            var params = commonService.constructURLParams($scope.employee_relation_filters);
            dealerService.dealerEmployeeRelationPromise(params)
            .then(function(response){
                $scope.employee_relation_list = response.results;
                $scope.employee_relation_count = response.count;
            });
        };

        $scope.updateEmployeeRelation = function(relation){
            var post_data = {
                status: relation.status,
                role: relation.role,
                dealer: relation.dealer,
                employee: relation.employee
            };
            dealerService.updateDealerEmployeeRelationPromise(relation.id,post_data)
            .then(function(response){
                if(response){
                    $rootScope.openModal('modal-confirm','更新成功','操作提示');
                }
            },function(error){
                commonService.responseModal(error.status,error.data);
            });
        };

        $scope.employee_relation_current_page = 1;

        $scope.employeeRelationPageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.employee_relation_filters.offset = 20*(page-1);
            }
            else{
                $scope.employee_relation_filters.offset = 0;
            }
            $scope.searchEmployeeRelation();
        };

        // proto_rate
        $scope.dealer_proto_rate_status = commonService.dealer_proto_rate_status();
        $scope.searchBank = function(){
            var params = '?limit=1000';
            if($scope.search.bank){
                params = params + '&name=' + $scope.search.bank;
            }
            bankService.listPromise(params)
            .then(function(response){
                if(response){
                    var bank_list = angular.copy(response.results);
                    $scope.origin_bank_list = angular.copy(response.results);
                    if(bank_list.length){
                        console.log($scope.added_bank_id_list);
                        if($scope.added_bank_id_list.length){
                            var params = '?limit=1000&id_in=' + $scope.added_bank_id_list;
                            bankService.listPromise(params)
                            .then(function(added_bank_response){
                                if(response){
                                    $scope.added_bank_list = angular.copy(added_bank_response.results);
                                    if($scope.added_bank_list.length){
                                        $scope.toggleBank(0);
                                        var list = angular.copy(bank_list);
                                        angular.forEach($scope.added_bank_list,function(added_bank){
                                            angular.forEach(list,function(bank,bank_index){
                                                if(added_bank.id == bank.id){
                                                    list.splice(bank_index,1);
                                                }
                                            });
                                        });
                                        $scope.bank_list = angular.copy(list);
                                        $scope.selectAddedBank(0);
                                        $scope.selectBank(0);
                                    }
                                    else{
                                        $scope.bank_list = angular.copy(bank_list);
                                    }
                                }
                                else{
                                    $scope.bank_list = angular.copy(bank_list);
                                }
                            },function(error){
                                $scope.bank_list = angular.copy(bank_list);
                            });
                        }
                        else{
                            $scope.bank_list = angular.copy(bank_list);
                        }
                    }
                    else{
                        $scope.bank_list = angular.copy(bank_list);
                    }
                    $scope.selectBank(0);
                }
            });

        };
        // $scope.searchAddedBank = function(){
        //     if($scope.added_bank_id_list.length){
        //         var params = '?limit=1000&id_in=' + $scope.added_bank_id_list + '&name=' + $scope.search.added_bank;
        //         bankService.listPromise(params)
        //         .then(function(response){
        //             if(response){
        //                 $scope.added_bank_search_list = response.results;
        //                 if($scope.added_bank_search_list.length){
        //                     $scope.toggleAddedBank(0);
        //                 }
        //             }
        //         });
        //     }
        // };
        $scope.selectBank = function(index){
            $scope.selected_bank_index = index;
            if($scope.bank_list && $scope.bank_list.length){
                $scope.selected_bank_id = $scope.bank_list[index].id;
            }
        };
        $scope.selectAddedBank = function(index){
            $scope.selected_added_bank_index = index;
            var list = $scope.added_bank_search_list || $scope.added_bank_list;
            $scope.selected_added_bank_id = $scope.added_bank_list.length ? $scope.added_bank_list[index].id : null;
        };

        $scope.added_bank_id_list = [];
        $scope.added_bank_list = [];
        // $scope.show_added_proto_rate_list = [];
        $scope.addToBankList = function(){
            if($scope.added_bank_id_list.indexOf($scope.selected_bank_id) == -1){
                $scope.added_bank_id_list.push($scope.selected_bank_id);
                var list = $scope.bank_list;
                $scope.added_bank_list.push(list[$scope.selected_bank_index]);
                $scope.bank_list.splice($scope.selected_bank_index,1);
                $scope.updateDealerBank();
                $scope.selectBank(0);
                $scope.selectAddedBank(0);
            }
        };
        $scope.addAllToBankList = function(){
            $scope.added_bank_id_list = [];
            $scope.added_bank_list = [];
            var list = angular.copy($scope.origin_bank_list);
            angular.forEach(list,function(bank){
                $scope.added_bank_id_list.push(bank.id);
                $scope.added_bank_list.push(bank);
            });
            $scope.bank_list = [];
            $scope.updateDealerBank();
            // $scope.toggleBank(0);
            $scope.selectAddedBank(0);
        };

        $scope.removeFromBankList = function(){
            var index = $scope.added_bank_id_list.indexOf($scope.selected_added_bank_id);
            if(index != -1){
                $scope.added_bank_id_list.splice(index,1);
                angular.forEach($scope.added_bank_list,function(value,id_index){
                    if(value.id == $scope.selected_added_bank_id){
                        $scope.added_bank_list.splice(id_index,1);
                        $scope.bank_list.push(value);
                        // $scope.show_added_proto_rate_list.splice(id_index,1);
                    }
                });
                $scope.updateDealerBank();
                // $scope.toggleBank(0);
                $scope.selectBank(0);
                $scope.selectAddedBank(0);
            }
        };
        var deleted_bank = false;
        $scope.removeAllFromBankList = function(){
            deleted_bank = false;
            $rootScope.openModal('modal-basic',
                '是否在当前经销商中删除全部资金渠道？',
                '删除渠道',
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
                            $('#modal-basic').on('hidden.bs.modal', function () {
                                $('body').addClass('modal-open');
                            });
                            $scope.added_bank_id_list = [];
                            $scope.bank_list = angular.copy($scope.origin_bank_list);
                            $scope.updateDealerBank();
                            $scope.added_bank_list = [];
                            // $scope.toggleBank(0);
                            $scope.selectBank(0);
                        });
                    }
                }
                deleted_bank = true;
            });

        };

        $scope.toggleBank = function(index){
            $scope.selected_added_toggle_bank_index = index;
            if($scope.added_bank_list.length){
                var bank_id = $scope.added_bank_list[index].id;
                bankService.detailPromise(bank_id)
                .then(function(response){
                    if(response){
                        if(response.rate.length){
                            searchProtoRate(response.rate);
                        }
                    }
                });
            }
            else{
                $scope.proto_rate_list = []
                $scope.proto_count = 0;
            }
        };

        var searchProtoRate = function(id_list){
            $scope.proto_filters.id_in = id_list.toString();
            var params = commonService.constructURLParams($scope.proto_filters);
            protoRateService.listPromise(params)
            .then(function(response){
                if(response){
                    $scope.proto_rate_list = response.results;
                    $scope.proto_count = response.count;
                    var bank_id = $scope.added_bank_list[$scope.selected_added_toggle_bank_index].id;
                    dealerService.dealerProtoRateRelationPromise('?bank__id=' + bank_id + '&dealer__id=' + dealer_id)
                    .then(function(response){
                        if(response){
                            console.log(response);
                            $scope.dealer_proto_rate_list = response.results;
                            angular.forEach($scope.proto_rate_list,function(proto_rate){
                                // proto_rate.status = 'N';
                                angular.forEach($scope.dealer_proto_rate_list,function(relation){
                                    if(relation.proto_rate == proto_rate.id){
                                        proto_rate.rebate_24 = relation.rebate_24 || proto_rate.rebate_24;
                                        proto_rate.rebate_36 = relation.rebate_36 || proto_rate.rebate_24;
                                        proto_rate.relation_id = relation.id;
                                        proto_rate.status = relation.status;
                                    }
                                });
                            });
                        }
                    });
                }
            });
        };
        $scope.updateDealerProtoRate = function(index){
            var proto_rate = $scope.proto_rate_list[index];
            $scope.proto_rate_list[index].rebate_24_not_valid = false;
            $scope.proto_rate_list[index].rebate_36_not_valid = false;
            if(!proto_rate.rebate_24){
                $scope.proto_rate_list[index].rebate_24_not_valid = true;
            }
            else if(!proto_rate.rebate_36){
                $scope.proto_rate_list[index].rebate_36_not_valid = true;
            }
            else{
                $scope.proto_rate_list[index].rebate_24_not_valid = false;
                $scope.proto_rate_list[index].rebate_36_not_valid = false;
                if(proto_rate.relation_id){
                    var post_data = {
                        status: proto_rate.status,
                        rebate_24: proto_rate.rebate_24,
                        rebate_36: proto_rate.rebate_36
                    };
                    dealerService.patchDealerProtoRateRelationPromise(proto_rate.relation_id,post_data)
                    .then(function(response){
                        if(response){
                            $scope.toggleBank($scope.selected_added_toggle_bank_index);
                            $rootScope.openModal('modal-confirm','操作成功','操作提示');
                        }
                    },function(error){
                        $rootScope.openModal('modal-confirm','请求出错，错误代码：' + error.status,'操作提示');
                    });
                }
                else{
                    // console.log($scope.added_bank_id_list[$scope.selected_added_toggle_bank_index].id)
                    var post_data = {
                        dealer: dealer_id,
                        bank: $scope.added_bank_list[$scope.selected_added_toggle_bank_index].id,
                        proto_rate: proto_rate.id,
                        rebate_24: proto_rate.rebate_24,
                        rebate_36: proto_rate.rebate_36,
                        status: proto_rate.status
                    };
                    dealerService.createDealerProtoRateRelationPromise(post_data)
                    .then(function(response){
                        if(response){
                            $scope.toggleBank($scope.selected_added_toggle_bank_index);
                            $rootScope.openModal('modal-confirm','操作成功','操作提示');
                        }
                    },function(error){
                        $rootScope.openModal('modal-confirm','请求出错，错误代码：' + error.status,'操作提示');
                    });
                }
            }

        };
        $scope.updateDealerBank = function(){
            console.log($scope.post_data);
            var post_data = {
                bank: $scope.added_bank_id_list
            };
            dealerService.patchDealerPromise(dealer_id,post_data)
            .then(function(response){
                if(response){
                    $rootScope.openModal('modal-confirm','更新成功','操作提示');
                    angular.forEach($scope.added_bank_list,function(bank,index){
                        console.log(bank,index);
                        bankService.detailPromise(bank.id)
                        .then(function(response){
                            if(response && response.rate.length){
                                angular.forEach(response.rate,function(rate){
                                    var post_data = {
                                        dealer: dealer_id,
                                        bank: bank.id,
                                        proto_rate: rate,
                                        // rebate_24: rate.rebate_24,
                                        // rebate_36: rate.rebate_36,
                                        status: 'A'
                                    };
                                    dealerService.createDealerProtoRateRelationPromise(post_data)
                                    .then(function(response){
                                        if(response){
                                            $scope.toggleBank(0);
                                            $rootScope.openModal('modal-confirm','操作成功','操作提示');
                                        }
                                    },function(error){
                                        $scope.toggleBank(0);
                                        $rootScope.openModal('modal-confirm','请求出错，错误代码：' + error.status,'操作提示');
                                    });
                                })
                            }
                        });
                    });
                }
            },function(error){
                $rootScope.openModal('modal-confirm','请求出错，错误代码：' + error.status,'操作提示');
            });
        }

        $scope.proto_filters = {
            limit: 20,
            offset: 0
        };
        $scope.proto_current_page = 1;
        $scope.proto_filters.offset = 0;
        $scope.protoPageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.proto_filters.offset = (page - 1) * 20;
            }
            else{
                $scope.proto_filters.offset = 0;
            }
            getProtoRateList();
        };

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
            dealerService.dealerPlateListPromise(dealer_id,params)
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
            dealerService.dealerPlateListPromise(dealer_id,params)
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
                dealerService.updateDealerPlatePromise(dealer_id,post_data)
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
                dealerService.updateDealerPlatePromise(dealer_id,post_data)
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
            dealerService.updateDealerPlatePromise(dealer_id,post_data)
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
                            dealerService.updateDealerPlatePromise(dealer_id,post_data)
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

        $scope.searchAddedPlates = function(){
            $scope.page_state.plate_filters.level = 3;
            $scope.page_state.plate_filters.whatever = $scope.page_state.search_added_name;
            var params = commonService.constructURLParams($scope.page_state.plate_filters);
            dealerService.dealerPlateListPromise(dealer_id,params)
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

    }
])
.controller('newStaffController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    'common.commonService',
    'dealer.dealerService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        commonService,
        deductService
    ) {
        console.log('new staff');
        $scope.dealer_id = $stateParams.id;
        $scope.page_state = {
            staff_items: {
                1: ['经销商代码', 'pk'],
                2: ['经销商名称', 'name'],
                3: ['岗位名称', 'name'],
                4: ['状态', 'name']
            }
        };
        $scope.new_staff = {

        };
        $scope.createEmployee = function(){
            employeeService.createEmployeePromise($scope.post_data)
            .then(function(response){
                console.log(response);
                commonService.responseModal(response.status);
                $('#modal-confirm-button').click(function() {
                    $('#modal-confirm-button').unbind();
                    $state.go('menu.content.employee.detail',{employee_id:response.data.id});
                });
            },function(error){
                console.log(error);
                commonService.responseModal(error.status,error.data);
            });
        };
    }
]);
