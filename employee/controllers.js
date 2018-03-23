employee.controller('employeeListController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    '$timeout',
    'common.commonService',
    'employee.employeeService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        $timeout,
        commonService,
        employeeService
    ) {
        $scope.page_state = {
            filters: {
                limit: 20,
            }
        };
        $scope.now = new Date().toString();
        $scope.employee_role = commonService.employee_role();

        $scope.searchEmployees = function(){
            var params = commonService.constructURLParams($scope.page_state.filters);
            console.log(params);
            employeeService.listPromise(params)
            .then(function(response){
                console.log(response);
                if(response){
                    $scope.employees = response.results;
                    $scope.page_state.count = response.count;
                }
            });
        };
        $scope.searchFirstEmployees = function(){
            $scope.page_state.current_page = 1;
            $scope.page_state.filters.offset = 0;
            $scope.searchEmployees();
        };
        $scope.searchFirstEmployees();

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
            $scope.searchEmployees();
        };

        $scope.goDetail = function(employee_id){
            $state.go('menu.content.employee.detail',{employee_id:employee_id});
        };

        var delete_employee = false;
        $scope.deleteMultipleEmployee = function(){
            delete_employee = false;
            $rootScope.openModal('modal-basic',
                '是否删除选中员工？',
                '删除员工',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!delete_employee){
                        $timeout(function(){
                            $('#modal-basic').on('hidden.bs.modal', function () {
                                $('body').addClass('modal-open');
                            });
                            angular.forEach($scope.employees,function(employee){
                                if(employee.selected){
                                    employeeService.deleteEmployeePromise(employee.id)
                                    .then(function(response){
                                        $scope.searchEmployees();
                                    },function(error){
                                        $rootScope.openModal('modal-confirm','删除员工【' + employee.name + '】失败。错误代码：' + error.status,'操作提示');
                                    });
                                }
                            });
                        });
                    }
                }
                delete_employee = true;
            });

        };

        $scope.selectAllEmployee = function(){
            angular.forEach($scope.employees,function(employee){
                employee.selected = $scope.page_state.select_all;
            });
        };
        $scope.toggleSelect = function(){
            var select_all = true;
            angular.forEach($scope.employees,function(employee){
                if(!employee.selected){
                    select_all = false;
                }
            });
            $scope.page_state.select_all = select_all;
        };

    }
])
.controller('newEmployeeController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    'common.commonService',
    'dealer.dealerService',
    'employee.employeeService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        commonService,
        dealerService,
        employeeService
    ) {
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
        // dealerService.listPromise()
        // .then(function(response))
    }
])
.controller('employeeDetailController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    '$timeout',
    '$filter',
    'common.commonService',
    'dealer.dealerService',
    'client.clientService',
    'employee.employeeService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        $timeout,
        $filter,
        commonService,
        dealerService,
        clientService,
        employeeService
    ) {
        var employee_id = $stateParams.employee_id;
        var dealer_id = $scope.dealer_id = $stateParams.dealer_id;
        $scope.employee_status = commonService.employee_status();
        $scope.employee_role = commonService.employee_role();
        $scope.post_data = {
            name: null,
            gender: null,
            birthday: null,
            id_no: null,
            mobile: null,
            email: null,
        };
        var default_state = {
            contact_filters: {
                limit: 16,
                offset: 0
            },
            sms_phone_filters: {},
            sms_message_filters: {},
            ubt_pv_count_filters:{
                st: new Date().getFullYear() + '-01',
                ed: new Date().getFullYear() + '-12',
            },
            ubt_pv_count_hour_filters:{
                st: $filter('date')(new Date(),'yyyy-MM-dd'),
                ed: $filter('date')(new Date(),'yyyy-MM-dd')
            },
            ubt_pv_list_filters:{
                st: $filter('date')(new Date(),'yyyy-MM-dd 00:00:00'),
                ed: $filter('date')(new Date(new Date().getTime() + 24*60*60*1000),'yyyy-MM-dd 00:00:00')
            },
            calendar_chart: true,
            line_chart: true,
            pv_chart: true,
            calendar_num: 50
        };
        $scope.page_state = angular.copy(default_state);
        $scope.resetFilters = function(){
            $scope.page_state.ubt_pv_count_filters = angular.copy(default_state.ubt_pv_count_filters);
            $scope.page_state.ubt_pv_count_hour_filters = angular.copy(default_state.ubt_pv_count_hour_filters);
            $scope.page_state.ubt_pv_list_filters = angular.copy(default_state.ubt_pv_list_filters);
            $scope.sms_phone_list = null;
            $scope.sms_message_list = null;
            $scope.contact_list = null;
        };
        $scope.changeTab = function(tab){
            $scope.tab = tab;
            $scope.page_state.sms_message_filters.mobile = null;
            $scope.page_state.sms_message_filters.imei = null;
            $scope.page_state.sms_message_filters.phone = null;
            if(tab == 'contact'){
                $scope.getImeiList();
            }
            else if(tab == 'message'){
                $scope.getSmsImeiList();
            }
            else if(tab == 'ubt'){
                $scope.getUbtImeiList();
            }
        };
        $scope.changeTab('basic');

        employeeService.detailPromise(employee_id)
        .then(function(response){
            console.log(response);
            if(response){
                $scope.employee = response;
                angular.forEach($scope.post_data,function(value,key){
                    $scope.post_data[key] = response[key];
                });
                var id_list = [];
                $scope.dealeremployee_list = response.dealeremployeemanageship_set;
                if(response.dealeremployeemanageship_set.length){
                    angular.forEach(response.dealeremployeemanageship_set,function(ship){
                        id_list.push(ship.dealer);
                    });
                    dealerService.listPromise('?id_in=' + id_list.toString())
                    .then(function(response){
                        if(response){
                            angular.forEach(response.results,function(dealer){
                                angular.forEach($scope.dealeremployee_list,function(ship){
                                    if(ship.dealer == dealer.id){
                                        ship.dealer_info = dealer;
                                    }
                                });
                            });
                        }
                    });
                }
            }
        });
        if(dealer_id){
            dealerService.detailPromise(dealer_id)
            .then(function(response){
                if(response.code == 0){
                    $scope.dealer = response.result;
                }
            });
        }

        $scope.updateEmployee = function(){
            employeeService.updateEmployeePromise(employee_id,$scope.post_data)
            .then(function(response){
                console.log(response);
                if(response)
                commonService.responseModal(response.status);
            },function(error){
                commonService.responseModal(error.status);
            });
        };

        var delete_employee = false;
        $scope.deleteEmployee = function(){
            delete_employee = false;
            $rootScope.openModal('modal-basic',
                '是否删除该员工？',
                '删除员工',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!delete_employee){
                        $timeout(function(){
                            $('#modal-basic').on('hidden.bs.modal', function () {
                                $('body').addClass('modal-open');
                            });
                            employeeService.deleteEmployeePromise(employee_id)
                            .then(function(response){
                                $rootScope.openModal('modal-confirm','删除成功','操作提示','','','delete-confirm');
                                $('#modal-confirm-button').click(function() {
                                    $('#modal-confirm-button').unbind();
                                    if($('#modal-confirm-button').hasClass('delete-confirm')){
                                        $state.go('menu.content.employee.list');
                                    }
                                });
                            },function(error){
                                $rootScope.openModal('modal-confirm','请求出错，错误代码：' + error.status,'操作提示');
                            });
                        });
                    }
                }
                delete_employee = true;
            });

        };

        $scope.removeFromDealer = function(){
            console.log($scope.dealer.dfim,$scope.employee.id);
            if($scope.dealer.dfim.length && $scope.dealer.dfim.indexOf($scope.employee.id) != -1){
                var new_dfim_list = $scope.dealer.dfim;
                new_dfim_list.splice($scope.dealer.dfim.indexOf($scope.employee.id),1);
                // dealerService.update
            }
        };

        // $scope.employee_current_page = 1;
        //
        // $scope.employeePageChanged = function(page) {
        //     console.log('page num:',page);
        //     if(page > 1){
        //         $scope.employee_filters.offset = 20*(page-1);
        //     }
        //     else{
        //         $scope.employee_filters.offset = 0;
        //     }
        //     $scope.searchEmployee();
        // };
        //contact
        $scope.getImeiList = function(){
            $scope.page_state.loading = true;
            clientService.clientImeiListPromise('?mobile=' + $scope.employee.mobile)
            .then(function(response){
                if(response && response.length){
                    $scope.imei_list = response;
                    $scope.changeDevice(response[0],0);
                    $scope.page_state.loading = false;
                }
            },function(error){
                $scope.page_state.loading = false;
            });
        };
        $scope.getSmsImeiList = function(){
            $scope.page_state.loading = true;
            clientService.smsImeiListPromise('?mobile=' + $scope.employee.mobile)
            .then(function(response){
                if(response && response.length){
                    $scope.message_imei_list = response;
                    $scope.changeDevice(response[0]);
                    $scope.page_state.loading = false;
                }
            },function(error){
                $scope.page_state.loading = false;
            });
        };
        $scope.getUbtImeiList = function(){
            $scope.page_state.loading = true;
            clientService.ubtImeiListPromise('?mobile=' + $scope.employee.mobile)
            .then(function(response){
                if(response && response.length){
                    $scope.ubt_imei_list = response;
                    $scope.changeDevice(response[0],0);
                    $scope.page_state.loading = false;
                }
            },function(error){
                $scope.page_state.loading = false;
            });
        };
        $scope.changeDevice = function(device,index){
            $scope.page_state.device = device;
            $scope.page_state.imei = device.imei;
            $scope.resetFilters();
            if($scope.tab == 'contact'){
                $scope.searchContact();
            }
            else if($scope.tab == 'message'){
                $scope.getSmsPhoneList();
            }
            else if($scope.tab == 'ubt'){
                $scope.ubtPvCount();
                $scope.page_state.device_index = index;
            }
        };
        $scope.searchContact = function(){
            $scope.page_state.loading = true;
            var post_data = angular.copy($scope.page_state.contact_filters);
            post_data.mobile = $scope.employee.mobile;
            post_data.imei = $scope.page_state.imei;
            clientService.clientContactListPromise(post_data)
            .then(function(response){
                console.log(response);
                $scope.page_state.contact_count = response.count;
                $scope.contact_list = response.contact_list;
                $scope.page_state.loading = false;
            },function(error){
                $scope.page_state.loading = false;
            });
        };
        $scope.page_state.contact_current_page = 1;
        $scope.page_state.contact_filters.offset = 0;
        $scope.contactPageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.page_state.contact_filters.offset = (page - 1) * 16;
            }
            else{
                $scope.page_state.contact_filters.offset = 0;
            }
            $scope.searchContact();
        };


        $scope.getSmsPhoneList = function(){
            $scope.page_state.loading = true;
            $scope.page_state.sms_phone_filters.mobile = $scope.employee.mobile;
            $scope.page_state.sms_phone_filters.imei = $scope.page_state.imei;
            var params = commonService.constructURLParams($scope.page_state.sms_phone_filters);
            clientService.smsPhoneListPromise(params)
            .then(function(response){
                if(response.length){
                    $scope.sms_phone_list = response;
                    $scope.getSmsMessageList(response[0].phone);
                }
                else{
                    $scope.sms_phone_list = null;
                    $scope.sms_message_list = null;
                }
                $scope.page_state.loading = false;
            },function(error){
                $scope.page_state.loading = false;
            });
        };
        $scope.getSmsMessageList = function(phone){
            $scope.page_state.loading = true;
            $scope.page_state.sms_message_filters.mobile = $scope.employee.mobile;
            $scope.page_state.sms_message_filters.imei = $scope.page_state.imei;
            $scope.page_state.sms_message_filters.phone = phone;
            var params = commonService.constructURLParams($scope.page_state.sms_message_filters);
            clientService.smsMsgListPromise(params)
            .then(function(response){
                $scope.sms_message_list = response;
                $scope.page_state.loading = false;
            },function(error){
                $scope.page_state.loading = false;
            });
        };

        $scope.ubtPvCount = function(){
            $scope.calendar_config = null;
            $scope.page_state.loading = true;
            $scope.page_state.ubt_pv_count_filters.mobile = $scope.employee.mobile;
            $scope.page_state.ubt_pv_count_filters.imei = $scope.page_state.imei;
            var filters = angular.copy($scope.page_state.ubt_pv_count_filters);
            if(filters.st || filters.ed){
                filters.st = filters.st || $filter('date')(new Date(),'yyyy-MM');
                filters.ed = filters.ed || $filter('date')(new Date(),'yyyy-MM');
            }
            var params = commonService.constructURLParams(filters);
            clientService.ubtPvCountPromise(params)
            .then(function(response){
                $scope.page_state.loading = false;
                var data = {
                    normal: [],
                    today:[]
                };
                function formatData(raw_data) {
                    for (var i = 0; i < raw_data.length; i ++) {
                        data.normal.push([
                            echarts.format.formatTime('yyyy-MM-dd', raw_data[i].date),
                            raw_data[i].count
                        ]);
                        var today = new Date();
                        if(new Date(raw_data[i].date).getFullYear() == today.getFullYear() &&
                            new Date(raw_data[i].date).getMonth() == today.getMonth() &&
                            new Date(raw_data[i].date).getDate() == today.getDate()){
                            data.today[0] = [
                                echarts.format.formatTime('yyyy-MM-dd', raw_data[i].date),
                                raw_data[i].count
                            ]
                        }
                    }
                    console.log(data)
                    return data;
                };

                $scope.data = formatData(response);

                $scope.page_state.calendar_num = 50;
                $scope.calendar_config = setOption($scope.data);

                $scope.showDateGraph();
            },function(error){
                $scope.page_state.loading = false;
            });
        };

        function setOption(data){
            return {
                backgroundColor: '#fff',
                title: {
                    top: 30,
                    text: '2017年用户UBT数据(行为密度)',
                    left: 'left',
                    textStyle: {
                        color: '#333'
                    }
                },
                tooltip : {
                    trigger: 'item'
                },
                legend: {
                    top: '30',
                    right: '100',
                    data:['正常','今天'],
                    textStyle: {
                        color: '#666'
                    }
                },
                calendar: {
                    top: 100,
                    left: 'center',
                    width: '92%',
                    range: [
                        $scope.page_state.ubt_pv_count_filters.st,
                        fullDay($scope.page_state.ubt_pv_count_filters.ed)
                    ],
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#DADBDD',
                            width: 3,
                            type: 'solid'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#fff',
                            borderWidth: 1,
                            borderColor: '#DADBDD'
                        }
                    },
                    yearLabel: {
                        show: false
                    },
                    dayLabel: {
                        firstDay: 1,
                        nameMap: 'cn',
                        color: '#666'
                    },
                    monthLabel: {
                        nameMap: 'cn'
                    }
                },
                series : [
                    {
                        name: '正常',
                        type: 'scatter',
                        coordinateSystem: 'calendar',
                        data: data.normal,
                        symbolSize: function (val) {
                            return val[1] / $scope.page_state.calendar_num;
                        },
                        itemStyle: {
                            normal: {
                                color: '#06B7A3'
                            }
                        }
                    },{
                        name: '今天',
                        type: 'scatter',
                        coordinateSystem: 'calendar',
                        data: data.today,
                        symbolSize: function (val) {
                            return val[1] / $scope.page_state.calendar_num;
                        },
                        itemStyle: {
                            normal: {
                                color: '#FF5657'
                            }
                        },
                        zlevel: 1
                    }
                ]
            };
        };

        $scope.$watch('page_state.calendar_num',function(new_value,old_value){
            if(new_value != old_value){
                $timeout(function(){
                    $scope.calendar_config = setOption($scope.data);
                    var myChart = echarts.init(document.getElementById('calender-chart'+$scope.page_state.device_index));
                    myChart.setOption($scope.calendar_config);
                });

            }
        });

        function fullDay(date){
            var year = date.split('-')[0];
            var month = date.split('-')[1];
            var day;
            if(month == '02'){
                if(year % 4 == 0 || year % 4 != 0 && year % 400 == 0){
                    day = '29';
                }
                else{
                    day = '28';
                }
            }
            else{
                switch (month) {
                    case '04': day = '30'
                        break;
                    case '06': day = '30'
                        break;
                    case '09': day = '30'
                        break;
                    case '11': day = '30'
                        break;
                    default: day = '31'
                        break;
                }
            }
            return date + '-' + day;
        };

        $scope.showDateGraph = function(date){
            $scope.getUbtPvList(date);
            $scope.getPvCountHours(date);
        };
        $scope.getPvCountHours = function(date){
            // $scope.page_state.loading = true;
            $scope.line_config = null;
            $scope.page_state.ubt_pv_count_hour_filters.mobile = $scope.employee.mobile;
            $scope.page_state.ubt_pv_count_hour_filters.imei = $scope.page_state.imei;
            if(date){
                $scope.page_state.ubt_pv_count_hour_filters.st = date;
                $scope.page_state.ubt_pv_count_hour_filters.ed = date;
            }
            var filters = angular.copy($scope.page_state.ubt_pv_count_hour_filters);
            filters.st = filters.st + ' 00:00:00';
            filters.ed = filters.ed + ' 23:59:59';
            if(filters.st || filters.ed){
                filters.st = filters.st || $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                filters.ed = filters.ed || $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
            }
            var params = commonService.constructURLParams(filters);
            clientService.ubtPvCountHourPromise(params)
            .then(function(response){
                // $scope.page_state.loading = false;
                console.log(response)
                var data = [];
                function formatData(raw_data) {
                    for (var i = 0; i < raw_data.length; i ++) {
                        console.log(raw_data[i])
                        data.push([
                            echarts.format.formatTime('yyyy-MM-dd hh:mm:ss', raw_data[i].date),
                            raw_data[i].count
                        ]);
                    }
                    return data;
                };
                data = formatData(response);

                $scope.line_config = {
                    title: {
                        text: '日次'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        data: data.map(function (item) {
                            return item[0];
                        })
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        }
                    },
                    toolbox: {
                        left: 'center',
                        feature: {
                            // dataZoom: {
                            //     yAxisIndex: 'none'
                            // },
                            // restore: {},
                            // saveAsImage: {}
                        }
                    },
                    dataZoom: [{
                        startValue: '2017-07-01 00:00:00'
                    }, {
                        type: 'inside'
                    }],
                    visualMap: {
                        top: 10,
                        right: 10,
                        pieces: [{
                            gt: 0,
                            lte: 50,
                            color: '#096'
                        }, {
                            gt: 50,
                            lte: 100,
                            color: '#ffde33'
                        }, {
                            gt: 100,
                            lte: 150,
                            color: '#ff9933'
                        }, {
                            gt: 150,
                            lte: 200,
                            color: '#cc0033'
                        }, {
                            gt: 200,
                            lte: 300,
                            color: '#660099'
                        }, {
                            gt: 300,
                            color: '#7e0023'
                        }],
                        outOfRange: {
                            color: '#999'
                        }
                    },
                    series: {
                        name: '日次',
                        type: 'line',
                        data: data.map(function (item) {
                            return item[1];
                        }),
                        markLine: {
                            silent: true,
                            data: [{
                                yAxis: 50
                            }, {
                                yAxis: 100
                            }, {
                                yAxis: 150
                            }, {
                                yAxis: 200
                            }, {
                                yAxis: 300
                            }]
                        }
                    }
                };
            },function(error){
                // $scope.page_state.loading = false;
            });
        };
        $scope.getUbtPvList = function(date){
            console.log(date)
            // $scope.page_state.loading = true;
            $scope.page_state.ubt_pv_list_filters.mobile = $scope.employee.mobile;
            $scope.page_state.ubt_pv_list_filters.imei = $scope.page_state.imei;
            if(date){
                $scope.page_state.ubt_pv_list_filters.st = $filter('date')(new Date(date),'yyyy-MM-dd 00:00:00');
                $scope.page_state.ubt_pv_list_filters.ed = $filter('date')(new Date(new Date(date).getTime() + 24*60*60*1000),'yyyy-MM-dd 00:00:00');
            }
            var filters = angular.copy($scope.page_state.ubt_pv_list_filters);
            if(filters.st || filters.ed){
                filters.st = filters.st || $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                filters.ed = filters.ed || $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
            }
            var params = commonService.constructURLParams(filters);
            clientService.ubtPvListPromise(params)
            .then(function(response){
                $scope.ubt_pv_list = response;
                // $scope.page_state.loading = false;
            },function(error){
                // $scope.page_state.loading = false;
            });
        };

    }
])
.controller('bindDealerDetailController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    '$timeout',
    'common.commonService',
    'dealer.dealerService',
    'employee.employeeService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        $timeout,
        commonService,
        dealerService,
        employeeService
    ) {
        var employee_id = $scope.employee_id = $stateParams.employee_id;
        var ship_index = $stateParams.ship_index;
        $scope.employee_status = commonService.employee_status();
        $scope.employee_role = commonService.employee_role();
        $scope.dealer_role = commonService.dealer_role();
        $scope.dealer_employee_relation = {};
        $scope.page_state = {
            filters: {
                limit: 5,
                ordering: '',
            }
        };

        employeeService.detailPromise(employee_id)
        .then(function(response){
            if(response){
                $scope.employee = response;
                if(ship_index || ship_index === 0){
                    $scope.dealer_employee_relation = response.dealeremployeemanageship_set[ship_index];
                    dealerService.detailPromise($scope.dealer_employee_relation.dealer)
                    .then(function(response){
                        $scope.dealer_employee_relation.dealer_info = response;
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
                    $scope.page_state.count = response.count;
                }
            });
        };

        $scope.selectDealer = function(index,dealer_id){
            $scope.dealer_employee_relation.dealer = dealer_id;
            $scope.dealer_employee_relation.dealer_info = $scope.dealers[index];
            $scope.dealer_employee_relation.role = 'S';
            $scope.dealer_employee_relation.status = 'A';
        };

        $scope.saveRelation = function(){
            var post_data = {
                dealer: $scope.dealer_employee_relation.dealer,
                employee: employee_id,
                status: $scope.dealer_employee_relation.status,
                role: $scope.dealer_employee_relation.role
            };
            if($scope.dealer_employee_relation.id){
                dealerService.updateDealerEmployeeRelationPromise($scope.dealer_employee_relation.id,post_data)
                .then(function(response){
                    console.log(response);
                    if(response){
                        commonService.responseModal(200);
                    }
                },function(error){
                    commonService.responseModal(error.status);
                });
            }
            else{
                dealerService.createDealerEmployeeRelationPromise(post_data)
                .then(function(response){
                    console.log(response);
                    if(response){
                        var dealer_info = $scope.dealer_employee_relation.dealer_info;
                        $scope.dealer_employee_relation = response;
                        $scope.dealer_employee_relation.dealer_info = dealer_info;
                        commonService.responseModal(201);
                    }
                },function(error){
                    commonService.responseModal(error.status,error.data);
                });
            }

        };

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
;
