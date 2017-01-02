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
