angular.module('starter.controllers', [])

//---------------------
// Controllers
//----------------------------------------------------------------------------------------------
.controller('HomeCtrl', function($scope) {
  console.log('HomeCtrl started...');

  //$scope.currentIssueLocalJSON = function(){
  //  return $rootScope.currentIssueJSON;
  //};
  //
  ////Automatically load local JSON from rootScope
  //$scope.parsedLocalJSON = $scope.currentIssueLocalJSON();

  //If the file already exists in local storage, use it
  //$scope.localJSON = function(){
  //  //Try to load from local storage on page load
  //  console.log('localJSON: Initial page load');
  //  $rootScope.localCurrentIssueJSON = JSON.parse(window.localStorage['localCurrentIssue'] || '{}');
  //};

})

.controller('CurrentIssueCtrl', function($scope, $http, $localstorage, JSONPService, $ionicLoading) {
  console.log('CurrentIssueCtrl started...');

  //Global variable for testing
  $scope.devMode = false; //TODO remove for production
      
  //If the file already exists in local storage, use it
  //$scope.localJSON = function(){
  //  //Try to load from local storage on page load
  //  $rootScope.localCurrentIssueJSON = JSON.parse(window.localStorage['localCurrentIssue'] || '{}');
  //  console.log('localJSON: Initial page load - '+JSON.stringify($rootScope.localCurrentIssueJSON));
  //
  //  //Automatically compare local JSON with server
  //  $scope.compareJSON();
  //};

  //Load JSON file from remote server and save to local storage
  $scope.getJSONP = function() {

    //HTTP Get with JSONP callback
    JSONPService.getJSONP()

        .then(function (response) {
          //Save response to local storage as a string (can't save objects)
          window.localStorage['localCurrentIssue'] = JSON.stringify(response.data);

          //Parse local storage string as JSON
          $scope.currentIssueJSON = JSON.parse(window.localStorage['localCurrentIssue'] || '{}');

          //TODO Implement cover image download
          //download the cover image
          //  $scope.download = function() {
          //    $ionicLoading.show({
          //      template: 'Loading...'
          //    });
          //
          //    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
          //          fs.root.getDirectory(
          //              "ExampleProject",
          //              {
          //                create: true
          //              },
          //              function(dirEntry) {
          //                dirEntry.getFile(
          //                    "test.png",
          //                    {
          //                      create: true,
          //                      exclusive: false
          //                    },
          //                    function gotFileEntry(fe) {
          //                      var p = fe.toURL();
          //                      fe.remove();
          //                      ft = new FileTransfer();
          //                      ft.download(
          //                          encodeURI("http://ionicframework.com/img/ionic-logo-blog.png"),
          //                          p,
          //                          function(entry) {
          //                            $ionicLoading.hide();
          //                            $scope.imgFile = entry.toURL();
          //                            alert('success!');
          //                          },
          //                          function(error) {
          //                            $ionicLoading.hide();
          //                            alert("Download Error Source -> " + error.source);
          //                          },
          //                          false,
          //                          null
          //                      );
          //                    },
          //                    function() {
          //                      $ionicLoading.hide();
          //                      console.log("Get file failed");
          //                    }
          //                );
          //              }
          //          );
          //        },
          //        function() {
          //          $ionicLoading.hide();
          //          console.log("Request for filesystem failed");
          //        });
          //    $ionicLoading.hide();
          //  };
          //
          //  $scope.download();
          //
        });

        //Download latest cover image
        //$scope.localFileInfo = {
        //    remoteFolder: 'images/cover',
        //    remoteFileName: 'cover.jpg',
        //    filePath: 'OMD/currentIssue/img',
        //    fileName: 'cover.jpg'
        //  };
        //FileService.downloadFile($scope.localFileInfo)
        //
        //.then(function (response) {
        //  console.log('dynamic cover image file successfully downloaded!');
        //  $scope.localImgFile = response;
        //});


  };

  //Get JSONP from remote server, compare date with local storage version, add download
  //button if newer
  $scope.compareJSON = function(){
    if ($scope.currentIssueJSON[0] === undefined) {
      //There is no local file, so must get remote JSONP
      console.log('compareJSON: local issueDate undefined, get remote, nothing to compare')
      //HTTP Get with JSONP callback
      JSONPService.getJSONP()

      .then(function (response) {
        //Save response to local storage as a string (can't save objects)
        console.log('compare->getJSONP: Save JSONP to local storage');
        window.localStorage['localCurrentIssue'] = JSON.stringify(response.data);

        //Parse local storage string as JSON
        $scope.currentIssueJSON = JSON.parse(window.localStorage['localCurrentIssue'] || '{}');
      });
    } else {
      //HTTP Get with JSONP callback
      JSONPService.getJSONP()

      .then(function (response) {
        //Save response to variable for comparing to local storage version
        $scope.serverLatestJSON = response.data;
        console.log('serverJSON=>'+$scope.serverLatestJSON[0].issueDate);
        console.log('localJSON=>'+$scope.currentIssueJSON[0].issueDate);

        if ($scope.currentIssueJSON[0].issueDate < $scope.serverLatestJSON[0].issueDate || $scope.devMode === true) { //TODO remove 'OR' statement for production
          //The server file is newer, update isLatest value to reveal download button
          console.log('Update isLatest to false');
          $scope.currentIssueJSON[0].isLatest = false;
        } else {
          console.log('Local JSON IS the latest, isLatest remains true');
        };
      });
    };
  };

  //Automatically load local JSON data on page load
  $scope.compareJSON();

})

