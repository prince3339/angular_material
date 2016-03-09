//angular initialization
var myApp = angular.module('BlankApp', ['ngMaterial','ngRoute'])
   .run(function(){
       console.log("Running");
});

//Routing
 myApp.config(function($routeProvider) {
 	$routeProvider
    .when("/", {
 			templateUrl: "partials/home.html",
 			controller: "AppCtrl"
 		})
// 	.otherwise({
// 		redirectTo: "/"
// 	});
 });


//Defining theme
myApp.config(function($mdThemingProvider) {
  var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});


//Controllers
myApp.controller('AppCtrl', studentProfile);
myApp.controller('GreetingController', GreetingController);
myApp.controller('registrationController', registrationController);


//services to provide student info on click 
myApp.service("addStudentDetails", function() {
    var students = [];
	
	return {
        
        getInfo: function() {
			return students;
		},
		addInfo: function(info) {
            //students = [];
            students.push(info);
            students = [];
            var studentsInformation = info; 
            //return studentsInformation;
            console.log(studentsInformation);
            return studentsInformation;
		}
	}
     
});

//services to provide student list
myApp.factory("studentList", function($mdToast) {
    var imagePath = '../assets/60.jpeg';
    
    var studentsDetails = [
      {
        face : imagePath,
        name: 'Sabbir',
        age: 20,
        class: 'Bsc',
        section: "C",
        roll: " 11.01.04.148",
        date_of_birth: " 13/03/1991",
      },
      {
        face : imagePath,
        name: 'Prince',
        age: 20,
        class: 'Bsc',
        section: "C",
        roll: " 11.01.04.145",
        date_of_birth: " 13/03/1991",
      },
      {
        face : imagePath,
        name: 'Dipon',
        age: 20,
        class: 'Bsc',
        section: "C",
        roll: "112",
        date_of_birth: " 13/03/1991",
      },{
        face : imagePath,
        name: 'Rana',
        age: 20,
        class: 'Bsc',
        section: "C",
        roll: " 300 ",
        date_of_birth: " 13/03/1991",
      },
      {
        face : imagePath,
        name: 'Sabbir',
        age: 20,
        class: 'Bsc',
        section: "C",
        roll: "200",
        date_of_birth: " 13/03/1991",
      },
      {
        face : imagePath,
        name: 'Tandra',
        age: 20,
        class: 'Bsc',
        section: "C",
        roll: " 110",
        date_of_birth: " 13/03/1991",
      },
      
    ];
  
    return {
		getDetails: function() {
			return studentsDetails;
		},
        
        removeStudent: function(info) {
            var index = studentsDetails.indexOf(info);
            studentsDetails.splice(index, 1);
            
            $mdToast.show($mdToast.simple().textContent('Info Deleted!'));
        },
        
        registerStudent: function(user) {
            studentsDetails.push(user);
            console.log("Inserted");
        }
	}
});

//student list, info getting and delivering 
function studentProfile($scope, $mdMedia, $mdDialog, studentList, addStudentDetails) {
    var alert;
  
    $scope.studentInformation = {};
    
    $scope.addInfo = function(info) {
		 
        $scope.studentInformation = info;
        //console.log($scope.studentInformation);
        //return studentInformation;
	}
    
     
    $scope.getInfo = addStudentDetails.getInfo();
    
    $scope.studentsDetails = studentList.getDetails();
    
    $scope.showGreeting = showCustomGreeting;
    
    $scope.addForm = showForm;
    
    $scope.onSwipeLeft = function(info) {
        studentList.removeStudent(info);
        console.log("Hello");
    };

    // Dialog #1 - Show simple alert dialog and cache
    // reference to dialog instance
    function showCustomGreeting($event) {
        $mdDialog.show({
          targetEvent: $event,
          templateUrl: 'partials/dialog.html',
          controller: 'GreetingController',
          onComplete: afterShowAnimation,
          clickOutsideToClose:true,
          //locals: { student: $scope.getInfo },
          resolve:{
              allData: function(){
                return $scope.studentInformation;      
              }
          }     
        });

        // When the 'enter' animation finishes...

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }
    
    
    function showForm($event) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
            targetEvent: $event,
            templateUrl: 'partials/addForm.html',
            controller: 'registrationController',
            onComplete: afterShowAnimation,
            parent: angular.element(document.body),
            clickOutsideToClose:true,
            fullscreen: useFullScreen
            //locals: { addStudent: $scope.addNewStudent }
        });
        
        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });

        // When the 'enter' animation finishes...

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }
      
}

//get info and provide to show student info on click
function GreetingController($scope, $mdDialog, allData) {
    // Assigned from construction <code>locals</code> options...
    console.log( allData.name);
    $scope.studentName = allData.name;
    $scope.class = allData.class;
    $scope.roll = allData.roll;
    $scope.age = allData.age;
    $scope.section = allData.section;
    $scope.date_of_birth = allData.date_of_birth;
    
    $scope.cancel = function () {
        $mdDialog.hide();    
    }
    
    $scope.closeDialog = function() {
      // Easily hides most recent dialog shown...
      // no specific instance reference is needed.
      $mdDialog.hide();
    };
}

//register new student
function registrationController($scope, $mdDialog, studentList) {
    // Assigned from construction <code>locals</code> options...
    $scope.student = studentList.getDetails();
    $scope.user = {};
    
    $scope.selectedItemChange = function (student){
        if(student)
            $scope.user.class = student.class;
    };
  
    $scope.saveValue = function(user) {
      studentList.registerStudent(user);
      console.log("TESTING");
      
      $mdDialog.hide();
    }

    $scope.closeDialog = function() {
      // Easily hides most recent dialog shown...
      // no specific instance reference is needed.
      $mdDialog.hide();
    };
}


