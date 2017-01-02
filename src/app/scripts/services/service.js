(function () {
    'use strict';

    angular.module('fs-angular-content')
    .factory('contentService', function (fsApi, $q) {

        var service = {
            get: get
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

    });
})();
