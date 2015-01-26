//---------------------
// Ionic App Module
//----------------------------------------------------------------------------------------------
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    initPushwoosh(); //TODO uncomment for production

    //Set the rootScope variables for persistence across controllers and nav states
    $rootScope.currentIssueJSON = JSON.parse(window.localStorage['localCurrentIssue'] || '{}');
    $rootScope.savedArticlesJSON = JSON.parse(window.localStorage['localSavedArticles'] || '[{"issueDates" : [], "displayDates" : []}]');

  });
})

.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from outer templates domain.
    'http://www.ophthalmologymanagement.com/**',
    'http://visioncare.advertserve.com/**'
  ]);
})


//---------------------
// Angular-UI Routing
//----------------------------------------------------------------------------------------------
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppMenuCtrl'
    })

    .state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/index.html",
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.saved-articles', {
      url: "/saved-articles",
      views: {
        'menuContent' :{
          templateUrl: "templates/saved-articles.html",
          controller: 'SavedArticlesCtrl'
        }
      }
    })

    .state('app.savedissue-article', {
      url: "/savedissue-article/{year}/{month}/{fileName}/{articleID}",
      views: {
        'menuContent' :{
          templateUrl: "templates/savedissue-article.html",
          controller: 'SavedIssueArticleCtrl'
        }
      }
    })

    .state('app.about', {
      url: "/about",
      views: {
        'menuContent' :{
          templateUrl: "templates/about.html"
        }
      }
    })

    .state('app.currentissue', {
      url: "/currentissue",
      views: {
        'menuContent' :{
          templateUrl: "templates/currentissue.html",
          controller: 'CurrentIssueCtrl'
        }
      }
    })

    .state('app.currentissue-article', {
      url: "/currentissue-article/{year}/{month}/{fileName}/{isDownloaded}/{articleID}",
      views: {
        'menuContent' :{
          templateUrl: "templates/currentissue-article.html",
          controller: 'CurrentIssueArticleCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

