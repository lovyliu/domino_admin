applications.controller(
    'applicationsListController',
    [
        '$scope',
        '$rootScope',
        '$state',
        '$window',
        '$timeout',
        'common.commonService',
        'localStorageService',
        'staff.staffService',
        'applications.applicationsService',
        function(
            $scope,
            $rootScope,
            $state,
            $window,
            $timeout,
            commonService,
            localStorageService,
            staffService,
            applicationsService
        ) {
            $scope.page_state = {
                filters:{
                    limit: 20,
                    ordering: '-app_ts'
                },
                place_filter: {

                },
                current_page: 1
            };
            $scope.now = new Date().toString();
            $scope.current_state = $state.current.name.split('.')[2];

            // 订单状态
            applicationsService.choiceConfigPromise('?tag=application_status')
            .then(function(response){
                $scope.page_state.application_status = response.result;
            });
            // 开店专员
            staffService.listPromise('?limit=1000&department=销售部')
            .then(function(response){
                $scope.page_state.manage_staff_list = response.results;
            });
            // 审单员
            staffService.listPromise('?limit=1000&department=信审部')
            .then(function(response){
                $scope.page_state.owner_staff_list = response.results;
            });
            // 省市区
            commonService.get_province()
            .then(function(response){
                if(response){
                    $scope.page_state.province_list = response.results;
                }
            });
            $scope.$watch('page_state.place_filter.province',function(new_value,old_value){
                if(!new_value){
                    $scope.page_state.city_list = [];
                }
                else{
                    if(new_value != old_value){
                        var selected_province_id = commonService.filter_area_id($scope.page_state.province_list,new_value);
                        commonService.get_city_district(selected_province_id)
                        .then(function(response){
                            if (response) {
                                $scope.page_state.city_list = response.results;
                            }
                        });
                    }
                }
            });
            $scope.$watch('page_state.place_filter.city',function(new_value,old_value){
                if(!new_value){
                    $scope.page_state.district_list = [];
                }
                else{
                    if(new_value != old_value){
                        var selected_city_id = commonService.filter_area_id($scope.page_state.city_list,new_value);
                        commonService.get_city_district(selected_city_id)
                        .then(function(response){
                            if (response) {
                                $scope.page_state.district_list = response.results;
                            }
                        });
                    }
                }
            });


            var open_modal = false;
            $scope.open = function (item,app_id) {
                open_modal = false;
                $scope.modalText = {
                    ownApplication: {
                        title: '确认认领此订单？',
                        content: '认领订单',
                        okText: '确认',
                        cancelText: '放弃'
                    },
                    cancelApplication: {
                        title: '确认取消此订单？',
                        content: '取消订单',
                        okText: '确认',
                        cancelText: '放弃'
                    },
                    dragBackApplication: {
                        title: '确认拖回此订单？',
                        content: '拖回订单',
                        okText: '确认',
                        cancelText: '放弃',
                    }
                };
                $rootScope.openModal('modal-basic',
                    $scope.modalText[item].content,
                    $scope.modalText[item].title,
                    $scope.modalText[item].okText,
                    $scope.modalText[item].cancelText,
                    item
                );
                $('#modal-ok-button').click(function() {
                    $('#modal-ok-button').unbind();
                    if($('#modal-ok-button').hasClass(item)){
                        if(!open_modal){
                            $timeout(function () {
                                $scope[item](app_id);
                            });
                        }
                        open_modal = true;
                    }
                });
            };
            // 领取订单
            $scope.ownApplication = function(app_id){
                var own_function = $scope.current_state == 'applications' ?
                    'ownApplicationPromise' : 'postLoanOwnApplicationPromise';
                applicationsService[own_function](app_id)
                .then(function(response){
                    $scope.searchApplications();
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                },function(error){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',error.data.msg,'操作提示');
                });
            };
            // 取消订单
            $scope.cancelApplication = function(app_id){
                applicationsService.cancelApplicationPromise(app_id)
                .then(function(response){
                    $scope.searchApplications();
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                },function(error){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',error.data.msg,'操作提示');
                });
            };
            // 拖回
            $scope.dragBackApplication = function(app_id){
                applicationsService.dragBackApplicationPromise(app_id)
                .then(function(response){
                    $scope.searchApplications();
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                },function(error){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',error.data.msg,'操作提示');
                });
            };

            //贷后批量更新
            if($state.current.name == 'menu.content.postLoan.update'){
                applicationsService.getUpadateFieldsPromise()
                .then(function(response){
                    $scope.update_fields = response.result;
                });
            }
            $scope.batch_update = {};
            $scope.selectAllApplication = function(){
                angular.forEach($scope.applications,function(application){
                    application.selected = $scope.page_state.select_all;
                });
            };
            $scope.toggleSelect = function(){
                var select_all = true;
                angular.forEach($scope.applications,function(application){
                    if(!application.selected){
                        select_all = false;
                    }
                });
                $scope.page_state.select_all = select_all;
            };
            var batch_update = false;
            $scope.batchUpdate = function(){
                console.log($scope.batch_update)
                $scope.batch_update.app_id_list = [];
                angular.forEach($scope.applications,function(application){
                    if(application.selected){
                        $scope.batch_update.app_id_list.push(application.app_id);
                    }
                });
                if($scope.batch_update.app_id_list.length){
                    batch_update = false;
                    $rootScope.openModal('modal-basic',
                        '<p>待更新字段：<span class="pull-right">' +
                            $scope.update_fields[$scope.batch_update.field].name + '</span></p>' +
                            '<p>待更新值：<span class="pull-right">' +
                            $scope.batch_update.value + '</span></p>',
                        '更新确认',
                        '确认',
                        '放弃',
                        'delete-confirm'
                    );
                    $('#modal-ok-button').click(function() {
                        $('#modal-ok-button').unbind();
                        $('body').addClass('modal-open');
                        if($('#modal-ok-button').hasClass('delete-confirm')){
                            if(!batch_update){
                                $timeout(function(){
                                    $('#modal-basic').on('hidden.bs.modal', function () {
                                        $('body').addClass('modal-open');
                                    });
                                    applicationsService.batchUpadatePromise($scope.batch_update)
                                    .then(function(response){
                                        $scope.searchApplications();
                                        $rootScope.openModal('modal-confirm','更新成功','操作提示');
                                    },function(error){
                                        commonService.responseModal(error.status,error.data);
                                    });
                                });
                            }
                        }
                        batch_update = true;
                    });
                }
                else{
                    $rootScope.openModal('modal-basic',
                        '请至少选择一个申请',
                        '操作提示',
                        '确认',
                        '放弃',
                        'delete-confirm'
                    );
                }

            };


            $scope.searchApplications = function(){
                if($scope.page_state.place_filter.district){
                    $scope.page_state.filters.plate = $scope.page_state.place_filter.province +
                    '/' + $scope.page_state.place_filter.city +
                    '/' +$scope.page_state.place_filter.district;
                }
                var filters = angular.copy($scope.page_state.filters);
                if(filters.app_id && filters.app_id.indexOf(',') != -1){
                    filters.app_id__in = angular.copy(filters.app_id);
                    delete filters.app_id;
                }
                if(filters.clt_nm && filters.clt_nm.indexOf(',') != -1){
                    filters.clt_nm__in = angular.copy(filters.clt_nm);
                    delete filters.clt_nm;
                }
                if(filters.mobile && filters.mobile.indexOf(',') != -1){
                    filters.mobile__in = angular.copy(filters.mobile);
                    delete filters.mobile;
                }
                if(filters.id_no && filters.id_no.indexOf(',') != -1){
                    filters.id_no__in = angular.copy(filters.id_no);
                    delete filters.id_no;
                }
                var params = commonService.constructURLParams(filters);
                applicationsService.listPromise(params)
                .then(function(response){
                    if(response){
                        $scope.applications = response.results;
                        $scope.page_state.count = response.count;
                    }
                });
            };
            $scope.searchFirstApplications = function(){
                $scope.page_state.current_page = 1;
                $scope.page_state.filters.offset = 0;
                $scope.searchApplications();
            };
            $scope.searchFirstApplications();

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
                $scope.searchApplications();
            };

        }
    ]
)
.controller(
    'applicationsDetailController',
    [
        '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$timeout',
        'common.commonService',
        'applications.applicationsService',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $timeout,
            commonService,
            applicationsService
        ) {
            var app_id = $stateParams.app_id;
            $scope.app_id = app_id;
            $scope.thisYear = new Date().getFullYear();
            $scope.current_state = $state.current.name.split('.')[2];
            $scope.post_data = {
                major_company_name: null,
                major_work_position: null,
                major_work_phone_num: null,
                major_company_addr_details: null,
                urg_contact1: null,
                urg_mobile1: null,
                urg_contact2: null,
                urg_mobile2: null,
                reg_addr_info: null,
                spouse_major_company_name: null,
                spouse_major_company_addr_details: null,
                spouse_major_work_phone_num: null
            };
            $scope.edit_fields_dict = {
                major_company_name: '单位名称',
                major_work_position: '职务',
                major_work_phone_num: '单位座机',
                major_company_addr_details: '单位地址',
                urg_contact1: '紧急联系人1',
                urg_mobile1: '紧急联系人1手机号码',
                urg_contact2: '紧急联系人2',
                urg_mobile2: '紧急联系人2手机号码',
                reg_addr_info: '户籍地',
                spouse_major_company_name: '配偶单位名称',
                spouse_major_company_addr_details: '配偶单位地址',
                spouse_major_work_phone_num: '配偶单位座机'
            };
            $scope.page_state = {
                reg_addr_info: {},
                major_company_addr_details: {},
                spouse_major_company_addr_details: {},
                show_edit: false
            };

            // 省市区
            commonService.get_province()
            .then(function(response){
                if(response){
                    $scope.page_state.province_list = response.results;
                }
            });
            $scope.showEdit = function(){
                $scope.page_state.show_edit = true;
                $scope.changeProvince('reg_addr_info');
                $scope.changeProvince('major_company_addr_details');
                $scope.changeProvince('spouse_major_company_addr_details');
            };
            $scope.changeProvince = function(item){
                if($scope.page_state.show_edit){
                    var province_name = $scope.page_state[item].province;
                    if(province_name){
                        var selected_province_id = commonService.filter_area_id($scope.page_state.province_list,province_name);
                        commonService.get_city_district(selected_province_id)
                        .then(function(response){
                            if (response) {
                                $scope.page_state[item].city_list = response.results;
                                $scope.changeCity(item);
                            }
                        });
                    }
                    else{
                        $scope.page_state[item].city_list = [];
                    }
                }
            };
            $scope.changeCity = function(item){
                console.log($scope.page_state[item].city_list);
                var city_name = $scope.page_state[item].city;
                if(city_name){
                    var selected_city_id = commonService.filter_area_id($scope.page_state[item].city_list,city_name);
                    commonService.get_city_district(selected_city_id)
                    .then(function(response){
                        if (response) {
                            $scope.page_state[item].district_list = response.results;
                        }
                    });
                }
                else{
                    $scope.page_state[item].district_list = [];
                }
            };

            function getApplicationDetail(){
                applicationsService.detailPromise(app_id)
                .then(function(response){
                    if(response){
                        $scope.application = response;
                        angular.forEach($scope.post_data,function(value,key){
                            if(key.indexOf('addr') === -1){
                                $scope.post_data[key] = response[key]
                            }
                            else{
                                if(response[key]){
                                    var addr_arr = response[key].split('-');
                                    $scope.page_state[key].province = addr_arr[0] || null;
                                    $scope.page_state[key].city = addr_arr[1] || null;
                                    $scope.page_state[key].district = addr_arr[2] || null;
                                    $scope.page_state[key].address1 = addr_arr[3] || null;
                                    $scope.page_state[key].address2 = addr_arr[4] || null;
                                    $scope.changeProvince(key);
                                }
                            }
                        });
                        $scope.application.adjustment_quota = response.adjustment_quota ? (Math.ceil(response.adjustment_quota/1000)/10).toFixed(1) : null;
                        if(response.uw_fin_plan){
                            $scope.application.uw_fin_plan.adjustment_quota = response.uw_fin_plan.adjustment_quota ? (Math.ceil(response.uw_fin_plan.adjustment_quota/1000)/10).toFixed(1) : null;
                        }
                        console.log($scope.application.adjustment_quota)
                        applicationsService.setApplication(response);
                        if($scope.basic_tab == 'log'){
                            applicationsService.getLogPromise(app_id)
                            .then(function(response){
                                $scope.log_list = response.result;
                            });
                        }
                    }
                });
            };
            getApplicationDetail();


            if($state.current.name == 'menu.installment'){
                if($stateParams.role == 'guarantor'){
                    $scope.show_guarantor = true;
                }
            }
            $scope.basic_tab = 'vehicle';
            $scope.changeTab = function(name){
                $scope.current_tab = name;
                var state = 'menu.content.' + $scope.current_state + '.detail.' + name;
                $state.go(state);
            };
            $scope.changeImageTab = function(name){
                console.log(name)
                $scope.current_tab = name;
                var state = 'menu.content.' + $scope.current_state + '.detail.img_plan';
                $state.go(state,{tab:name});
                // $state.go(state);
            };

            var state_temp = $state.current.name.split('.');
            var state_name = state_temp[state_temp.length-1];
            if(state_name == 'img_plan'){
                console.log($stateParams)
                if($stateParams.tab){
                    // console.log($stateParams.tab)
                    // $scope.current_tab = $stateParams.tab;
                    $rootScope.$broadcast('tab-changed', { current_tab: $stateParams.tab });
                }
            }
            else{
                $scope.current_tab = state_name;
            }
            $scope.$on('tab-changed', function(event, args) {
                $scope.current_tab = args.current_tab;
            });


            // $scope.current_tab = state_name == 'img_plan' ? $stateParams.tab : state_name;
            // if(state_name == 'img_plan'&&current_tab){
            //     $scope.changeImageTab(current_tab);
            // }
            // console.log(current_tab);
            $scope.changeBasicTab = function(name){
                $scope.basic_tab = name;
                if(name == 'log'){
                    applicationsService.getLogPromise(app_id)
                    .then(function(response){
                        $scope.log_list = response.result;
                    });
                }
                else if(name == 'comments'){
                    $scope.loan_flow_note = {};
                    applicationsService.getNotePromise(app_id)
                    .then(function(response){
                        if(response.results.length){
                            $scope.loan_flow_note = response.results[0];
                        }
                    });
                }
            };

            $scope.openContract = function(name,role){
                var href = location.href.split('#')[0] + '#!/menu/' + name + '?app_id=' + app_id;
                if(role){
                    href += '&role=' + role;
                }
                console.log(href)
                window.open(href);
            };

            $scope.hide_bottom = false;
            $scope.toggleBottom = function(hide_bottom){
                $scope.hide_bottom = hide_bottom;
            };

            var open_modal = false;
            $scope.open = function (item) {
                open_modal = false;
                $scope.modalText = {
                    ownApplication: {
                        title: '确认认领此订单？',
                        content: '认领订单',
                        okText: '确认',
                        cancelText: '放弃'
                    },
                    cancelApplication: {
                        title: '确认取消此订单？',
                        content: '取消订单',
                        okText: '确认',
                        cancelText: '放弃'
                    },
                    dragBackApplication: {
                        title: '确认拖回此订单？',
                        content: '拖回订单',
                        okText: '确认',
                        cancelText: '放弃',
                    },
                    updateApplication: {
                        title: '确认修改订单信息？',
                        content: '修改订单',
                        okText: '确认',
                        cancelText: '放弃',
                    }
                };
                $rootScope.openModal('modal-basic',
                    $scope.modalText[item].content,
                    $scope.modalText[item].title,
                    $scope.modalText[item].okText,
                    $scope.modalText[item].cancelText,
                    item
                );
                $('#modal-ok-button').click(function() {
                    $('#modal-ok-button').unbind();
                    if($('#modal-ok-button').hasClass(item)){
                        if(!open_modal){
                            $timeout(function () {
                                $scope[item](app_id);
                            });
                        }
                        open_modal = true;
                    }
                });
            };

            $scope.ownApplication = function(app_id){
                applicationsService.ownApplicationPromise(app_id)
                .then(function(response){
                    getApplicationDetail();
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                },function(error){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',error.data.msg,'操作提示');
                });
            };

            $scope.cancelApplication = function(app_id){
                applicationsService.cancelApplicationPromise(app_id)
                .then(function(response){
                    getApplicationDetail();
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                },function(error){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',error.data.msg,'操作提示');
                });
            };

            $scope.dragBackApplication = function(app_id){
                applicationsService.dragBackApplicationPromise(app_id)
                .then(function(response){
                    getApplicationDetail();
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                },function(error){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',error.data.msg,'操作提示');
                });
            };

            $scope.cancelEdit = function(){
                getApplicationDetail();
                $scope.page_state.show_edit = false;
            };

            $scope.updateApplication = function(){
                $scope.post_data.reg_addr_info =
                    $scope.page_state.reg_addr_info.province + '-' +
                    $scope.page_state.reg_addr_info.city + '-' +
                    $scope.page_state.reg_addr_info.district;
                $scope.post_data.major_company_addr_details =
                    $scope.page_state.major_company_addr_details.province + '-' +
                    $scope.page_state.major_company_addr_details.city + '-' +
                    $scope.page_state.major_company_addr_details.district + '-' +
                    $scope.page_state.major_company_addr_details.address1 + '-' +
                    $scope.page_state.major_company_addr_details.address2;
                $scope.post_data.spouse_major_company_addr_details =
                    $scope.page_state.spouse_major_company_addr_details.province + '-' +
                    $scope.page_state.spouse_major_company_addr_details.city + '-' +
                    $scope.page_state.spouse_major_company_addr_details.district + '-' +
                    $scope.page_state.spouse_major_company_addr_details.address1 + '-' +
                    $scope.page_state.spouse_major_company_addr_details.address2;
                var post_data = {};
                angular.forEach($scope.post_data,function(value,key){
                    if(value != $scope.application[key]){
                        post_data[key] = value;
                    }
                });
                applicationsService.updateApplicationPromise(app_id,post_data)
                .then(function(response){
                    getApplicationDetail();
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    if(response){
                        $scope.page_state.show_edit = false;
                        $rootScope.openModal('modal-confirm','保存成功','操作提示');
                    }
                },function(error){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',error.data.msg,'操作提示');
                });
            };

            //更新贷前流转备注
            $scope.updateLoanFlowNote = function(id,note){
                var post_data = {
                    note: note
                };
                if(id){
                    applicationsService.updatetNotePromise(id,post_data)
                    .then(function(response){
                        applicationsService.getNotePromise(app_id)
                        .then(function(response){
                            if(response.results.length){
                                $scope.loan_flow_note = response.results[0];
                            }
                            $rootScope.openModal('modal-confirm','提交成功','操作提示');
                        },function(error){
                            $('#modal-basic').on('hidden.bs.modal', function () {
                                $('body').addClass('modal-open');
                            });
                            commonService.responseModal(error.status,error.data);
                        });
                    });
                }
                else{
                    post_data.application = app_id;
                    applicationsService.createtNotePromise(post_data)
                    .then(function(response){
                        applicationsService.getNotePromise(app_id)
                        .then(function(response){
                            if(response.results.length){
                                $scope.loan_flow_note = response.results[0];
                            }
                        });
                        $rootScope.openModal('modal-confirm','提交成功','操作提示');
                    },function(error){
                        $('#modal-basic').on('hidden.bs.modal', function () {
                            $('body').addClass('modal-open');
                        });
                        commonService.responseModal(error.status,error.data);
                    });
                }
            };


        }
    ]
)
.controller(
    'homeVisitController',
    [
        '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$timeout',
        '$window',
        'common.commonService',
        'applications.applicationsService',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $timeout,
            $window,
            commonService,
            applicationsService
        ){
            var app_id = $stateParams.app_id;
            var state_arr = $state.current.name.split('.');
            $scope.current_state = state_arr[2];
            $scope.page_state = {};
            $scope.home_visit_note = {};

            function getNote(){
                applicationsService.getNotePromise(app_id)
                .then(function(response){
                    if(response.results.length){
                        $scope.home_visit_note = response.results[0];
                    }
                });
            };
            getNote();

            $scope.updateHomeVisitNote = function(id,home_visit_note){
                var post_data = {
                    home_visit_note: home_visit_note
                };
                if(id){
                    applicationsService.updatetNotePromise(id,post_data)
                    .then(function(response){
                        applicationsService.getNotePromise(app_id)
                        .then(function(response){
                            if(response.results.length){
                                $scope.home_visit_note = response.results[0];
                            }
                            $rootScope.openModal('modal-confirm','提交成功','操作提示');
                        },function(error){
                            $('#modal-basic').on('hidden.bs.modal', function () {
                                $('body').addClass('modal-open');
                            });
                            commonService.responseModal(error.status,error.data);
                        });
                    });
                }
                else{
                    post_data.application = app_id;
                    applicationsService.createtNotePromise(post_data)
                    .then(function(response){
                        applicationsService.getNotePromise(app_id)
                        .then(function(response){
                            if(response.results.length){
                                $scope.home_visit_note = response.results[0];
                            }
                        });
                        $rootScope.openModal('modal-confirm','提交成功','操作提示');
                    },function(error){
                        $('#modal-basic').on('hidden.bs.modal', function () {
                            $('body').addClass('modal-open');
                        });
                        commonService.responseModal(error.status,error.data);
                    });
                }
            };

        }
    ]
)
.controller(
    'applicationsPlanController',
    [
        '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$window',
        'common.commonService',
        'calculator.calculatorService',
        'applications.applicationsService',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $window,
            commonService,
            calculatorService,
            applicationsService
        ){
            var app_id = $stateParams.app_id;
            $scope.send_email = true;
            $scope.error_tip = {};
            function initCredit(){
                applicationsService.detailPromise(app_id)
                .then(function(response){
                    $scope.application = response;
                    $scope.post_data = {
                        vehicle_price: null,
                        vehicle_down_payment: null,
                        vehicle_down_payment_percent:null,
                        loan_amt: null,
                        vehicle_loan_amt: null,
                        other_fee: null,
                        management_fee: null,
                        nper: null,
                        rate: null,
                        principal_ex: null,
                        principal_interest: null,
                        monthly_payment: null,
                        comments: null,
                    };
                    $scope.error_tip.vehicle_loan_amt = Number($scope.application.vehicle_loan_amt) > Number($scope.application.vehicle_price)*0.8 ? '车辆贷款金额不能大于车辆开票价的80%' : null;
                    $scope.error_tip.principal_ex = Number($scope.application.principal_ex) > Number($scope.application.vehicle_price)*0.9 ? '合同本金不能大于车辆开票价的90%' : null;
                    angular.forEach($scope.post_data,function(value,key){
                        if(key != 'app_id'){
                            if(key != 'comments'){
                                $scope.post_data[key] = $scope.application.uw_fin_plan ? Number($scope.application.uw_fin_plan[key]) : Number($scope.application[key]);
                            }
                            else{
                                $scope.post_data[key] = $scope.application.uw_fin_plan ? $scope.application.uw_fin_plan[key] : null;
                            }
                        }
                    });
                    $scope.bank_rate = $scope.application.bank_rate;
                    validate();
                },function(error){
                    // $scope.canExam = false;
                });
            };
            initCredit();

            $scope.$watch('post_data.vehicle_price',function(new_value,old_value){
                if(old_value&&new_value!=old_value){
                    $scope.post_data.vehicle_down_payment = $scope.post_data.vehicle_loan_amt = null;
                }
            });
            $scope.$watch('post_data.vehicle_loan_amt',function(new_value,old_value){
                if(new_value&&new_value!=old_value&&$scope.post_data.vehicle_price){
                    $scope.post_data.vehicle_down_payment = $scope.post_data.vehicle_price - new_value;
                }
            });

            function validate(){
                if(Number($scope.post_data.vehicle_down_payment) < Number($scope.post_data.vehicle_price)*0.2){
                    $scope.error_tip.vehicle_down_payment = '实际首付款不能小于车辆开票价的20%';
                }
                else if(Number($scope.post_data.vehicle_down_payment) > Number($scope.post_data.vehicle_price)){
                    $scope.error_tip.vehicle_down_payment = '实际首付款不能大于车辆开票价';
                }
                else{
                    $scope.error_tip.vehicle_down_payment = null;
                }
                if(Number($scope.post_data.loan_amt) < 10000){
                    $scope.error_tip.loan_amt = '贷款总额不能小于10000';
                }
                else if(Number($scope.post_data.loan_amt) > Number($scope.post_data.vehicle_price)*0.8){
                    $scope.error_tip.loan_amt = '贷款总额不能大于车辆开票价的80%';
                }
                else{
                    $scope.error_tip.loan_amt = null;
                }
            };

            $scope.autoCalculate = function(name){
                var param_filter = {
                    vehicle_price: null,
                    vehicle_down_payment: null,
                    vehicle_loan_amt: null,
                    management_fee: null,
                    other_fee: null,
                    rate: null,
                    nper: null
                };
                if(name != 'vehicle_price'){
                    $scope.post_data[name] = Math.round($scope.post_data[name]/100)*100;
                }
                else{
                    $scope.post_data[name] = Math.round($scope.post_data[name]);
                }
                $scope.post_data.vehicle_down_payment = $scope.post_data.vehicle_price - $scope.post_data.vehicle_loan_amt;
                var not_null = true;
                angular.forEach(param_filter,function(value,key){
                    param_filter[key] = $scope.post_data[key];
                    if(key != 'management_fee' && key != 'other_fee'){
                        if(!$scope.post_data[key]){
                            not_null = false;
                        }
                    }
                });
                validate();
                if(not_null){
                    param_filter.bank_rate = $scope.application.bank_rate;
                    var params = commonService.constructURLParams(param_filter);
                    calculatorService.calculatePromise(params)
                    .then(function(response){
                        console.log(response);
                        if(response){
                            angular.forEach(response,function(value,key){
                                $scope.post_data[key] = response[key];
                            });
                        }
                        else{
                            $rootScope.openModal('modal-confirm','计算失败，请重新尝试', '操作提示');
                        }
                    },function(error){
                        commonService.responseModal(error.status);
                    });
                }
            }
            // $scope.$watch('post_data.nper',function(new_value,old_value){
            //     if(old_value&&new_value!=old_value){
            //         $scope.post_data.rate = $scope.application.mine_rate[$scope.application.product_type]['rate_'+$scope.post_data.nper];
            //         $scope.bank_rate = $scope.application.bank_rate_dict['bank_rate_'+$scope.post_data.nper];
            //     }
            // });

            $scope.valid = {};

            $scope.submitLend = function(uw_result_code){
                post_lend = true;
                console.log($scope.post_data)
                $scope.post_data.uw_result_code = uw_result_code;
                $scope.post_data.send_email = $scope.send_email ? 0 : -1;
                angular.forEach($scope.post_data,function(value,key){
                    console.log(value);
                    if(!value){
                        return;
                    }
                    if(Object.keys(value).length){
                        angular.forEach(value,function(v,k){
                            if(!v){
                                return;
                            }
                        })
                    }
                });
                angular.forEach($scope.valid,function(value,key){
                    console.log(value);
                    if(!value){
                        return;
                    }
                });
                applicationsService.updatePlanPromise(app_id,$scope.post_data)
                .then(function(response){
                    console.log('post credit response:',response);
                    if(response){
                        $('#modal-basic').on('hidden.bs.modal', function () {
                            $('body').addClass('modal-open');
                        });
                        if(response){
                            $rootScope.openModal('modal-confirm','提交成功','操作提示');
                            $('#modal-confirm-button').click(function() {
                                $('#modal-confirm-button').unbind();
                                initCredit();
                            });
                        }
                        else{
                            $rootScope.openModal('modal-confirm','提交成功','操作提示');
                        }
                    }
                },function(error){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    commonService.responseModal(error.status,error.data);
                });

            }

            var post_lend = false;
            $scope.open = function() {
                post_lend = false;
                var uw_result_code;
                if($scope.page_state.P){
                    uw_result_code = 'P';
                }
                else if($scope.page_state.R){
                    uw_result_code = 'R';
                }
                else if($scope.page_state.S){
                    uw_result_code = 'S';
                }
                var content_s = '';
                applicationsService.getEmailListPromise(app_id)
                .then(function(response){
                    if(response.results){
                        angular.forEach(response.results,function(email_item){
                            content_s += email_item.email ? email_item.name + '：' + email_item.email + '<br>' : '';
                        });
                    }
                    openModal();
                },function(error){
                    openModal();
                });
                function openModal(){
                    $scope.modalText = {
                        P: {
                            title: '是否通过该申请？',
                            content: '「审批通过」后用户将进入「选择金融方案」流程，会向下列邮箱发送审批结果邮件，请仔细核对：<div class="email-text">' + content_s + '</div>',
                            okText: '确认通过',
                            cancelText: '放弃'
                        },
                        R: {
                            title: '是否拒绝该申请？',
                            content: '该操作将直接结束申请流程，会向下列邮箱发送审批结果邮件，请仔细核对：<div class="email-text">' + content_s + '</div>',
                            okText: '确认拒绝',
                            cancelText: '放弃'
                        },
                        S: {
                            title: '该操作会向下列邮箱发送审批结果邮件，请仔细核对：',
                            content: '<div class="email-text">' + content_s + '</div>',
                            okText: '确认发送',
                            cancelText: '取消'
                        }
                    };
                    $rootScope.openModal('modal-basic',
                        $scope.modalText[uw_result_code].content,
                        $scope.modalText[uw_result_code].title,
                        $scope.modalText[uw_result_code].okText,
                        $scope.modalText[uw_result_code].cancelText,
                        'credit'
                    );
                    $('#modal-ok-button').click(function() {
                        $('#modal-ok-button').unbind();
                        if($('#modal-ok-button').hasClass('credit')){
                            if(!post_lend){
                                if(uw_result_code != 'S'){
                                    $scope.submitLend(uw_result_code);
                                }
                                else{
                                    $scope.sendEmail();
                                }
                            }
                        }
                    });
                    function resetResult(){
                        $scope.page_state.P = false;
                        $scope.page_state.R = false;
                    };
                    resetResult();
                };

            };

            $scope.sendEmail = function(){
                post_lend = true;
                console.log('send email...')
                applicationsService.sendEmailPromise(app_id,'?dtype=financial_plan')
                .then(function(response){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                });
            };


        }
    ]
)
.controller(
    'applicationsCreditController',
    [
        '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$window',
        '$timeout',
        'common.commonService',
        'api',
        'oss.ossService',
        'PanZoomService',
        'applications.applicationsService',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $window,
            $timeout,
            commonService,
            api,
            ossService,
            PanZoomService,
            applicationsService
        ){
            var app_id = $stateParams.app_id;
            var state_arr = $state.current.name.split('.');
            var current_name = state_arr[state_arr.length-1];
            $scope.current_name = current_name == 'img_plan' ? $stateParams.tab : current_name;
            $scope.current_state = state_arr[2];
            console.log(current_name,$scope.current_state);
            $scope.checker_data = {};
            $scope.uw_credit_data = {};
            $scope.uw_img_data={};
            $scope.selected_sub_item_index = 0;
            $scope.page_state={
                // downloading: false,
                uploading: false
            };
            $scope.client_roles = commonService.client_roles();

            $scope.toggleExamName = function(name){
                $scope.exam_name = name;
                if(name == 'img'){
                    applicationsService.detailPromise(app_id)
                    .then(function(response){
                        console.log(response);
                        if(response){
                            $scope.application = response;
                            var name = $scope.selected_item_index || 0;
                            $scope.toggleExamItem(name);
                        }
                    });
                    // applicationsService.getUwImgPromise(app_id)
                    // .then(function(response){
                    //     console.log(response);
                    //     if(response.code == 0){
                    //         $scope.img_result = response.result[current_name].uw_result_code;
                    //         $scope.uw_img_data.id = response.result[current_name].id;
                    //         applicationsService.getCheckerPromise($scope.uw_img_data.id)
                    //         .then(function(response){
                    //             if(response.code == 0){
                    //                 $scope.check_list = response.result;
                    //                 var name = $scope.selected_item_index || 0;
                    //                 $scope.toggleExamItem(name);
                    //             }
                    //         });
                    //     }
                    //
                    // });
                }else{
                    $scope.getUwCredit(name);
                }
            };
            $scope.toggleExamName('img');

            $scope.toggleExamItem = function(index){
                console.log(index)
                $scope.selected_item_index = index;
                var state_arr = $state.current.name.split('.');
                var current_state = state_arr[state_arr.length - 1];
                var item_name = current_state == 'img_plan' ? $stateParams.tab : current_state;
                var plan_id = $scope.application.uw_img_plan_list[index].checker[item_name].id;
                console.log(plan_id)
                console.log(current_state,plan_id);
                applicationsService.getImgPlanPromise(plan_id)
                .then(function(response){
                    $scope.uw_img_data = response;
                    console.log($scope.uw_img_data)
                    $scope.check_list = response.uw_img_plan_checker;
                    console.log(response);
                    $scope.toggleExamSubItem(0);
                });
            };


            $scope.toggleExamSubItem = function(index){
                var item = $scope.check_list[index];
                $scope.selected_sub_item_index = index;
                $scope.active_index = 0;
                $scope.rotate.rotate_deg = 0;
                $scope.images_list = item.urls;
                $scope.checker_data.comments = item.comments;
                $scope.check_items = item.description;
                // $scope.check_items = {};
                // if(item.description && typeof(item.description) == 'string'){
                //     $scope.check_items = eval('(' + item.description + ')');
                // }
            };

            $scope.active_index = 0;
            $scope.rotate = {
                rotate_deg: 0
            };
            $scope.$watch('active_index',function(newValue,oldValue){
                if(newValue != oldValue){
                    $scope.rotate.rotate_deg = 0;
                }
            });
            $scope.panzoomConfig = {
                zoomLevels: 10,
                neutralZoomLevel: 5,
                initialZoomLevel: 5,
                scalePerZoomLevel: 1.5,
                invertMouseWheel: true,
                // initialZoomToFit: {
                //     x: 0,
                //     y: 0,
                //     width: 80,
                //     height: 80
                // }
                // zoomToFitZoomLevelFactor: 1
            };
            $scope.panzoomModel = {};
            $scope.zoomIn = function(){
                PanZoomService.getAPI('PanZoom' + $scope.active_index).then(function (api) {
                    api.zoomIn();
                });
            };
            $scope.zoomOut = function(){
                PanZoomService.getAPI('PanZoom' + $scope.active_index).then(function (api) {
                    api.zoomOut();
                });
            };

            var post_checker = false;
            $scope.postChecker = function(result){
                console.log(result);
                console.log('checker');
                post_checker = false;
                var post_data = {
                    comments: $scope.checker_data.comments,
                    result: result
                };
                $('#modal-basic').on('hidden.bs.modal', function () {
                    $('body').addClass('modal-open');
                });
                applicationsService.updateCheckerPromise(app_id,$scope.check_list[$scope.selected_sub_item_index].id,post_data)
                .then(function(response){
                    console.log(response);
                    if(response){
                        $scope.check_list[$scope.selected_sub_item_index].comments = $scope.checker_data.comments;
                        $scope.check_list[$scope.selected_sub_item_index].result = result;
                        console.log($scope.selected_item_index,$scope.check_list.length);
                        if($scope.selected_sub_item_index == $scope.check_list.length -1 || $scope.selected_item_index + 1 > $scope.application.uw_img_plan_list.length){
                            $rootScope.openModal('modal-confirm','提交成功','操作提示');
                        }
                        else{
                            $rootScope.openModal('modal-confirm','提交成功，自动跳转到下一项','操作提示','','','credit-jump');
                        }
                        $('#modal-confirm-button').click(function() {
                            $('#modal-confirm-button').unbind();
                            if($('#modal-confirm-button').hasClass('credit-jump')){
                                if(!post_checker){
                                    $timeout(function(){
                                        if($scope.selected_sub_item_index + 1 < $scope.check_list.length){
                                            $scope.toggleExamSubItem($scope.selected_sub_item_index + 1);
                                        }
                                        else{
                                            $scope.toggleExamItem($scope.selected_item_index + 1);
                                        }
                                    });
                                }
                            }
                            post_checker = true;
                        });
                    }
                    else{
                        $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                    }
                },function(error){
                    commonService.responseModal(error.status,error.data);
                });
            }

            $scope.postUwImg = function(result){
                console.log('img plan')
                var post_data = {
                    uw_result_code: result
                };
                $('#modal-basic').on('hidden.bs.modal', function () {
                    $('body').addClass('modal-open');
                });
                var post_name = current_name=='img_plan' ? $stateParams.tab : current_name;
                applicationsService.updateImgPlanPromise(app_id,post_name,post_data)
                .then(function(response){
                    if(response.msg){
                        $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                    }
                    else{
                        $scope.uw_img_data = response;
                        $rootScope.openModal('modal-confirm','操作成功','操作提示');
                    }
                },function(error){
                    commonService.responseModal(error.status,error.data);
                });
            };

            $scope.getUwCredit = function(name){
                console.log(name)
                // $scope.uw_credit_data.id = null;
                // $scope.uw_credit_data.comments = null;
                angular.forEach($scope.application.uw_credit,function(credit){
                    console.log(credit)
                    if(credit.uw_category == name){
                        $scope.uw_credit_data = credit;
                        console.log($scope.uw_credit_data)
                    }
                });
                // applicationsService.getUwCreditPromise(app_id)
                // .then(function(response){
                //     if(response.code == 0){
                //         $scope.uw_credit_data.id = response.result[name].id;
                //         $scope.uw_credit_data.comments = response.result[name].comments;
                //     }
                // })
            };

            $scope.postUwCredit = function(result){
                var post_data = {
                    uw_result_code: result,
                    comments: $scope.uw_credit_data.comments
                };
                // $scope.uw_credit_data.uw_result_code = result;
                $('#modal-basic').on('hidden.bs.modal', function () {
                    $('body').addClass('modal-open');
                });
                applicationsService.updateUwCreditPromise(app_id,$scope.uw_credit_data.id,post_data)
                .then(function(response){
                    if(response){
                        $scope.uw_credit_data = response;
                    }
                    $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                },function(error){
                    commonService.responseModal(error.status,error.data);
                });
            };
            $scope.yuncheLoan = function(result){
                $('#modal-basic').on('hidden.bs.modal', function () {
                    $('body').addClass('modal-open');
                });
                applicationsService.yuncheLoanPromise(app_id)
                .then(function(response){
                    $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                },function(error){
                    commonService.responseModal(error.status,error.data);
                });
            };
            $scope.queryCredit = function(result){
                $('#modal-basic').on('hidden.bs.modal', function () {
                    $('body').addClass('modal-open');
                });
                applicationsService.queryCreditPromise(app_id)
                .then(function(response){
                    $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                },function(error){
                    commonService.responseModal(error.status,error.data);
                });
            };

            var open_modal = false;
            $scope.open = function (item,result,callback) {
                open_modal = false;
                if(current_name == 'credit'){
                    var content_s = '';
                    applicationsService.getEmailListPromise(app_id)
                    .then(function(response){
                        if(response.results){
                            angular.forEach(response.results,function(email_item){
                                content_s += email_item.email ? email_item.name + '：' + email_item.email + '<br>' : '';
                            });
                        }
                        openModal();
                    },function(error){
                        openModal();
                    });
                }
                else{
                    openModal();
                }
                function openModal(){
                    var send_email = false;
                    if(current_name == 'credit'){
                        send_email = true;
                    }
                    $scope.modalText = {
                        checker: {
                            P: {
                                title: '是否检测通过？',
                                content: '<p>请确认</p>',
                                okText: '检测通过',
                                cancelText: '取消'
                            },
                            R: {
                                title: '是否检测不通过？',
                                content: '<p>请确认</p>',
                                okText: '检测不通过',
                                cancelText: '取消'
                            },
                        },
                        img: {
                            P: {
                                title: '是否审批通过？',
                                content: send_email ? '该操作会向下列邮箱发送审批结果邮件，请仔细核对：<div class="email-text">' + content_s + '</div>' : '审批通过',
                                okText: '审批通过',
                                cancelText: '取消'
                            },
                            R: {
                                title: '是否审批拒绝？',
                                content: send_email ? '该操作会向下列邮箱发送审批结果邮件，请仔细核对：<div class="email-text">' + content_s + '</div>' : '审批拒绝',
                                okText: '审批拒绝',
                                cancelText: '取消'
                            }
                        },
                        pboc: {
                            P: {
                                title: '云车征信是否通过？',
                                content: '云车征信通过',
                                okText: '云车征信通过',
                                cancelText: '取消'
                            },
                            R: {
                                title: '云车征信是否不通过？',
                                content: send_email ? '该操作会向下列邮箱发送审批结果邮件，请仔细核对：<div class="email-text">' + content_s + '</div>' : '云车征信不通过',
                                okText: '云车征信不通过',
                                cancelText: '取消'
                            }
                        },
                        yunche_loan: {
                            P: {
                                title: '是否一键报单',
                                content: '一键报单将直接把资料发送到云车系统',
                                okText: '确认',
                                cancelText: '取消'
                            }
                        },
                        query_credit: {
                            P: {
                                title: '是否查询征信',
                                content: '查询征信',
                                okText: '确认',
                                cancelText: '取消'
                            }
                        },
                    };

                    $rootScope.openModal('modal-basic',
                        $scope.modalText[item][result].content,
                        $scope.modalText[item][result].title,
                        $scope.modalText[item][result].okText,
                        $scope.modalText[item][result].cancelText,
                        item
                    );
                    $('#modal-ok-button').click(function() {
                        console.log('click')
                        $('#modal-ok-button').unbind();
                        if($('#modal-ok-button').hasClass(item)){
                            console.log(item)
                            if(!open_modal){
                                $timeout(function () {
                                    console.log(callback,result);
                                    $scope[callback](result);
                                });
                            }
                            open_modal = true;
                        }
                    });
                };


            };

            function getSts(){
                ossService.getStsPromise()
                .then(function(response){
                    console.log(response);
                    var client = new OSS.Wrapper({
                        accessKeyId: response.AccessKeyId,
                        accessKeySecret: response.AccessKeySecret,
                        stsToken: response.SecurityToken,
                        endpoint: response.FidDetail.Region,
                        bucket: response.FidDetail.Bucket
                    });
                    // client.list({
                    //     'max-keys': 10
                    // }).then(function (result) {
                    //     console.log(result);
                    // }).catch(function (err) {
                    //     console.log(err);
                    // });
                    return client;
                });
            };

            $scope.$watch('page_state.file',function(new_value,old_value){
                if(new_value && new_value != old_value){
                    // console.log(new_value);
                    $scope.page_state.uploading = true;
                    var role = $scope.application.uw_img_plan_list[$scope.selected_item_index].en;
                    var category = $scope.check_list[$scope.selected_sub_item_index].category;
                    var file_id = 'CUSTOMER/' +
                        $scope.application.mobile + '/' + role.toUpperCase() + '/' +
                        category.toUpperCase() + '/' +
                        new_value.lastModified;
                    ossService.getUploadFilePromise()
                    .then(function(response){
                        // console.log(response);
                        if(response){
                            var client = new OSS.Wrapper({
                                accessKeyId: response.AccessKeyId,
                                accessKeySecret: response.AccessKeySecret,
                                stsToken: response.SecurityToken,
                                endpoint: response.FidDetail.Region,
                                bucket: response.FidDetail.Bucket
                            });
                            client.multipartUpload(file_id, new_value)
                            .then(function (result) {
                                console.log(result);
                                if(result){
                                    var clt_id;
                                    if(role == 'lender'){
                                        clt_id = $scope.application.client.clt_id;
                                    }
                                    else if(role == 'spouse'){
                                        clt_id = $scope.application.client.spouse.clt_id;
                                    }
                                    else if(role == 'guarantor'){
                                        clt_id = $scope.application.client.guarantor.clt_id;
                                    }
                                    else if(role == 'guarantor_spouse'){
                                        clt_id = $scope.application.client.guarantor.spouse.clt_id;
                                    }
                                    ossService.yusionUploadPromise({
                                        region: response.FidDetail.Region,
                                        bucket: response.FidDetail.Bucket,
                                        files: [{
                                            "file_id": file_id,
                                            "label": category,
                                            "app_id": app_id,
                                            "clt_id": clt_id
                                        }]
                                    })
                                    .then(function(upload_response){
                                        // console.log(response);
                                        $scope.page_state.uploading = false;
                                        $scope.toggleExamName('img');
                                        $rootScope.openModal('modal-confirm',
                                            upload_response.msg, '操作提示');
                                    },function(error){
                                        commonService.errorModal(error.status);
                                    });
                                }else{
                                    $rootScope.openModal('modal-confirm',
                                        '上传失败', '操作提示');
                                }
                            }).catch(function (err) {
                                console.log(err);
                            });
                        }
                        else{
                            $rootScope.openModal('modal-confirm',
                                '上传失败', '操作提示');
                        }
                    },function(error){
                        commonService.errorModal(error.status);
                    });


                }
                else if(new_value && new_value == old_value){
                    $rootScope.openModal('modal-confirm',
                        '请选择不同文件', '操作提示');
                }
            });

            $scope.downloadImgPlan = function(){
                var url = api.applications.download_img_plan(app_id,current_name);
                window.open(url,'_blank');
            };



        }
    ]
)
.controller(
    'yujianCreditInvestController',
    [
        '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$window',
        '$timeout',
        'common.commonService',
        'api',
        'oss.ossService',
        'PanZoomService',
        'applications.applicationsService',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $window,
            $timeout,
            commonService,
            api,
            ossService,
            PanZoomService,
            applicationsService
        ){
            var app_id = $stateParams.app_id;
            var state_arr = $state.current.name.split('.');
            var current_name = state_arr[state_arr.length-1];
            $scope.current_name = current_name;
            console.log(current_name);
            $scope.checker_data = {};
            $scope.uw_credit_data = {};

            $scope.page_state = {
                // downloading: false,
                uploading: false,
                rigit_filters: {
                    limit: 100,
                    level: 1,
                    dtype: 'yujian_credit_invest_reject'
                },
                reject_comment: {}
            };
            $scope.client_roles = commonService.client_roles();

            $scope.getRigidComments = function(){
                var params = commonService.constructURLParams($scope.page_state.rigit_filters);
                applicationsService.rigitCommentsPromise(params)
                .then(function(response){
                    $scope.rigid_comments = response.results;
                });
            };
            $scope.getRigidComments();

            $scope.getSecondRigidComments = function(parent__id){
                var filters = angular.copy($scope.page_state.rigit_filters);
                filters.parent__id = parent__id;
                filters.level=2;
                var params = commonService.constructURLParams(filters);
                applicationsService.rigitCommentsPromise(params)
                .then(function(response){
                    $scope.second_rigid_comments = response.results;
                });
            };

            applicationsService.rigitCommentsPromise('?limit=100&dtype=yujian_credit_invest_aberrant')
            .then(function(response){
                $scope.error_comments = response.results;
                console.log($scope.error_comments);
            });

            $scope.$watch('page_state.reject_comment.level1_index',function(new_value,old_value){
                if(new_value !== old_value){
                    $scope.page_state.reject_comment.level2_index = null;
                    $scope.getSecondRigidComments($scope.rigid_comments[$scope.page_state.reject_comment.level1_index].id);
                }
            });

            $scope.addComment = function(){
                var comment;
                if($scope.page_state.reject_comment.level1_index || $scope.page_state.reject_comment.level1_index === 0){
                    comment = $scope.rigid_comments[$scope.page_state.reject_comment.level1_index];
                    if($scope.second_rigid_comments && $scope.second_rigid_comments.length){
                        if($scope.page_state.reject_comment.level2_index || $scope.page_state.reject_comment.level2_index === 0){
                            comment = $scope.second_rigid_comments[$scope.page_state.reject_comment.level2_index];
                        }
                        else{
                            comment = null;
                        }
                    }
                }
                if(comment){
                    console.log(comment)
                    var exit = false;
                    angular.forEach($scope.added_rigid_comments,function(rigid_comment){
                        if(rigid_comment.id == comment.id){
                            // console.log(rigid_comment,comment);
                            exit = true;
                        }
                    });
                    if(exit){
                        $rootScope.openModal('modal-confirm','该拒绝原因已存在','操作提示');
                    }
                    else{
                        if(!$scope.added_rigid_comments){
                            $scope.added_rigid_comments = [];
                        }
                        $scope.added_rigid_comments.push(comment);
                    }
                }
                else{
                    $rootScope.openModal('modal-confirm','请选择拒绝原因','操作提示');
                }
            };
            $scope.removeComment = function(index){
                $scope.added_rigid_comments.splice(index,1);
            };

            function getAddedRigidComments(credit_data){
                var filters = {
                    limit: 100,
                    id_in: credit_data.rigid_comments.toString()
                };
                var params = commonService.constructURLParams(filters);
                applicationsService.rigitCommentsPromise(params)
                .then(function(response){
                    if($scope.uw_credit_data.uw_result_code == 'R'){
                        $scope.added_rigid_comments = response.results;
                    }
                    else if($scope.uw_credit_data.uw_result_code == 'A'){
                        $scope.page_state.error_comment = response.results[0].name;
                    }
                });
            };

            function initCreditInvest(){
                applicationsService.detailPromise(app_id)
                .then(function(response){
                    if(response){
                        $scope.application = response;
                        angular.forEach($scope.application.uw_credit,function(credit){
                            if(credit.uw_category == 'yujian_credit_invest'){
                                $scope.uw_credit_data = credit;
                                if(credit.rigid_comments && credit.rigid_comments.length){
                                    getAddedRigidComments(credit);
                                }
                                console.log($scope.uw_credit_data)
                            }
                        });
                    }
                });
            };
            initCreditInvest();


            $scope.postUwCredit = function(result){
                var valid = false;
                var post_data = {
                    uw_result_code: result,
                };
                if(result == 'R'){
                    var id_list = [];
                    angular.forEach($scope.added_rigid_comments,function(comment){
                        if(id_list.indexOf(comment.id) == -1){
                            id_list.push(comment.id);
                        }
                    });
                    post_data.rigid_comments = id_list;
                    // console.log(post_data.rigid_comments.length)
                    if(post_data.rigid_comments.length){
                        valid = true;
                    }
                    else{
                        $('#modal-basic').on('hidden.bs.modal', function () {
                            $('body').addClass('modal-open');
                        });
                        $rootScope.openModal('modal-confirm','请选择拒绝原因','操作提示');
                        valid = false;
                    }
                }
                else if(result == 'A'){
                    post_data.reject_type = $scope.page_state.error_comment;
                    angular.forEach($scope.error_comments,function(comment){
                        if(comment.name == post_data.reject_type){
                            post_data.rigid_comments = [];
                            post_data.rigid_comments[0] = comment.id;
                        }
                    });
                    if(post_data.reject_type){
                        valid = true;
                    }
                    else{
                        valid = false;
                        $('#modal-basic').on('hidden.bs.modal', function () {
                            $('body').addClass('modal-open');
                        });
                        $rootScope.openModal('modal-confirm','请选择异常原因','操作提示');
                    }
                }
                else if(result == 'P'){
                    valid = true;
                }
                if(valid){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    applicationsService.updateUwCreditPromise(app_id,$scope.uw_credit_data.id,post_data)
                    .then(function(response){
                        initCreditInvest();
                        $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                    },function(error){
                        commonService.responseModal(error.status,error.data);
                    });
                }

            };

            var open_modal = false;
            $scope.open = function (item,result,callback) {
                open_modal = false;
                var content_s = '';
                applicationsService.getEmailListPromise(app_id)
                .then(function(response){
                    if(response.results){
                        angular.forEach(response.results,function(email_item){
                            content_s += email_item.email ? email_item.name + '：' + email_item.email + '<br>' : '';
                        });
                    }
                    openModal();
                },function(error){
                    openModal();
                });
                function openModal(){
                    $scope.modalText = {
                        yujian_credit_invest: {
                            P: {
                                title: '电核是否通过？',
                                content: '该操作会向下列邮箱发送审批结果邮件，请仔细核对：<div class="email-text">' + content_s + '</div>',
                                okText: '电核通过',
                                cancelText: '取消'
                            },
                            R: {
                                title: '电核是否不通过？',
                                content: '该操作会向下列邮箱发送审批结果邮件，请仔细核对：<div class="email-text">' + content_s + '</div>',
                                okText: '电核不通过',
                                cancelText: '取消'
                            },
                            A: {
                                title: '电核异常？',
                                content: '该操作会向下列邮箱发送审批结果邮件，请仔细核对：<div class="email-text">' + content_s + '</div>',
                                okText: '电核异常',
                                cancelText: '取消'
                            },
                        }
                    };

                    $rootScope.openModal('modal-basic',
                        $scope.modalText[item][result].content,
                        $scope.modalText[item][result].title,
                        $scope.modalText[item][result].okText,
                        $scope.modalText[item][result].cancelText,
                        item
                    );
                    $('#modal-ok-button').click(function() {
                        $('#modal-ok-button').unbind();
                        if($('#modal-ok-button').hasClass(item)){
                            if(!open_modal){
                                $timeout(function () {
                                    console.log(callback);
                                    $scope[callback](result);
                                });
                            }
                            open_modal = true;
                        }
                    });
                };

            };

        }
    ]
)
.controller(
    'applicationsPostLoanlController',
    [
        '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$timeout',
        'common.commonService',
        'oss.ossService',
        'applications.applicationsService',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $timeout,
            commonService,
            ossService,
            applicationsService
        ){
            var app_id = $stateParams.app_id;
            var state_arr = $state.current.name.split('.');
            var current_name = state_arr[state_arr.length-1];
            $scope.current_name = current_name;
            console.log(current_name);

            $scope.page_state = {
                upload_img: {},
                post_loan_values: []
            };

            function getPostLoanList(){
                applicationsService.getPostLoan(app_id)
                .then(function(response){
                    $scope.post_loan_list = response.result.tab;
                    console.log($scope.post_loan_list)
                    $scope.changeTab($scope.page_state.tab_index);
                });
            };
            getPostLoanList();

            $scope.changeTab = function(index){
                var index = index || 0;
                $scope.page_state.tab_index = index;
                console.log(index)
                if(index == $scope.post_loan_list.length){
                    $scope.changeSubTab();
                }
                else{
                    $scope.changeSubTab($scope.post_loan_list[index].value[0],$scope.page_state.sub_tab_index);
                }
                return false;
            };
            $scope.changeSubTab = function(post_loan,index){
                var index = index || 0;
                $scope.page_state.sub_tab_index = index;
                $scope.post_loan = post_loan || null;
                $scope.page_state.file_list_open = true;
                $scope.page_state.delivery_open = true;
                $scope.page_state.express_number = null;
                if(!post_loan){
                    applicationsService.getPostLoanInputValuesPromise(app_id)
                    .then(function(response){
                        $scope.post_loan_input_values = response;
                        angular.forEach(response,function(list,index){
                            $scope.page_state['not_express_open_' + index] = true;
                            $scope.page_state.post_loan_values[index] = [];
                        });
                        console.log(response);
                    },function(error){
                        $scope.post_loan_input_values = null;
                    });
                }
                return false;
            };

            $scope.updatePostLoanValue = function(list_index,value_index){
                var post_data = {};
                var key = $scope.post_loan_input_values[list_index].content[value_index].label;
                post_data[key] = $scope.page_state.post_loan_values[list_index][value_index];
                applicationsService.updatePostLoanInputValuesPromise(app_id,post_data)
                .then(function(response){
                    if(response){
                        $scope.changeSubTab();
                        $rootScope.openModal('modal-confirm','更新成功','操作提示');
                    }
                },function(error){
                    commonService.responseModal(error.status,error.data);
                });
            };

            $scope.createExpress = function(){
                var item = $scope.post_loan_list[$scope.page_state.tab_index];
                var post_data = {
                    express_number: $scope.page_state.express_number
                };
                applicationsService.createExpressPromise(
                    app_id,
                    item.name,
                    $scope.post_loan.where_from,
                    $scope.post_loan.where_to,
                    post_data
                )
                .then(function(response){
                    if(response){
                        getPostLoanList();
                        $rootScope.openModal('modal-confirm','快递单号添加成功','操作提示');
                    }
                },function(error){
                    commonService.responseModal(error.status,error.data);
                });
            };

            $scope.openExpress = function($event,express_number,express_index){
                if(!$scope.page_state['express_' + express_index]){
                    applicationsService.getExpressPromise(express_number)
                    .then(function(response){
                        if(response && response.result){
                            $scope.post_loan.express_list[express_index].express = response.result;
                        }
                    });
                }
            };
            $scope.clickToggle = function(confirmed,express_index){
                var can_update = false;
                if(confirmed){
                    can_update = true;
                }
                else{
                    angular.forEach($scope.post_loan.express_list[express_index].project_list,function(project){
                        if(project.confirmed){
                            can_update = true;
                        }
                    });
                }
                $scope.page_state.can_update = can_update;
            };

            $scope.updateExpress = function(express){
                var item = $scope.post_loan_list[$scope.page_state.tab_index];
                var post_data = {};
                angular.forEach(express.project_list,function(project){
                    post_data[project.item] = project.confirmed;
                });
                applicationsService.updateExpressPromise(
                    app_id,
                    item.name,
                    $scope.post_loan.where_from,
                    $scope.post_loan.where_to,
                    express.express.number,
                    post_data
                )
                .then(function(response){
                    if(response){
                        getPostLoanList();
                        $('#modal-basic').on('hidden.bs.modal', function () {
                            $('body').addClass('modal-open');
                        });
                        $rootScope.openModal('modal-confirm','快递单号更新成功','操作提示');
                    }
                },function(error){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    commonService.responseModal(error.status,error.data);
                });
            };

            $scope.resetProject = function(item){
                var post_data = {};
                post_data[item] = false;
                var category = $scope.post_loan_list[$scope.page_state.tab_index];
                applicationsService.resetProjectPromise(
                    app_id,
                    category.name,
                    $scope.post_loan.where_from,
                    $scope.post_loan.where_to,
                    post_data
                )
                .then(function(response){
                    if(response){
                        getPostLoanList();
                        $('#modal-basic').on('hidden.bs.modal', function () {
                            $('body').addClass('modal-open');
                        });
                        $rootScope.openModal('modal-confirm','项目状态重置成功','操作提示');
                    }
                },function(error){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    commonService.responseModal(error.status,error.data);
                });
            };


            var open_modal = false;
            $scope.open = function ($event,callback,data) {
                open_modal = false;
                $scope.modalText = {
                    updateExpress: {
                        title: '是否确认更新快递信息？',
                        content: '更新后不可再次更新',
                        okText: '确认',
                        cancelText: '取消'
                    },
                    resetProject: {
                        title: '是否重置项目签收状态？',
                        content: '确认重置',
                        okText: '确认',
                        cancelText: '取消'
                    }
                };

                $rootScope.openModal('modal-basic',
                    $scope.modalText[callback].content,
                    $scope.modalText[callback].title,
                    $scope.modalText[callback].okText,
                    $scope.modalText[callback].cancelText,
                    callback
                );
                $('#modal-ok-button').click(function() {
                    $('#modal-ok-button').unbind();
                    if($('#modal-ok-button').hasClass(callback)){
                        if(!open_modal){
                            $timeout(function () {
                                console.log(callback);
                                $scope[callback](data);
                            });
                        }
                        open_modal = true;
                    }
                });
                $event.stopPropagation();
                $event.preventDefault();
            };

            $scope.clickUpload = function(express_number,label,express_index,image_index){
                $scope.page_state.upload_img = {
                    express_number: express_number,
                    label: label,
                    express_index: express_index,
                    image_index: image_index
                };
            };
            $scope.removeImage = function(express_number,label,express_index,image_index){
                applicationsService.deleteExpressImgPromise(
                    express_number,
                    label
                )
                .then(function(response){
                    if(response && response.result){
                        $scope.post_loan.express_list[express_index].express.image_list[image_index] = response.result[0];
                        console.log(express_index,image_index,$scope.post_loan.express_list[express_index].express.image_list[image_index])
                    }
                    // $rootScope.openModal('modal-confirm', '删除成功', '操作提示');
                },function(error){
                    commonService.errorModal(error.status);
                });
            };

            $scope.$watch('page_state.file',function(new_value,old_value){
                if(new_value){
                    // console.log(new_value);
                    $scope.page_state.uploading = true;
                    var role = 'lender';
                    var category = 'others';
                    var file_id = 'CUSTOMER/' +
                        app_id + '/' + role.toUpperCase() + '/' +
                        category.toUpperCase() + '/' +
                        new_value.lastModified;
                    ossService.getUploadFilePromise()
                    .then(function(response){
                        // console.log(response);
                        if(response){
                            var client = new OSS.Wrapper({
                                accessKeyId: response.AccessKeyId,
                                accessKeySecret: response.AccessKeySecret,
                                stsToken: response.SecurityToken,
                                endpoint: response.FidDetail.Region,
                                bucket: response.FidDetail.Bucket
                            });
                            client.multipartUpload(file_id, new_value)
                            .then(function (result) {
                                console.log(result);
                                if(result){
                                    ossService.yusionUploadPromise({
                                        region: response.FidDetail.Region,
                                        bucket: response.FidDetail.Bucket,
                                        files: [{
                                            "file_id": file_id,
                                            "label": category,
                                            "app_id": app_id
                                        }]
                                    })
                                    .then(function(upload_response){
                                        // console.log(response);
                                        if(upload_response.data && upload_response.data.length){
                                            applicationsService.uploadExpressImgPromise(
                                                $scope.page_state.upload_img.express_number,
                                                $scope.page_state.upload_img.label,
                                                {
                                                    file_id: upload_response.data[0]
                                                }
                                            )
                                            .then(function(upload_post_loan_response){
                                                $scope.page_state.uploading = false;
                                                $rootScope.openModal('modal-confirm',
                                                    upload_response.msg, '操作提示');
                                                if(upload_post_loan_response && upload_post_loan_response.result){
                                                    $scope.post_loan.express_list[$scope.page_state.upload_img.express_index].express.image_list[$scope.page_state.upload_img.image_index] = upload_post_loan_response.result[0];
                                                }
                                            },function(error){
                                                commonService.errorModal(error.status);
                                            });
                                        }

                                    },function(error){
                                        commonService.errorModal(error.status);
                                    });
                                }else{
                                    $rootScope.openModal('modal-confirm',
                                        '上传失败', '操作提示');
                                }
                            }).catch(function (err) {
                                console.log(err);
                            });
                        }
                        else{
                            $rootScope.openModal('modal-confirm',
                                '上传失败', '操作提示');
                        }
                    },function(error){
                        commonService.errorModal(error.status);
                    });


                }
            });

        }
    ]
)
.controller(
    'sendBackController',
    [
        '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$timeout',
        'common.commonService',
        'applications.applicationsService',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $timeout,
            commonService,
            applicationsService
        ) {
            var app_id = $stateParams.app_id;
            $scope.app_id = app_id;
            $scope.page_state = {};
            $scope.app_detail = {
                'app': [
                    {name: '门店',key: 'dlr_nm'},
                    {name: '品牌',key: 'brand'},
                    {name: '车系',key: 'trix'},
                    {name: '车型',key: 'model_name'},
                    {name: '颜色',key: 'vehicle_color'},
                    {name: '业务种类',key: 'vehicle_cond'},
                    {name: '厂商指导价（元）',key: 'msrp'},
                    {name: '车辆开票价（元）',key: 'vehicle_price'},
                    {name: '车辆首付款（元）',key: 'vehicle_down_payment'},
                    {name: '车辆贷款额（元）',key: 'vehicle_loan_amt'},
                    {name: '是否贷档案管理费',key: 'management_fee'},
                    {name: '其他费用（元）',key: 'other_fee'},
                    {name: '总贷款额（元）',key: 'loan_amt'},
                    {name: '贷款银行',key: 'loan_bank'},
                    {name: '产品类型',key: 'product_type'},
                    {name: '预计上牌地',key: 'plate_reg_addr'},
                    {name: '车主与申请人关系',key: 'vehicle_owner_lender_relation'}
                ],
                lender: [
                    {name:'户籍地',key:'reg_addr_info'},
                    {name:'店铺名称',key:'major_company_name'},
                    {name:'经营项目地址',key:'major_company_addr_details'},
                    // {name:'经营项目详细地址',key:''},
                    // {name:'经营项目地址门牌号',key:''},
                    {name:'单位名称',key:'major_company_name'},
                    {name:'职务',key:'major_work_position'},
                    {name:'单位座机',key:'major_work_phone_num'},
                    {name:'单位地址',key:'major_company_addr_details'},
                    // {name:'单位详细地址',key:''},
                    // {name:'单位地址门牌号',key:''}
                ],
                spouse: [
                    {name:'店铺名称',key:'reg_addr_info'},
                    {name:'经营项目地址',key:'major_company_addr_details'},
                    // {name:'经营项目详细地址',key:''},
                    // {name:'经营项目地址门牌号',key:''},
                    {name:'单位名称',key:'major_company_name'},
                    {name:'单位座机',key:'major_work_phone_num'},
                    {name:'单位地址',key:'major_company_addr_details'},
                    // {name:'单位详细地址',key:''},
                    // {name:'单位地址门牌号',key:''}
                ]
            };

            function getModifyApp(){
                applicationsService.getModifyAppDetailPromise(app_id)
                .then(function(response){
                    $scope.app_list = angular.copy(response.data);
                    // console.log($scope.modify_list,$scope.origin_app);
                    $scope.toggleItem(0,true);
                });
            };
            getModifyApp();

            $scope.toggleItem = function(index,is_first){
                $scope.page_state.active_index = index;
                $scope.modify_detail = $scope.app_list.all_app[index];
                $scope.origin_app = $scope.app_list.all_app_contrast[index];
                // $scope.selected_index = index;
                $scope.page_state.selected_first = is_first || false;
                console.log($scope.selected_index,$scope.modify_detail)
                if(is_first){
                    $scope.page_state.show_edit = true;
                }
                else{
                    $scope.page_state.show_edit = false;
                }
            };

            var open_modal = false;
            $scope.open = function (result) {
                open_modal = false;
                $scope.modalText = {
                    pass: {
                        title: '确认通过此次修改？',
                        content: '返审审批',
                        okText: '确认',
                        cancelText: '取消'
                    },
                    reject: {
                        title: '确认拒绝此次修改？',
                        content: '返审审批',
                        okText: '确认',
                        cancelText: '取消'
                    }

                };
                $rootScope.openModal('modal-basic',
                    $scope.modalText[result].content,
                    $scope.modalText[result].title,
                    $scope.modalText[result].okText,
                    $scope.modalText[result].cancelText,
                    'send_back'
                );
                $('#modal-ok-button').click(function() {
                    $('#modal-ok-button').unbind();
                    if($('#modal-ok-button').hasClass('send_back')){
                        if(!open_modal){
                            $timeout(function () {
                                $scope.sendBack(result);
                            });
                        }
                        open_modal = true;
                    }
                });
            };

            $scope.sendBack = function(result){
                var post_data = {
                    result: result,
                    reject_reason: $scope.page_state.reject_reason
                };
                applicationsService.sendBackPromise(app_id,post_data)
                .then(function(response){
                    getModifyApp();
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',response.msg,'操作提示');
                },function(error){
                    $('#modal-basic').on('hidden.bs.modal', function () {
                        $('body').addClass('modal-open');
                    });
                    $rootScope.openModal('modal-confirm',error.data.msg,'操作提示');
                });
            };





        }
    ]
)
;
