angular.module('conFusion.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
  
    // Form data for the login modal
    $scope.loginData = {};
  
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
  
    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };
  
    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };
  
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);
  
      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
          $scope.closeLogin();
      }, 1000);
    };

    // Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.reserveForm = modal;
    });
  
    // Triggered in the login modal to close it
    $scope.closeReserve = function() {
      $scope.reserveForm.hide();
    };
  
    // Open the reserve modal
    $scope.reserve = function() {
      $scope.reserveForm.show();
    };
  
    // Perform the reserve action when the user submits the reserve form
    $scope.doReserve = function() {
      console.log('Doing reserve', $scope.reserveData);
  
      // Simulate a reserve delay. Remove this and replace with your reserve
      // code if using a reserve system
      $timeout(function() {
          $scope.closeReserve();
      }, 1000);
    };
  })

  .controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate',
      function($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate) {
          $scope.baseURL = baseURL;
          $scope.tab = 1;
          $scope.filtText = '';
          $scope.showDetails = false;
          $scope.showMenu = false;
          $scope.message = "Loading ...";
          menuFactory.getDishes().query(
            function (response) {
              $scope.dishes = response;
              $scope.showMenu = true;
            },
            function (response) {
              $scope.message = "Error: " + response.status + " " + response.statusText;
            });
          $scope.select = function (setTab) {
            $scope.tab = setTab;
            if (setTab === 2) {
              $scope.filtText = "appetizer";
            } else if (setTab === 3) {
              $scope.filtText = "mains";
            } else if (setTab === 4) {
              $scope.filtText = "dessert";
            } else {
              $scope.filtText = "";
            }
          };
          $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
          };
          $scope.toggleDetails = function () {
            $scope.showDetails = !$scope.showDetails;
          };
          $scope.addFavorite = function (index) {
            console.log('index is ' + index);
            favoriteFactory.addToFavorites(index);
            $ionicListDelegate.closeOptionButtons();
          };
      }
  ])
  
  .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal',
      function($scope, $stateParams, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal) {
      var self = $scope;
          var template = '';
          $scope.baseURL = baseURL;
          $scope.dish = {};
          $scope.showDish = false;
          $scope.message="Loading ...";
          $scope.dish = menuFactory.getDishes().get({id: parseInt($stateParams.id, 10)})
              .$promise.then(
                  function(response){
                      $scope.dish = response;
                      $scope.showDish = true;
                  },
                  function(response) {
                      $scope.message = "Error: "+response.status + " " + response.statusText;
                  }
              );
          $scope.addFavorite = function () {
              favoriteFactory.addToFavorites($scope.dish.id);
          };
          $scope.addComment = function () {
              favoriteFactory.addToFavorites($scope.dish.id);
          };
        
          $ionicPopover.fromTemplateUrl('../templates/dish-detail-popover.html', {
              scope: $scope
          }).then(function(popover) {
              $scope.popover = popover;
          });
          $scope.openPopover = function($event) {
              $scope.popover.show($event);
          };
          $scope.closePopover = function($event) {
              $scope.popover.hide($event);
          };
  
          $ionicModal.fromTemplateUrl('../templates/dish-comment.html', {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function(modal) {
              $scope.modal = modal;
          });
          $scope.openModal = function() {
              $scope.modal.show();
          };
          $scope.closeModal = function() {
              $scope.modal.hide();
          };
          // Cleanup the modal when we're done with it!
          $scope.$on('$destroy', function() {
              $scope.modal.remove();
          });
  }])

  .controller('DishCommentController', ['$scope', 'menuFactory',
      function($scope, menuFactory) {
          $scope.mycomment = {
              rating: 5,
              comment: "",
              author: "",
              date: ""
          };
          $scope.submitComment = function () {
              $scope.mycomment.date = new Date().toISOString();
              console.log($scope.mycomment);
              $scope.dish.comments.push($scope.mycomment);
              console.log('comments: ', $scope.dish.comments);
              menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);
              $scope.commentForm.$setPristine();
              $scope.mycomment = {
                  rating: 5,
                  comment: "",
                  author: "",
                  date: ""
              };
          }
      }
  ])

  .controller('IndexController', ['$scope', '$stateParams', 'menuFactory', 'corporateFactory',
    function($scope, $stateParams, menuFactory, corporateFactory) {
      //$scope.showDish = false;
      $scope.message = "Loading...";
      console.log('dish',  menuFactory.getDishes().get({id: 0}));
      menuFactory.getDishes().get({id: 0})
        .$promise.then(
        function(response) {
          $scope.dish = response;
         //menuFactory.getDishes().get({id: 0}) $scope.showDish = true;
        },
        function(response) {
          $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
        }
      );
      menuFactory.getPromotions().get({id: 0})
        .$promise.then(
        function(response) {
          $scope.promotion = response;
        },
        function(response) {
          $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
        }
      );
      corporateFactory.getLeaders().get({id: 3})
        .$promise.then(
        function(response) {
          $scope.leader = response;
        },
        function(response) {
          $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
        }
      );
    }
  ])

  .controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function($scope, corporateFactory, baseURL) {
      $scope.baseURL = baseURL;
      corporateFactory.getLeaders().query(
          function(response) {
              $scope.leaders = response;
          },
          function(response) {
              $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
          }
      );
  }])

  .controller('FavoritesController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout',
      function($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {
          $scope.baseURL = baseURL;
          $scope.shouldShowDelete = false;
          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Loading...'
          })
          $scope.favorites = favoriteFactory.getFavorites();
          $scope.dishes = menuFactory.getDishes().query(
              function (response) {
                  $scope.dishes = response;
                  $timeout(function() {
                      $ionicLoading.hide();
                  }, 1000);
                  $scope.showMenu = true;
              },
              function (response) {
                  $scope.message = "Error: " + response.status + " " + response.statusText;
                  $timeout(function() {
                    $ionicLoading.hide();
                  }, 1000);
              }
          );
          console.log($scope.dishes, $scope.favorites);
          $scope.toggleDelete = function() {
              $scope.shouldShowDelete  = !$scope.shouldShowDelete;
              console.log($scope.shouldShowDelete);
          }
          $scope.deleteFavorite = function(index) {
              var confirmPopup = $ionicPopup.confirm({
                  title: 'Confirm Delete',
                  template: 'Are you sure you want to delete this item?'
              });
              confirmPopup.then(function(res) {
                  if (res) {
                      console.log('OK to delete');
                      favoriteFactory.deleteFromFavorites(index);
                  }
                  $scope.shouldShowDelete = false;
              })
              favoriteFactory.deleteFromFavorites(index);
              $scope.shouldShowDelete = false;
          }
      }
    ])

  .filter('favoriteFilter', function() {
      return function(dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
          for (var j = 0; j < dishes.length; j++) {
              if (dishes[j].id === favorites[i].id) {
                out.push(dishes[j]);
              }
          }
        }
        return out;
      }
  });
