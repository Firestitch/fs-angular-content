
(function () {
    'use strict';

    angular.module('fs-angular-content',['fs-angular-api'])
    .directive('fsContent', function(fsContent, $sce) {
        return {
            template: '<span ng-bind-html="content"></span>',
            restrict: 'E',
            scope: {
            	id: '@?fsId'
            },
            link: function ($scope) {

            	fsContent.get($scope.id)
            	.then(function(content) {
            		$scope.content = $sce.trustAsHtml(content);
            	});
            }
        };
    })
    .directive('fsContentTooltip', function(fsContent, $sce) {
        return {
            template: '<ng-transclude></ng-transclude><md-tooltip><span ng-bind-html="content"></span></md-tooltip>',
            restrict: 'A',
            transclude: true,
            scope: {
            	id: '@?fsContentTooltip'
            },
            link: function ($scope) {

            	fsContent.get($scope.id)
            	.then(function(content) {
            		$scope.content = $sce.trustAsHtml(content);
            	});
            }
        };
    })
    .directive('fsContentModal', function(fsContent) {
        return {
            template: '<ng-transclude></ng-transclude>',
            restrict: 'A',
            transclude: true,
            scope: {
            	id: '@fsContentModal',
            	title: '@?fsTitle'
            },
            link: function ($scope, element) {

            	angular.element(element).on('click',function() {
            		fsContent.modal($scope.id,{ title: $scope.title });
            	});
            }
        };
    });
})();

(function () {
    'use strict';

    angular.module('fs-angular-content')
    .factory('fsContent', function (fsApi, $q, $sce, $mdDialog) {

        var service = {
            get: get,
            modal: modal
        },
        contents = {};

        return service;

        function get(id, data, options) {

            return $q(function(resolve) {

        		if(contents[id]) {
        			return resolve(contents[id]);
        		}

            	fsApi.get('contents/' + id, data, fsApi.options({ key: 'content' },options))
           		.then(function(content) {
           			contents[id] = content;
           			resolve(content)
           		});
           	});
        }

        function modal(id, options) {

        	options = options || {};

			var template = '<md-dialog aria-label="Tooltip">\
			        <md-toolbar ng-show="title">\
			            <div class="md-toolbar-tools"><h2>{{title}}</h2></div>\
			        </md-toolbar>\
			        <md-dialog-content>\
			            <div class="md-dialog-content" ng-bind-html="content"></div>\
			        </md-dialog-content>\
			        <md-dialog-actions>\
			            <md-button ng-click="close()">Done</md-button>\
			        </md-dialog-actions>\
			</md-dialog>';

			$mdDialog.show({
	    						template: template,
	    						controller: ['$scope','content','$mdDialog','title',function($scope, content, $mdDialog, title) {
	    							$scope.content = content;
	    							$scope.title = title;
	    							$scope.close = function() {
	    								$mdDialog.hide();
	    							}
	    						}],
	    						locals: {
	        						title: options.title
	        					},
	        					resolve: {
	        						content: function() {
	        							return get(id)
							        	.then(function(content) {
							        		return $sce.trustAsHtml(content);
							        	});
							        }
	        					}
	    					});
        }
    });
})();

