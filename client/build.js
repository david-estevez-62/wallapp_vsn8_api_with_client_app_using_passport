   // retrieves initial background images from backend and whether authenticated
	 var app = angular.module("myModule", [])
    					 .controller("initController", ["$scope", "$http", function($scope, $http){

                  this.loginHidden = true;

                  var vm = this;


                  $http.get(api.baseUrl + "bootstrapclient")
      							 .then(function (response) {
      							 	vm.usr = response.data.user;
                      $scope.usr = response.data.user;
      							 	vm.imgs = response.data.imgs;
      							 });



    						 	this.selectState = function($event, state){

    						 		var modeEl = $event.currentTarget;

    						 		if(!modeEl.className){
    						 			$(modeEl).siblings().removeClass("active");
    						 			$(modeEl).addClass("active");

    						 			if(state === "nonedit"){
    						 				if($("#draftLayer")[0].firstChild && confirm("You have unsaved work. Click the Ok button to keep your work.\n" + 
    													 "Or cancel to continue anyway and lose your unsaved work")){
    											$(modeEl).siblings().addClass("active");
    											$(modeEl).removeClass("active");
    											return;
    										}

                        if(this.bkgrdHidden){  
                            this.bkgrdHidden = false; 
                        }

    										$("#draftLayer").remove();
                        $("#toolBar").addClass("hide");
    

    										$(document).off("mousedown");
    										$(document).off("mouseup");

    										// Request new pictures from backend to add to the canvas
    										// getNewCanvas()
    						 			}else{
    						 				$("#backSetting").after("<div id='draftLayer'>");
                        $("#toolBar").removeClass("hide");

    										// Set the dimensions of the newly created div to be the same dimensions of the #backSetting 
    										// div that holds the static canvas so it is essentially an identical div stacked above
    										$("#draftLayer").css({ width: $("#backSetting").width(), height: $("#backSetting").height() });

    										
    										// Add the listeners, including the mousemove and drag listeners on the edit div itself
    										addEditStateEvents();
    									 	$(document).on("mousedown", function(event){
    									 		if(event.which === 1){
    									 			leftButtonDown = true;
    									 		}else if(event.button === 0){
    									 			leftButtonDown = true;
    									 		}
    										});
    										$(document).on("mouseup", function(event){
    										  if(event.which === 1){
    									 			leftButtonDown = false;
    									 		}else if(event.button === 0){
    									 			leftButtonDown = false;
    									 		}
    										});
    						 			}
    						 			
    						 		}
    						 	}


                  this.switchLoginMode = function($event) {
                    if(!$event.currentTarget.className){
                      $("#loginBlock .active").removeClass("active");
                      $($event.currentTarget).addClass("active");
                    }
                  }


                  this.loginSection = function($event){
                    // If the #authLink element does not have the text Login/Signup within it then it has a username, 
                    // of the signed in user. Then customize the html of the #loginBlock with a signout link
                    if($event.currentTarget.innerText.indexOf("Login/Signup") === -1) {
                      $("#loginBlock").html("<a href='#!'>signout</a>");
                    }

                    this.loginHidden = false;
                  }



                  this.exitOverlay = function(){
                    $("#loginBlock .active").removeClass("active");
                    $("#loginBlock span:first-child").addClass("active");

                    this.loginHidden = true;
                  }


                  


    					 }]);



