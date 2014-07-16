angular.module('LocalStorageModule', [
  'ngCookies',
])

.service('LocalStorageEmulator', ['$cookies', function($cookies){
  return {
    setItem:function(key, value){
      $cookies[key] = value;
    },
    getItem:function(key){
      return $cookies[key] ? $cookies[key] : null;
    }
  }
}])

/*
    Local Storage
    get/set localstorage data
*/
.service('LocalStorage', ['LocalStorageEmulator', function(LocalStorageEmulator){
  var testKey = 'test',
    storage = window.localStorage;
  try {
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
  } catch (e) {
    storage = LocalStorageEmulator;
  }

  return {
    set:function(key, value){
      storage.setItem(key, JSON.stringify(value));
    },
    get:function(key){
      var value = storage.getItem(key);
      try {
        value = JSON.parse(value);
      } catch(e){
        value = null;
      }
      return value;
    }
  }
}])