.controller('CurrentIssueArticleCtrl', function($scope, $http, $stateParams, $ionicModal, $filter) {
  console.log('CurrentIssueArticleCtrl started...');

  //Pass article URL data to the ng-include for currentIssue-article.html
  $scope.articleData = $stateParams;

  //Save Article to local storage
  $scope.saveArticle = function(){
    console.log('saveArticle started...');

    ////Parse local saved articles JSON - create empty object if file doesn't exist
    //$scope.localSavedArticlesJSON = JSON.parse(window.localStorage['localSavedArticles'] || '{}');
    ////Get Current Issue metaData
    //$scope.localCurrentIssueJSON = JSON.parse(window.localStorage['localCurrentIssue'] || '{}');

    //filter localCurrentIssueJSON so only the current article content exists
    $scope.filteredArticleArray = $filter('filter')($scope.currentIssueJSON, $scope.currentIssueJSON.articleID = $scope.articleData.articleID);
    //Add current Article metaData to filtered array
    $scope.filteredArticleArray[0]["issueDate"] = $scope.currentIssueJSON[0].issueDate;
    $scope.filteredArticleArray[0]["issueMonth"] = $scope.currentIssueJSON[0].issueMonth;
    $scope.filteredArticleArray[0]["issueYear"] = $scope.currentIssueJSON[0].issueYear;
    console.log('filteredArticleArray = '+JSON.stringify($scope.filteredArticleArray));

    if ($scope.filteredArticleArray[0].articleID) {

      console.log('filtered articleID exists, value= '+$scope.articleData.articleID);
      $scope.articleData.isDownloaded = 'true';
      //push isDownloaded = true in currentIssueJSON[i] where articleID=$scope.articleData.articleID
      angular.forEach($scope.currentIssueJSON, function(u, i){
        if (u.articleID === $scope.articleData.articleID){
          console.log('articleID matches CurrentIssue, update THIS isDownloaded to true');
          //TODO save file to local storage
          //Update rootScope object
          $scope.currentIssueJSON[i].isDownloaded = true;
          //Save updated JSON file to localStorage
          window.localStorage['localCurrentIssue'] = JSON.stringify($scope.currentIssueJSON);
        }
      });

      ////Check if any article with same issueDate has already been saved - aka, issueDate exists in savedArticle issueDates
      $scope.newArticleIssueDate = true;
      console.log('$scope.savedArticlesJSON[0].issueDates.length='+$scope.savedArticlesJSON[0].issueDates.length);
      if($scope.savedArticlesJSON[0].issueDates.length > 0){
        angular.forEach($scope.savedArticlesJSON[0].issueDates, function(u, i){
          console.log('Current issueDate in saved file: '+u);
          if ($scope.currentIssueJSON[0].issueDate === u) {
            $scope.newArticleIssueDate = false;
            console.log('article issue date already exists in local saved file, no need to concat');

          };
        });
      };


      if ($scope.newArticleIssueDate) {
        console.log('First file saved with this issueDate, so add date, month, year, then add to localSaved issueDates and displayDates');

        $scope.savedArticlesJSON[0].issueDates.push($scope.currentIssueJSON[0].issueDate);
        $scope.savedArticlesJSON[0].displayDates.push($scope.currentIssueJSON[0].issueMonth+', '+$scope.currentIssueJSON[0].issueYear);

        window.localStorage['localSavedArticles'] = JSON.stringify($scope.savedArticlesJSON);
        console.log('issueDates and displayDates updated!');
      }

      $scope.newArticleID = true;
      //Check to see if article with same ID already exists in savedArticlesJSON, if not, concat array
      console.log('checking if filteredArticleArray.articleID is equal to any savedArticleIDs - current val='+JSON.stringify($scope.filteredArticleArray[0].articleID));
      if($scope.savedArticlesJSON.length > 1){
        angular.forEach($scope.savedArticlesJSON, function(u, i){
          if ($scope.filteredArticleArray[0].articleID === u.articleID) {
            $scope.newArticleID = false;
            console.log('NOT a new articleID, localSaved array: '+JSON.stringify($scope.savedArticlesJSON));
          };
        });
      }


      if ($scope.newArticleID) {
        $scope.savedArticlesJSON = $scope.savedArticlesJSON.concat($scope.filteredArticleArray);
        window.localStorage['localSavedArticles'] = JSON.stringify($scope.savedArticlesJSON);
        console.log('Locally saved Array - '+JSON.stringify($scope.savedArticlesJSON));
      }
    }
  };

  //Use this function to trigger links to open in browser
  $scope.GotoLink = function (url) {
    window.open(url,'_system');
  };

  //Popup intersticial advertisement
  $scope.interAdData = {};
  // Create the modal
  $ionicModal.fromTemplateUrl('templates/interAd-modal.html', {
    scope: $scope })
      .then(function(modal) {
        //Display the modal
        $scope.modal = modal;
        //If internet connection is available - show ad TODO confirm internet connection
        $scope.showInterAd();
      });

  // Triggered in the modal to close it
  $scope.closeInterAd = function() {
    $scope.modal.hide();
  };
  // Open the settings modal
  $scope.showInterAd = function() {
    $scope.modal.show();

  };
})

