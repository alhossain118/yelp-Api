'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $state, $auth, User) {
  $scope.isAuthenticated = () => $auth.isAuthenticated();

  $scope.logout = () => {
    User.logout()
      .then(() => {
        $state.go('home');
      })
  };

  $scope.authenticate = provider => {
    User.authenticate(provider)
      .then(res => {
        $state.go('home');
      })
      .catch(err => {
        console.log('err:', err);
      })
  };
});

app.controller('loginCtrl', function($scope, $state, User) {
  $scope.login = () => {
    User.login($scope.user)
      .then(res => {
        console.log('res:', res);
        $state.go('profile');
      })
      .catch(err => {
        console.log('err:', err);
      });
  };
});

app.controller('registerCtrl', function($scope, $state, User) {
  $scope.register = () => {
    if($scope.user.password !== $scope.user.password2) {
      $scope.user.password = null;
      $scope.user.password2 = null;
      alert('Passwords must match.  Try again.');
    } else {
      User.signup($scope.user)
        .then(res => {
          console.log('res:', res);
          $state.go('login');
        })
        .catch(err => {
          console.log('err:', err);
        });
    }
  };
});

app.controller('profileCtrl', function($scope, Profile) {
  $scope.user = Profile;
});

app.controller('usersCtrl', function($scope, User, Users) {
  $scope.users = Users;

  $scope.sendMessage = user => {
    User.sendMessage(user);
  };

  $scope.$on('message', function(ev, data) {
    console.log('data:', data);
  });
});

app.controller("searchYelpCtrl", function($scope, Yelp,$state, Profile){
  console.log("searchYelpCtrl");
  var yelpBuisness;
  $scope.searchYelp = (test) => {
    console.log("stock", test.name);

    Yelp.search(test.name, test.location)
      .then(res => {
        console.log('search res', res);
        $scope.businesses = res.data.businesses;
        console.log("Businesses", $scope.businesses)
      })
  }

  $scope.goToBusinessPage = (id) => {
    console.log('business', id);

    $state.go('business.info', {businessId: id})
  }

  $scope.favorite = (business) => {
    console.log('business', business);
    $scope.savedInfo = {
      user: Profile._id,
      id: business.id
    }
    console.log($scope.savedInfo)
    Yelp.save($scope.savedInfo)
      .then(res => {
        console.log("saved");
      })

  }

  console.log("Profile", Profile)

})
app.controller('businessInfoCtrl', function($scope,$stateParams, Yelp){
  console.log('businessInfoCtrl');
  var id = $stateParams.businessId;
  console.log(id);


  Yelp.searchBusiness(id)
    .then(res => {
      console.log(res);
      $scope.businessStuff = res.data;
    })

})

app.controller('savedBusinessesCtrl', function($scope,$stateParams, Yelp, Profile){
  console.log('savedBusinessesCtrl');
  console.log("Profile",Profile);

  Yelp.getSavedBusiness(Profile._id)
    .then(res => {
      console.log("resss", res);
      $scope.savedYelpBusiness = res.data
      // Yelp.countSaved(res.data._id)
    })
$scope.removeBusiness = (business, index) => {
  console.log("business", business);
  console.log("index", index);

  Yelp.remove(business._id)
    .then(res => {
        $scope.savedYelpBusiness.splice(index,1)
    })

}


})
