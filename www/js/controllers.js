angular.module('conFusion.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {
  
      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});
    
      // Form data for the login modal
      $scope.loginData = $localStorage.getObject('userinfo', '{}');
      $scope.reservation = {};
      $scope.registration = {};
    
      // Create the registration modal that we will use later
      $ionicModal.fromTemplateUrl('templates/register.html', {
          scope: $scope
      }).then(function (modal) {
          $scope.registerform = modal;
      });
    
      // Triggered in the registration modal to close it
      $scope.closeRegister = function () {
          $scope.registerform.hide();
      };
    
      // Open the registration modal
      $scope.register = function () {
          $scope.registerform.show();
      };
  
      $ionicPlatform.ready(function () {
          var options = {
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 100,
              targetHeight: 100,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false
          };
          $scope.takePicture = function () {
              $cordovaCamera.getPicture(options)
              .then(
                  function (imageData) {
                      $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
                  },
                  function (err) {
                      console.log(err);
                  }
              );
              $scope.registerform.show();
          };
  
          $scope.choosePicture = function () {
              var options = {
                  maximumImagesCount: 1,
                  width: 100,
                  height: 100,
                  quality: 50
              };
              $cordovaImagePicker.getPictures(options)
              .then(
                  function (results) {
                      var img = [];
                      for (var i = 0; i < results.length; i++) {
                          window.plugins.Base64.encodeFile(results[i], function (imageData) {
                              $scope.registration.imgSrc = imageData;
                              img.push(imageData);
                          });
                          $scope.registration.imgSrc.push(imageData);
                          $scope.registerform.show();
                      }
                  },
                  function (err) {
                      console.log('err: ' + err);
                  }
              );
          };
      });
  
      // Perform the registration action when the user submits the registration form
      $scope.doRegister = function () {
          //console.log('Doing reservation', $scope.reservation);
          // Simulate a registration delay. Remove this and replace with your registration
          // code if using a registration system
          $timeout(function () {
              $scope.closeRegister();
          }, 1000);
      };
  
      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
      });
    
      // Triggered in the login modal to close it
      $scope.closeLogin = function () {
        $scope.modal.hide();
      };
    
      // Open the login modal
      $scope.login = function () {
        $scope.modal.show();
      };
    
      // Perform the login action when the user submits the login form
      $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo', $scope.loginData);
      
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
          $scope.closeLogin();
        }, 1000);
      };
  
      // Create the reserve modal that we will use later
      $ionicModal.fromTemplateUrl('templates/reserve.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.reserveForm = modal;
      });
    
      // Triggered in the login modal to close it
      $scope.closeReserve = function () {
        $scope.reserveForm.hide();
      };
    
      // Open the reserve modal
      $scope.reserve = function () {
        $scope.reserveForm.show();
      };
    
      // Perform the reserve action when the user submits the reserve form
      /*$scope.doReserve = function() {
       console.log('Doing reserve', $scope.reserveData);
     
       // Simulate a reserve delay. Remove this and replace with your reserve
       // code if using a reserve system
       $timeout(function() {
       $scope.closeReserve();
       }, 1000);
       };*/
  })

  .controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate',
      '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
      function($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
          $scope.baseURL = baseURL;
          $scope.tab = 1;
          $scope.filtText = '';
          $scope.showDetails = false;
          $scope.dishes = dishes;
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
              $ionicPlatform.ready(function() {
                  $cordovaLocalNotification.schedule({
                      id: 1,
                      title: "Added Favorite",
                      text: $scope.dishes[index].name
                  })
                  .then(
                      function() {
                          console.log('Added Favorite' + $scope.dishes[index].name);
                      },
                      function() {
                          console.log('Failed to add Favorite');
                      }
                  );
                  $cordovaToast
                      .show('Added Favorite ' + $scope.dishes[index].name, 'long', 'center')
                      .then(
                          function(success) {
                              //succcess
                          }, function(error) {
                              //error
                          }
                      );
              });
          };
      }
  ])
  
  .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
      function($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
          $scope.baseURL = baseURL;
          $scope.dish = dish;
          
          $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {scope: $scope})
          .then(function (popover) {
              $scope.popover = popover;
          });
          $scope.addFavorite = function () {
              favoriteFactory.addToFavorites($scope.dish.id);
              $scope.closePopover();
              $ionicPlatform.ready(function() {
                  $cordovaLocalNotification.schedule({
                      id: $scope.dish.id,
                      title: "Added Favorite",
                      text: $scope.dish.name
                  })
                  .then(
                      function() {
                          console.log('Added Favorite' + $scope.dish.name);
                      },
                      function() {
                          console.log('Failed to add Favorite');
                      }
                  );
                  $cordovaToast
                      .show('Added Favorite ' + $scope.dish.name, 'long', 'center')
                      .then(
                          function(success) {
                              //succcess
                          },
                          function(error) {
                              //error
                          }
                      );
              });
          };
          $scope.openPopover = function ($event) {
              $scope.popover.show($event);
          };
          $scope.closePopover = function() {
              $scope.popover.hide();
          };
          $scope.$on('$destroy', function() {
              $scope.popover.remove();
          });
          $scope.$on('popover.hidden', function() {
              // Execute action
          });
          $scope.$on('popover.removed', function() {
              // Execute action
          });
  
          $scope.addComment = function () {
              favoriteFactory.addComment($scope.dish.id);
              $scope.closePopover();
          };
  
          $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
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
      }
  ])

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
              menuFactory.update({id: $scope.dish.id}, $scope.dish);
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

  .controller('IndexController', ['$scope', 'dish', 'promotion', 'leader', 'baseURL',
      function($scope, dish, promotion, leader, baseURL) {
          $scope.baseURL = baseURL;
          $scope.dish = dish;
          $scope.promotion = promotion;
          $scope.leader = leader;
      }
  ])

  .controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL) {
      $scope.baseURL = baseURL;
      $scope.leaders = leaders;
  }])

  .controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaVibration',
      function($scope, dishes, favorites, favoriteFactory, baseURL, $ionicPopup, $ionicLoading,  $timeout, $cordovaVibration) {
          $scope.baseURL = baseURL;
          $scope.shouldShowDelete = false;
          $scope.favorites = favorites;
          $scope.dishes = dishes;
          
          console.log($scope.dishes, $scope.favorites);
          $scope.toggleDelete = function() {
              $scope.shouldShowDelete  = !$scope.shouldShowDelete;
              console.log($scope.shouldShowDelete);
          };
          $scope.deleteFavorite = function(index) {
              var confirmPopup = $ionicPopup.confirm({
                  title: 'Confirm Delete',
                  template: 'Are you sure you want to delete this item?'
              });
              confirmPopup.then(function(res) {
                  if (res) {
                      console.log('OK to delete');
                      favoriteFactory.deleteFromFavorites(index);
                      $ionicPlatform.ready(function() {
                          $cordovaVibration.vibrate(100);
                      });
                  } else {
                    console.log('Canceled delete');
                  }
                  $scope.shouldShowDelete = false;
              })
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
