'use strict';

var app = angular.module('myApp');

app.factory('socket', function(socketFactory) {
  return socketFactory();
});

app.service('User', function($http, $auth, $q, $rootScope, socket) {
  this.setCurrent = data => {
    return this.clearCurrent()
      .then(this.getProfile)
      .then(profile => {
        $rootScope.currentUser = profile;
        let currentId = $rootScope.currentUser._id

        socket.on(`message:${currentId}`, function(data) {
          $rootScope.$broadcast('message', data);
        });

        return $q.resolve(data);
      });
  };

  this.clearCurrent = data => {
    if($rootScope.currentUser) {
      let currentId = $rootScope.currentUser._id
      socket.removeAllListeners(`message:${currentId}`);
    }
    $rootScope.currentUser = null;
    return $q.resolve(data);
  };

  this.getProfile = () => {
    return $http.get('/api/users/profile')
      .then(res => {
        return $q.resolve(res.data);
      });
  };

  this.getAll = () => {
    return $http.get('/api/users')
      .then(res => $q.resolve(res.data));
  };

  this.logout = () => {
    return $auth.logout()
      .then(this.clearCurrent);
  };

  this.authenticate = provider => {
    return $auth.authenticate(provider)
      .then(this.setCurrent);
  };

  this.login = user => {
    return $auth.login(user)
      .then(this.setCurrent);
  };

  this.signup = user => {
    return $auth.signup(user);
  };

  this.sendMessage = user => {
    socket.emit('message', {
      _id: user._id,
      text: 'hi!'
    })
  };
});
app.service('Yelp', function($http){
  this.search = (term,location) => {
    console.log('hit');
    return $http.get(`/api/yelps/search/${term}/${location}`)
  }
  this.searchBusiness = id => {
    console.log('hit2');
    return $http.get(`/api/yelps/business/${id}`)
  }
  this.save = savedInfo => {
    return $http.post(`api/yelps`, savedInfo)
  }
  this.getSavedBusiness = (id) => {
    console.log('hit');
    return $http.get(`api/yelps/users/${id}`)
  }
  this.remove = (id) => {
    return $http.delete(`/api/yelps/${id}`)
  }
  // this.countSaved(id) => {
  //   return $http.get(`/api/yelps/totals/${id}`)
  // }
})
