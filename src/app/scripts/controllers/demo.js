'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($scope, fsContent) {

    $scope.text = '';

    $scope.click = function() {
    	fsContent.modal('test',{ title: 'title!!' });
    }
});
