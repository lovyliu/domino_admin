var applications = angular.module('applications',
    [
        'api',
    ]
);

applications.service('applications.applicationsService',
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
                var url = api.applications.list() + params;
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.detailPromise = function(id){
                var defer = $q.defer();
                var url = api.applications.detail(id);
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.ownApplicationPromise = function(id){
                var defer = $q.defer();
                var url = api.applications.own_application(id);
                $http.put(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.postLoanOwnApplicationPromise = function(id){
                var defer = $q.defer();
                var url = api.applications.post_loan_own_application(id);
                $http.put(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.cancelApplicationPromise = function(app_id){
                var defer = $q.defer();
                var url = api.applications.cancel(app_id);
                $http.put(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.dragBackApplicationPromise = function(app_id){
                var defer = $q.defer();
                var url = api.applications.drag_back(app_id);
                $http.put(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.updateApplicationPromise = function(app_id,data){
                var defer = $q.defer();
                var url = api.applications.detail(app_id);
                $http.patch(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            var application = {};
            this.setApplication = function(application){
                application = application;
            };
            this.getApplication = function(){
                return application;
            };
            this.updatePlanPromise = function(app_id,data){
                var defer = $q.defer();
                var url = api.applications.plan(app_id);
                $http.post(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getUwCreditPromise = function(credit_id){
                var defer = $q.defer();
                var url = api.applications.uw_credit(credit_id);
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.updateUwCreditPromise = function(app_id,credit_id,data){
                var defer = $q.defer();
                var url = api.applications.update_uw_credit(app_id,credit_id);
                $http.put(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getImgPlanPromise = function(plan_id){
                var defer = $q.defer();
                var url = api.applications.img_plan(plan_id);
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.updateCheckerPromise = function(app_id,checker_id,data){
                var defer = $q.defer();
                var url = api.applications.update_img_plan_checker(app_id,checker_id);
                $http.put(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.updateImgPlanPromise = function(app_id,category,data){
                var defer = $q.defer();
                var url = api.applications.update_img_plan(app_id,category);
                $http.put(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.downloadImgPlanPromise = function(app_id,category){
                var defer = $q.defer();
                var url = api.applications.download_img_plan(app_id,category);
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getEmailListPromise = function(app_id){
                var defer = $q.defer();
                var url = api.applications.send_email(app_id);
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.sendEmailPromise = function(app_id,params){
                var defer = $q.defer();
                var url = api.applications.send_email(app_id) + params || '';
                $http.post(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.rigitCommentsPromise = function(params){
                var defer = $q.defer();
                var url = api.applications.rigid_comments() + params || '';
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.choiceConfigPromise = function(params){
                var defer = $q.defer();
                var url = api.applications.choice_config() + params || '';
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.yuncheLoanPromise = function(app_id){
                var defer = $q.defer();
                var url = api.applications.loan(app_id);
                $http.post(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.queryCreditPromise = function(app_id){
                var defer = $q.defer();
                var url = api.applications.query_credit(app_id);
                $http.post(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getLogPromise = function(app_id){
                var defer = $q.defer();
                var url = api.applications.log(app_id);
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getPostLoan = function(app_id){
                var defer = $q.defer();
                var url = api.applications.post_loan(app_id);
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.createExpressPromise = function(app_id,category,where_from,where_to,data){
                var defer = $q.defer();
                var url = api.applications.create_express(app_id,category,where_from,where_to);
                $http.post(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.updateExpressPromise = function(app_id,category,where_from,where_to,express_number,data){
                var defer = $q.defer();
                var url = api.applications.update_express(app_id,category,where_from,where_to,express_number);
                $http.put(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.uploadExpressImgPromise = function(express_number,label,data){
                var defer = $q.defer();
                var url = api.applications.uploadExpressImg(express_number,label);
                $http.put(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.deleteExpressImgPromise = function(express_number,label){
                var defer = $q.defer();
                var url = api.applications.uploadExpressImg(express_number,label);
                $http.delete(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getExpressPromise = function(express_number){
                var defer = $q.defer();
                var url = api.applications.get_express(express_number);
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.resetProjectPromise = function(app_id,category,where_from,where_to,data){
                var defer = $q.defer();
                var url = api.applications.reset_project(app_id,category,where_from,where_to);
                $http.put(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getPostLoanInputValuesPromise = function(app_id){
                var defer = $q.defer();
                var url = api.applications.post_loan_input_values(app_id);
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.updatePostLoanInputValuesPromise = function(app_id,data){
                var defer = $q.defer();
                var url = api.applications.post_loan_input_values(app_id);
                $http.put(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getNotePromise = function(app_id){
                var defer = $q.defer();
                var url = api.applications.note(app_id);
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.updatetNotePromise = function(id,data){
                var defer = $q.defer();
                var url = api.applications.update_note(id);
                $http.put(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.createtNotePromise = function(data){
                var defer = $q.defer();
                var url = api.applications.create_note();
                $http.post(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getModifyAppDetailPromise = function(app_id){
                var defer = $q.defer();
                var url = api.applications.modify_app_detail(app_id);
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.sendBackPromise = function(app_id,data){
                var defer = $q.defer();
                var url = api.applications.send_back(app_id);
                $http.post(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getUpadateFieldsPromise = function(){
                var defer = $q.defer();
                var url = api.applications.batch_update();
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.batchUpadatePromise = function(data){
                var defer = $q.defer();
                var url = api.applications.batch_update();
                $http.put(url,data)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
        }
    ]
);