.controller('SavedArticlesCtrl', function($scope, $ionicPopup) {
  console.log('SavedArticlesCtrl started...');

  //Delete All Articles
  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete All Articles',
      template: 'Are you sure you want to delete all articles? This cannot be undone.'
    });

    confirmPopup.then(function(res) {
      if(res) {
        console.log('Confirmed, begin File deletion...');
        //delete all physical files
        //TODO add file delete service
        //change isDownloaded value for all articles in currentIssue
        angular.forEach($scope.currentIssueJSON, function(u, i){
            if (u.articleID){
              //change isDownloaded value
              $scope.currentIssueJSON[i].isDownloaded = false;
              //Save updated JSON file to localStorage
              console.log('this article: '+$scope.currentIssueJSON[i].title+' updated - isDownloaded='+$scope.currentIssueJSON[i].isDownloaded);

            }
        });
        //Update local storage with currentIssueJSON - now isDownloaded is false for all articles
        window.localStorage['localCurrentIssue'] = JSON.stringify($scope.currentIssueJSON);
        //reset localSavedArticles array
        window.localStorage['localSavedArticles'] = '[{"issueDates" : [], "displayDates" : []}]';
        $scope.localSavedArticlesJSON = JSON.parse(window.localStorage['localSavedArticles'] || '{}');
      } else {
        console.log('Cancel, do not delete');
      }
    });
  };

  //Use this function to trigger links to open in browser
  $scope.GotoLink = function (url) {
    window.open(url,'_system');
  };

})

