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
    });
})();
