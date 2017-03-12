'use strict';

angular.module('conFusion.services', ['ngResource'])
    //.constant("baseURL", "http://localhost:3000/")
    .constant("baseURL", "http://192.168.1.16:3000/")
    .factory('menuFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        return $resource(baseURL + 'dishes/:id', null, {
            'update': {method: 'PUT'}
        });
    }])
    .factory('promotionFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        return $resource(baseURL + 'promotions/:id', null, {
              'update': {method: 'PUT'}
        });
    }])
    .factory('corporateFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        return $resource(baseURL + 'leadership/:id', null, {
            'update': {method: 'PUT'}
        });
    }])
    .factory('favoriteFactory', ['$resource', 'baseURL', '$localStorage',
        function ($resource, baseURL, $localStorage) {
            var favFac = {};
            var favorites = $localStorage.getObject('favorites', '[]');
            
            favFac.addToFavorites = function (index) {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id === index) {
                        return;
                    }
                }
                favorites.push({id: index});
                $localStorage.storeObject('favorites', favorites);
            };
            
            favFac.getFavorites = function() {
                return favorites;
            };
            
            favFac.deleteFromFavorites = function(index) {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id === index) {
                        favorites.splice(i, 1);
                        $localStorage.storeObject('favorites', favorites);
                    }
                }
            };
            
            return favFac;
        }
    ])
    .factory('feedbackFactory', ['$resource', 'baseUrl', function ($resource, baseUrl) {
        return $resource(baseUrl + 'feedback/:id', null, {
          'save': {method: "POST"}
        });
    }])
    .factory('$localStorage', ['$window', function($window) {
        return {
            store: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            storeObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key, defaultValue) {
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        };
    }]);
