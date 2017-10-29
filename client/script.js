
  var smallerScreenDimen,
  leftButtonDown,
  lastWidthDimen,
  scaleClose;





  $("#toolBar select").on("change", function(){
      // select element starts of on draw so if condition wont be met until it goes cycle of text then back to draw
      if($(this).val() === "draw"){
        $(this).closest("div").prev().remove();
      }else{
        $(this).closest("div").before("<div><input type='text' id='addTextBox' draggable='true' /></div>")
      }
  });


  $("#toolBar #refreshBtn").on("click", function(){
      var frameLayer = document.getElementById("draftLayer");
      // If the element with id draftLayer (the editable layer) has any children elements, then trap user and 
      // inform that there is unsaved work and the work is at risk of being lost if they still wish to refresh anyway
      if(frameLayer.firstChild && confirm("Are you sure you wish to refresh, you have unsaved work. Click Ok to refresh anyway")){
        // remove the editable div and add it right back instead of looping through and removing all child elements
        frameLayer.parentNode.removeChild(frameLayer);
        $("#backSetting").after("<div id='draftLayer'>");
        $("#draftLayer").css({ 
                    width: $("#backSetting").width(),
                    height: $("#backSetting").height()
                  });
        addEditStateEvents();
      }
  });


  $("#toolBar").delegate("#addTextBox", "dragstart", function(event){
      // attach the element id as data to be transfered to know which element to append when dropped over editable div
      event.originalEvent.dataTransfer.setData("text", event.target.getAttribute("id"));
      event.originalEvent.dataTransfer.dropEffect = "move";
  });

  $("#toolBar [type=button]").on("click", function(event){
      // Only handle the submit button click if work has been done on the editable div (#draftLayer), if it has any 
      // children elements work has been done 
      if($("#draftLayer")[0].firstChild && confirm("Are you sure you are finished? If so we will upload your work and provide you with a blank slate")){

        var node = document.getElementById("draftLayer");

        
        $("#draftLayer").css({
              left: "0",
              top: "0",
              marginTop:"0",
              transform: "translate(0,0)"
            });
        // Copy the dom node (#draftLayer) as a base64 data url
          domtoimage.toPng(node)
            .then(function (dataUrl) {

            $.post({
                url: api.baseUrl + "url/action",
                data: { dataUrl: dataUrl }
            }).done(function(e){
                    location.reload(false)
                });

            })
            .catch(function (error) {
              // Refreshing the page will delete the draft layer essentially because it 
              // starts not there on pg reload because pg starts on non-edit state
                location.reload(false)
                console.error("oops, something went wrong!", error);
            });

      }

  });

  $("#loginBlock").on("click", "a", function(event) {
      event.preventDefault();

      $.get(api.baseUrl + "signout", function() {
        location.reload();
      })
  });


  $("#loginBlock").delegate("#loginForm", "submit", function(event) {
      event.preventDefault();
      
      // clear img interval no point in asking for images from backend when submitting form and 
      // going to reload page anyway
      clearInterval(getPrintInterval)
      // get the state that has the current active class
      var state = $(this).closest("#loginBlock").find(".active");
      // serialize form fields
      var formdata = $(this).serializeArray();
      var data = {};
      $(formdata).each(function(index, obj){
          data[obj.name] = obj.value;
      });

      $("#loginBlock").removeClass("hide");
      $("#overlay").removeClass("hide");


      var url = state[0] === $("#loginBlock span")[0] ? "signin" : "signup";


      $.ajax({
              url: api.baseUrl + url,
              type: "POST",
              data: data,
              dataType: "json",
              xhrFields: {
                   withCredentials: true
              },
              crossDomain: true,
              success: function(data){

                console.log(data);
                // $("#overlay").trigger("click");

                // $("#loginBlock .active").removeClass("active");
                // $("#loginBlock span:first-child").addClass("active");


                // $scope.usr = data;
              }
            })


  });

  	

  // Add the event listeners that will be added and removed as the editable layer is deleted and added
  function addEditStateEvents() {

    $("#draftLayer").on("mousemove", function(event){
        // Not enough to check if mouse is moving also need to check if left mouse button is down
        if(leftButtonDown && $("#toolBar select").val() === "draw"){

           $("<div class='dot'>")
             .appendTo(this)
             .css({
            top: (event.clientY-event.target.offsetTop) + "px", 
            left: (event.clientX-(event.target.offsetLeft - (parseInt(event.target.style.width)/2))) + "px",
            background: $("#toolBar [type=color]").val()
           });
        }
    });

    $("#draftLayer").on("drop", function(event){
        event.preventDefault();
        // The info the dragged object will transfer will be its id as a string use it to attain the obj reference
        var textValue = event.originalEvent.dataTransfer.getData("text");
        var inpObjRef = document.getElementById(textValue);
        // Append the element dropped over the target element to the target itself (dropzome)
        event.target.appendChild(inpObjRef);
        // Position the elment where it was dropped and remove the draggable attribute
        inpObjRef.removeAttribute("id");
        inpObjRef.removeAttribute("draggable");
        $(inpObjRef).css({
            position: "absolute",
            top: (event.clientY-event.target.offsetTop) + "px",
            left: (event.clientX-(event.target.offsetLeft - (parseInt(event.target.style.width)/2))) + "px",
            color: $("#toolBar [type=color]").val(),
            width: $(this).width - 
                 (event.clientX-(event.target.offsetLeft - (parseInt(event.target.style.width)/2))) + "px",
            outline: "none",
            border: "none"
        });

        $("#toolBar div:nth-child(3)").append("<input type='text' id='addTextBox' draggable='true' />");
    });

    $("#draftLayer").on("dragover", function(event){
        return false;
    });

  }


  function tailorCanvas(){
  	// Find the smaller dimension of the clients screen
  	smallerScreenDimen = window.innerHeight < window.innerWidth ? { height: window.innerHeight } : {width: window.innerWidth};
  	// Use the smaller dimension between the height and width attained above and make canvas width 
  	// the length of the smaller dimension and the height 60% of the same length
  	if(smallerScreenDimen.height){
  		if($("#draftLayer").length){
  			$("#draftLayer").width(smallerScreenDimen.height + "px");
  			$("#draftLayer").height( (smallerScreenDimen.height * 0.6) + "px");
  		}
  		
  		$("#backSetting").width(smallerScreenDimen.height + "px");
  		$("#backSetting").height( (smallerScreenDimen.height * 0.6) + "px");
  	} else {
  		if($("#draftLayer").length){
  			$("#draftLayer").width(smallerScreenDimen.width + "px");
  			$("#draftLayer").height( (smallerScreenDimen.width * 0.6) + "px");
  		}
  		
  		$("#backSetting").width(smallerScreenDimen.width + "px");
  		$("#backSetting").height( (smallerScreenDimen.width * 0.6) + "px");
  	}

  	if($("#draftLayer .dot").length){ scaleSketch(); }
  }


  // Scale the position of the child elements of the #draftLayer div as the draftLayer is scaled
  function scaleSketch(){
    var dotElems = $("#draftLayer .dot");
    var textElems = $("#draftLayer [type=text]");

    if(lastWidthDimen !== parseInt($("#draftLayer").width())){
      for (var i = 0; i < dotElems.length; i++) {
        dotElems[i].style.left = (parseInt(dotElems[i].style.left)) * 
                     ((parseInt($("#draftLayer").width()))/lastWidthDimen) + "px";
        dotElems[i].style.top = (parseInt(dotElems[i].style.top)) * 
                     ((parseInt($("#draftLayer").width()))/lastWidthDimen) + "px";
      }

      for (var i = 0; i < textElems.length; i++) {
        textElems[i].style.left = (parseInt(textElems[i].style.left)) * 
                     ((parseInt($("#draftLayer").width()))/lastWidthDimen) + "px";
        textElems[i].style.top = (parseInt(textElems[i].style.top)) * 
                     ((parseInt($("#draftLayer").width()))/lastWidthDimen) + "px";
      }

      // Record the lastWidth (of the canvas) every time the smaller dimension of the screen is figured 
      // out (calculated) will use this for scaling when having to reposition child elements of editable 
      // div after scaling
      lastWidthDimen = parseInt($("#draftLayer").width());
    }
    
  }



  function getNewCanvas() {

    $.get({
      url: api.baseUrl + "staticpics",
    })
    .done(function(imgs){
      var canvasLayer = $("#backSetting")[0];

      var currLastImg = canvasLayer.children.length > 0 ? 
                        parseInt(canvasLayer.children[canvasLayer.children.length - 1].getAttribute("src").substr(34)) : 0;

      var domFrag = document.createDocumentFragment();

          for(var i = 0, img; i < imgs.length; i++){

            if(currLastImg < parseInt(imgs[i].substr(34))){
              img = document.createElement("img");
              img.src = imgs[i];

              domFrag.appendChild(img);
            }
          }

          document.getElementById("backSetting").appendChild(domFrag);

      });
  }


  // Initialize the Canvas Dimensions
  tailorCanvas();
  // Record the lastWidth (of the canvas) every time the smaller dimension of the screen is figured
  // out will use this for scaling when having to reposition child elements of editable div after 
  // scaling
  lastWidthDimen = smallerScreenDimen.height ? smallerScreenDimen.height : smallerScreenDimen.width;






  // resize event handler will also be fired on any orientation changes that typically
  // occur on mobile (touch screens) so no need to listen for orientation change events
  $(window).on("resize", function(){
  	clearTimeout(scaleClose); 
  	scaleClose = setTimeout(tailorCanvas, 500); 
  });

  getPrintInterval = window.setInterval(getNewCanvas, 10000);

