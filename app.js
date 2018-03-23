var modules = [
    'common',
    'dashboard',
    'oss',
    'applications',
    'account',
    'dealer',
    'employee',
    'protoRate',
    'bank',
    'upload',
    'vehicle',
    'calculator',
    'staff',
    'department',
    'client',
    'report'
];
var third_modules = [
    'ngSanitize',
    'ui.router',
    'ngAnimate',
    'ui.bootstrap',
    'LocalStorageModule',
    '720kb.datepicker',
    'bw.paging',
    'panzoom',
    'panzoomwidget',
    'uiSwitch',
    'ui.bootstrap.datetimepicker',
    'rzModule'
    // 'ng-echarts'
];
var dependences = modules.concat(third_modules);
angular.module('wdAdmin', dependences)
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('menu', {
                url: '/menu',
                abstract: true,
                //   templateUrl: 'menu.html',
            })
            .state('menu.content', {
                url: '/content',
                abstract: true,
                views: {
                    'content@': {
                        templateUrl: 'content.html',
                        //   controller: 'wdAdmin.menuController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.login', {
                url: '/login',
                views: {
                    'login@': {
                        templateUrl: 'account/login.html',
                        controller: 'loginController'
                    }
                }
            })
            .state('menu.content.dashboard', {
                url: '/dashboard',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'dashboard/dashboard.html',
                        controller: 'dashboardController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.applications', {
                url: '/applications',
                abstract: true,
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.applications.list', {
                url: '/list',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'applications/list.html',
                        controller: 'applicationsListController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.applications.detail', {
                url: '/detail/:app_id',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'applications/detail.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.applications.detail.img_plan', {
                url: '/img_plan?tab',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/credit.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ],
                    tab: ['$stateParams', function ($stateParams) {
                        return $stateParams.tab; //By putting this here... (STEP 1)
                    }]
                }
            })
            .state('menu.content.applications.detail.plan', {
                url: '/plan',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/plan.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.applications.detail.credit', {
                url: '/credit',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/credit.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.applications.detail.yujian_credit_invest', {
                url: '/yujian_credit_invest',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/yujian_credit_invest.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.applications.detail.base_info', {
                url: '/base_info',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/base_info.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.applications.detail.mortgage', {
                url: '/mortgage',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/base_info.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.applications.detail.pickup_car', {
                url: '/pickup_car',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/base_info.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.applications.detail.home_visit', {
                url: '/home_visit',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/home_visit.html',
                        controller: 'homeVisitController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.applications.detail.home_visit_photo', {
                url: '/home_visit_photo',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/credit.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.sendBack', {
                url: '/:app_id/sendBack',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'applications/send_back.html',
                        controller: 'sendBackController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.ask', {
                url: '/ask?app_id',
                views: {
                    'table@': {
                        templateUrl: 'applications/ask.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.investigate', {
                url: '/investigate?app_id',
                views: {
                    'table@': {
                        templateUrl: 'applications/investigate.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.rate', {
                url: '/rate?app_id',
                views: {
                    'table@': {
                        templateUrl: 'applications/rate.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.register', {
                url: '/register?app_id',
                views: {
                    'table@': {
                        templateUrl: 'applications/register.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.installment', {
                url: '/installment?app_id&role',
                views: {
                    'table@': {
                        templateUrl: 'applications/installment.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.home_visit_file', {
                url: '/home_visit_file?app_id&role',
                views: {
                    'table@': {
                        templateUrl: 'applications/home_visit_file.html',
                        controller: 'homeVisitController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.loan', {
                url: '/loan?app_id',
                views: {
                    'table@': {
                        templateUrl: 'applications/loan.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.postLoan', {
                url: '/postLoan',
                abstract: true,
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.postLoan.list', {
                url: '/list',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'applications/list.html',
                        controller: 'applicationsListController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.postLoan.detail', {
                url: '/detail/:app_id',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'applications/detail.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.postLoan.detail.img_plan', {
                url: '/img_plan?tab',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/base_info.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ],
                    tab: ['$stateParams', function ($stateParams) {
                        return $stateParams.tab; //By putting this here... (STEP 1)
                    }]
                }
            })
            .state('menu.content.postLoan.detail.base_info', {
                url: '/base_info',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/base_info.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.postLoan.detail.mortgage', {
                url: '/mortgage',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/base_info.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.postLoan.detail.pickup_car', {
                url: '/pickup_car',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/base_info.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.postLoan.detail.home_visit', {
                url: '/home_visit',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/home_visit.html',
                        controller: 'homeVisitController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.postLoan.detail.home_visit_photo', {
                url: '/home_visit_photo',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/credit.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.postLoan.detail.contract_photo', {
                url: '/contract_photo',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/base_info.html',
                        controller: 'applicationsDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.postLoan.detail.post_loan', {
                url: '/post_loan',
                views: {
                    'applicationExam': {
                        templateUrl: 'applications/post_loan.html',
                        controller: 'applicationsPostLoanlController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.postLoan.update', {
                url: '/update',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'applications/batch_update.html',
                        controller: 'applicationsListController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.dealer', {
                url: '/dealer',
                abstract: true,
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.dealer.list', {
                url: '/list',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'dealer/list.html',
                        controller: 'dealerListController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.dealer.newDealer', {
                url: '/newDealer',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'dealer/new_dealer.html',
                        controller: 'newDealerController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.dealer.detail', {
                url: '/detail/:dealer_id',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'dealer/detail.html',
                        controller: 'dealerDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.dealer.newStaff', {
                url: '/newStaff',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'dealer/new_staff.html',
                        controller: 'newStaffController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.employee', {
                url: '/employee',
                abstract: true,
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.employee.list', {
                url: '/list',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'employee/list.html',
                        controller: 'employeeListController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.employee.newEmployee', {
                url: '/newEmployee',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'employee/new_employee.html',
                        controller: 'newEmployeeController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.employee.detail', {
                url: '/:employee_id?dealer_id',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'employee/detail.html',
                        controller: 'employeeDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.employee.detail.bindDealer', {
                url: '/bindDealer?ship_index',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'employee/bind_dealer.html',
                        controller: 'bindDealerDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.protoRate', {
                url: '/protoRate',
                abstract: true,
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.protoRate.list', {
                url: '/list',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'protoRate/list.html',
                        controller: 'protoRateListController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.protoRate.detail', {
                url: '/detail/:proto_rate_id',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'protoRate/detail.html',
                        controller: 'protoRateDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.bank', {
                url: '/bank',
                abstract: true,
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.bank.list', {
                url: '/list',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'bank/list.html',
                        controller: 'bankListController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.bank.detail', {
                url: '/detail/:bank_id',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'bank/detail.html',
                        controller: 'bankDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.bank.newBank', {
                url: '/newBank',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'bank/new_bank.html',
                        controller: 'newBankController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.upload', {
                url: '/upload?upload_type',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'upload/upload.html',
                        controller: 'uploadController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.vehicle', {
                url: '/vehicle',
                abstract: true,
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.vehicle.list', {
                url: '/list',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'vehicle/list.html',
                        controller: 'vehicleListController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.vehicle.detail', {
                url: '/detail/:vehicle_id',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'vehicle/detail.html',
                        controller: 'vehicleDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.vehicle.newModel', {
                url: '/newModel',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'vehicle/newModel.html',
                        controller: 'newModelController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.calculator', {
                url: '/calculator',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'calculator/calculator.html',
                        controller: 'calculatorController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.staff', {
                url: '/staff',
                abstract: true,
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.staff.list', {
                url: '/list',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'staff/list.html',
                        controller: 'staffListController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.staff.newStaff', {
                url: '/newStaff',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'staff/new_staff.html',
                        controller: 'newStaffController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.staff.detail', {
                url: '/:staff_id',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'staff/detail.html',
                        controller: 'staffDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.staff.detail.bindDepartment', {
                url: '/bindDepartment?relation_id',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'staff/bind_department.html',
                        controller: 'bindDepartmentController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.department', {
                url: '/department',
                abstract: true,
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.department.list', {
                url: '/list',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'department/list.html',
                        controller: 'departmentListController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.department.newDepartment', {
                url: '/newDepartment',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'department/new_department.html',
                        controller: 'newDepartmentController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.department.detail', {
                url: '/detail/:department_id',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'department/detail.html',
                        controller: 'departmentDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.tongdun', {
                url: '/tongdun?name&mobile&id_number',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'templates/index.html'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.client', {
                url: '/client',
                abstract: true,
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.client.list', {
                url: '/list',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'client/list.html',
                        controller: 'clientListController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            // .state('menu.content.employee.newClient', {
            //     url: '/newClient',
            //     views: {
            //         'menuContent@menu.content': {
            //             templateUrl: 'client/new_client.html',
            //             controller: 'newClientController'
            //         }
            //     },
            //     authenticate: true,
            //     resolve: {
            //         account: [
            //             'account.accountService',
            //             function(accountService) {
            //                 return accountService.getAccount();
            //             }
            //         ]
            //     }
            // })
            .state('menu.content.client.detail', {
                url: '/:client_id',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'client/detail.html',
                        controller: 'clientDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.report', {
                url: '/report',
                abstract: true,
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.report.list', {
                url: '/list',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'report/list.html',
                        controller: 'reportListController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })
            .state('menu.content.report.detail', {
                url: '/detail/:id',
                views: {
                    'menuContent@menu.content': {
                        templateUrl: 'report/detail.html',
                        controller: 'reportDetailController'
                    }
                },
                authenticate: true,
                resolve: {
                    account: [
                        'account.accountService',
                        function(accountService) {
                            return accountService.getAccount();
                        }
                    ]
                }
            })

        $urlRouterProvider.when('', '/menu/login');
        $urlRouterProvider.otherwise('/menu/login');

    })
    .config(function(localStorageServiceProvider, $httpProvider) {
        localStorageServiceProvider.setPrefix('yj');
        var interceptor = [
            '$q',
            '$location',
            'localStorageService',
            function(
                $q,
                $location,
                localStorageService
            ) {

                var defer = $q.defer();
                var service = {
                    'request': function(config) {
                        // config.headers['Access-Control-Allow-Credentials'] = true;
                        // config.headers['Access-Control-Allow-Origin'] = '*';
                        // config.headers['Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'];
                        // config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
                        // config.headers['Pragma'] = 'no-cache';
                        // config.headers['Expires'] = '0';
                        if (localStorageService.get('token')&&config.url.indexOf('oss.alpha.yusiontech.com') == -1) {
                            config.headers['Authentication'] = 'token ' + localStorageService.get('token');
                        } else {
                            delete config.headers['Authentication'];
                        }
                        // if(config.url.indexOf('aliyuncs.com') != -1){
                        //     config.headers['Content-Type'] = 'application/json';
                        // }
                        return config;
                    },
                    'responseError': function(error) {
                        var defer = $q.defer();
                        if (error.status == -1) {
                            // systemCheckService.popOnlineStatus();
                        }
                        defer.reject(error);
                        return defer.promise;
                    }
                };
                return service;
            }
        ];
        $httpProvider.interceptors.push(interceptor);

    })
    .run([
        '$http',
        '$rootScope',
        '$state',
        'localStorageService',
        function(
            $http,
            $rootScope,
            $state,
            localStorageService
        ) {


        }
    ])
    .controller('wdAdmin.menuController', [
        '$scope',
        '$rootScope',
        '$state',
        '$window',
        '$timeout',
        '$http',
        'localStorageService',
        'account.accountService',
        function(
            $scope,
            $rootScope,
            $state,
            $window,
            $timeout,
            $http,
            localStorageService,
            accountService
        ) {
            $scope.current_url = location.href;
            $rootScope.keys = function(obj) {
                if (obj) {
                    return Object.keys(obj);
                }
            };
            $rootScope.rightDecimal = function(num,x){
                if(num){
                    return (Math.round(num * x) / x).toFixed(2);
                }
                else{
                    return null;
                }
            };
            $scope.modal = {
                title: '操作提示',
                content: '',
                confirmText: '好的',
                okText: '确认',
                cancelText: '取消'
            }
            $rootScope.openModal = function(type, content, title, okText,
                cancelText, use) {
                $rootScope.modal_confirmed = false;
                $scope.modal.title = title || $scope.modal.title;
                $scope.modal.content = content || $scope.modal.title;
                $scope.modal.use = use || null;
                if (type == 'modal-confirm') {
                    jQuery('#' + type).modal('show', {
                        backdrop: 'static'
                    });
                } else if (type == 'modal-basic') {
                    $scope.modal.okText = okText || $scope.modal.okText;
                    $scope.modal.cancelText = cancelText || $scope.modal
                        .cancelText;
                    jQuery('#' + type).modal('show', {
                        backdrop: 'static'
                    });
                }
            };
            $('#modal-basic').on('hidden.bs.modal', function () {
                $scope.modal.use = null;
            });
            $('#modal-confirm').on('hidden.bs.modal', function () {
                $scope.modal.use = null;
            });

            $scope.transform = {
                rotate_deg: 0,
                zoom_level: 1
            };
            $rootScope.show_image_modal = false;
            $scope.hideImageModal = function(){
                $rootScope.show_image_modal = false;
            };

            $scope.logout = function() {
                accountService.logoutPromise()
                    .then(function(response) {
                        if (response.code == 0) {
                            localStorageService.remove('token');
                            localStorageService.remove('username');
                            delete $http.defaults.headers.common.authorization;
                            $rootScope.openModal('modal-confirm',
                                '注销成功', '操作提示', '', '',
                                'logout');
                            $('#modal-confirm-button').click(
                                function() {
                                    if ($(
                                            '#modal-confirm-button'
                                        ).hasClass('logout')) {
                                        $state.go('menu.login');
                                    }
                                });

                        } else {
                            $rootScope.openModal('modal-confirm',
                                response.msg, '操作提示');
                        }
                    });
            };

            // $rootScope.$$listeners.$stateChangeStart = [];
            $rootScope.$on('$stateChangeStart', function(event, toState,
                toParams) {
                var nextState = toState.name == 'menu.login' ?
                    'menu.content.dashboard' : toState.name;
                $scope.is_dashboard = toState.name == 'menu.content.dashboard';
                accountService.setNextState(nextState);
                accountService.setNextParams(toParams);
                if (toState.authenticate) {
                    accountService.checkUserPromise()
                        .then(function(response) {
                            if(response.code == 0){
                                localStorageService.set('has_sccount', true);
                                $scope.username = localStorageService.get('username');
                            }
                            else{
                                event.preventDefault();
                                localStorageService.remove('has_account');
                                $timeout(function() {
                                    $state.go('menu.login');
                                });
                            }
                        }, function(error) {
                            event.preventDefault();
                            localStorageService.remove(
                                'has_account');
                            $timeout(function() {
                                $state.go('menu.login');
                            });
                        });
                }
                $scope.access_list = localStorageService.get('access_list').split(',');
            });
        }
    ])
    .filter('parseint', function() {
        return function(input) {
          return parseInt(input, 10);
        };
    });
