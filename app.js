// Code goes here
(function() {
  //create application module
  var app = angular.module("myApp", []);

  //create main app controller
  app.controller("AppCtrl", function($scope, usersSvc, notificationService) {

    //maintain a user list (initialy blank)
    var defaultSort = 'firstName';
    $scope.users = [];
    $scope.msg = "";
    $scope.sort = defaultSort;
    $scope.reverse = false;
    $scope.selectedPageSize = 3;
    $scope.pageSizes = [1, 2, 3];
    $scope.currentPage = 1;
    $scope.pages = [1, 2, 3, 4];


    $scope.setSort = function(sort) {
      if ($scope.sort === sort) {
        $scope.reverse = !$scope.reverse;
      }
      if ($scope.sort !== undefined) {
        $scope.sort = sort;
      }
    }

    //define user CRUD operations

    //save user (create & update)
    $scope.saveUser = function(user, index) {
      if (user.editMode) {
        user.editMode = false;
        $scope.sort = defaultSort;
        usersSvc.updateUser(user, index)
          .then(function() {
            notificationService.success("User updated successfully.");
          }, function(response) {
            $scope.msg = response;
          });
      } else {
        usersSvc.createUser(user)
          .then(function() {
            notificationService.success("User created successfully.");
          }, function(response) {
            $scope.msg = response;
          });
      }
    }

    //bulk update users
    $scope.bulkUpdateUsers = function() {
      for (var i = 0; i < $scope.users.length; i++) {
        var user = $scope.users[i];
        if (user.editMode) {
          $scope.saveUser(user, i);
        }
      }
    }

    //var lastEditedUser={};
    //edit user details
    $scope.editUser = function(user) {
      //angular.extend(lastEditedUser,user);
      user.editMode = true;
      $scope.sort = undefined;
    }

    //cancel
    $scope.cancel = function(user) {
      getAllUsers();
      user.editMode = false;

      //angular.extend(user,lastEditedUser);
    }


    //delete user
    $scope.deleteUser = function(user, index) {
      $scope.users = [];
      usersSvc.deleteUser(user, index)
        .then(function(response) {
          user.editMode = false;
          refreshUsers();
          notificationService.success("User deleted successfully.");
        }, function(response) {
          $scope.msg = response;
        });
    }

    $scope.bulkDeleteUsers = function() {
      for (var i = 0; i < $scope.users.length; i++) {
        var user = $scope.users[i];
        if (user.editMode) {
          $scope.deleteUser(user, i);
        }
      }
    }

    //get all users
    function getAllUsers() {
      $scope.sort = defaultSort;
      usersSvc.retrieveAllUsers()
        .then(function(response) {
          $scope.users = angular.copy(response.data);
        }, function(response) {
          $scope.msg = response;
        });
    }


    function refreshUsers() {
      $scope.users = [];
      getAllUsers();
    }

    $scope.refreshUsers = refreshUsers;

    //fetch all users
    getAllUsers();
  });

  //start from filter
  app.filter('startFrom', function() {
    return function(input, start) {
      start = +start; //parse to int
      return input.slice(start);
    }
  });
}());