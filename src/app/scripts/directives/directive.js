(function () {
    'use strict';

    angular.module('fs-angular-content',['fs-angular-api'])
    .directive('fsContent', function(contentService, $sce) {
        return {
            template: '<span ng-bind-html="content"></span>',
            restrict: 'E',
            scope: {
            	id: '@?fsId'
            },
            link: function ($scope) {

            	contentService.get($scope.id)
            	.then(function(content) {
            		$scope.content = $sce.trustAsHtml(content);
            	});
            }
        };
    })
    .directive('fsContentTooltip', function(contentService, $sce) {
        return {
            template: '<ng-transclude></ng-transclude><md-tooltip><span ng-bind-html="content"></span></md-tooltip>',
            restrict: 'A',
            transclude: true,
            scope: {
            	id: '@?fsContentTooltip'
            },
            link: function ($scope) {

            	contentService.get($scope.id)
            	.then(function(content) {
            		$scope.content = $sce.trustAsHtml(content);
            	});
            }
        };
    })
    .directive('fsContentModal', function(contentService, $mdDialog, $sce) {
        return {
            template: '<ng-transclude></ng-transclude>',
            restrict: 'A',
            transclude: true,
            scope: {
            	id: '@fsContentModal',
            	title: '@?fsTitle'
            },
            link: function ($scope, element) {

            	contentService.get($scope.id)
            	.then(function(content) {
            		$scope.content = $sce.trustAsHtml(content);
            	});

            	angular.element(element).on('click',function() {

					var template = '<md-dialog aria-label="Tooltip">\
					        <md-toolbar ng-show="title">\
					            <div class="md-toolbar-tools"><h2>{{title}}</h2></div>\
					        </md-toolbar>\
					        <md-dialog-content>\
					            <div class="md-dialog-content" ng-bind-html="content"></div>\
					        </md-dialog-content>\
					        <md-dialog-actions>\
					            <md-button ng-click="close()">Close</md-button>\
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
		            						content: $scope.content,
		            						title: $scope.title
		            					}
	            					});
            	});
            }
        };
    });
})();