.controller('SavedIssueArticleCtrl', function($scope, $http, $stateParams, FileService) {
  console.log('SavedIssueArticleCtrl started...');

  //Pass article URL data to the ng-include for currentIssue-article.html
  $scope.articleData = $stateParams;

      //TODO Delete Article from local storage
      $scope.deleteArticle = function(articleID) {
        angular.forEach($scope.savedArticlesJSON, function(u, i){
          if (articleID = u.articleID) {
            //deleted articleID matches THIS articleID from saved articles, remove this node from file and re-save
            $scope.savedArticlesJSON.splice(i,1);
            window.localStorage['localSavedArticles'] = JSON.stringify($scope.savedArticlesJSON);
            console.log('savedArticlesJSON after splice: '+JSON.stringify($scope.savedArticlesJSON));
          };
        });

      };

  //Use this function to trigger links to open in browser
  $scope.GotoLink = function (url) {
    window.open(url,'_system');
  };

})

.controller('SettingsCtrl', function($scope, $ionicPopup) {
  console.log('SavedIssueArticleCtrl started...');

  //Delete All Articles
  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete All Articles',
      template: 'Are you sure you want to delete all articles? This cannot be undone.'
    });

    confirmPopup.then(function(res) {
      if(res) {
        console.log('I am sure');
        //delete all physical files
        //TODO add file delete service
        //change isDownloaded value for all articles in currentIssue
        angular.forEach($scope.currentIssueJSON, function(u, i){
          if (u.articleID){
            //change isDownloaded value
            $scope.currentIssueJSON[i].isDownloaded = false;
            //Save updated JSON file to localStorage
            console.log('this article: '+$scope.currentIssueJSON[i].title+' IS no longer downloaded.');
            window.localStorage['localCurrentIssue'] = JSON.stringify($scope.currentIssueJSON);
          }
        });
        //reset localSavedArticles array
        window.localStorage['localSavedArticles'] = '[{"issueDates" : [], "displayDates" : []}]';
        $scope.savedArticlesJSON = JSON.parse(window.localStorage['localSavedArticles'] || '[{"issueDates" : [], "displayDates" : []}]');
      } else {
        console.log('Cancel, do not delete');
      }
    });
  };
})

// Feature Controllers
//--------------------------------------
.controller('AppMenuCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.settingsData = {};

  // Create the modal that we will use later
  $ionicModal.fromTemplateUrl('templates/settings.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the modal to close it
  $scope.closeSettings = function() {
    $scope.modal.hide();
  };

  // Open the settings modal
  $scope.showSettings = function() {
    $scope.modal.show();
  };

})

.controller('InterAdModalCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.interAdData = {};

  // Create the modal that we will use later
  $ionicModal.fromTemplateUrl('templates/interAd-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.showInterAd();
  });

  // Triggered in the modal to close it
  $scope.closeInterAd = function() {
    $scope.modal.hide();
  };

  // Open the settings modal
  $scope.showInterAd = function() {
    $scope.modal.show();
  };

})

.controller('ExternalLinkCtrl', function($scope) {

  $scope.GotoLink = function (url) {
    window.open(url,'_system');

    //How to use in app:
    //ng-click="GotoLink('http://ui.technotects.com/lnc/')"


    //Facebook checker
    // If Mac

    var twitterCheck = function(){

    appAvailability.check('facebook://', function(availability) {
        // availability is either true or false
        if(availability) { window.open('facebook://facebook.com/newod', '_system', 'location=no');}
        else{window.open(url, '_system', 'location=no'); };
    });
    };

    //If Android

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

    if(isAndroid) {

    twitterCheck = function(){    

    appAvailability.check('com.facebook.android', function(availability) {
        // availability is either true or false
        if(availability) {window.open('facebook://facebook.com/newod', '_system', 'location=no');}
        else{window.open(url, '_system', 'location=no');};
    });
    };
    };

  }

});