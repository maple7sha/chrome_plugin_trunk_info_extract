



var urlG = {

  requestURL: function(){
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        tablink = tabs[0].url;

        var addr_array = tablink.split("/");
        var siteID = addr_array[addr_array.length-1];
        var request = new XMLHttpRequest();
        var url = "https://trunk.tufts.edu/direct/site/" + siteID + "/memberships";
        request.open("GET", url, false);
        request.send();
        request.onreadystatechange = function(){
          if (request.readyState == 4) {
              if (request.status == 200 || request.status == 0) {
                  myXML = request.responseXML;
              }
              else if(request.status == 403){
                  //document.body.appendChild("<div> Please login </div>")
              }
          }
        }
        var obj = JSON.parse(request.responseText);
        var node = document.createElement("div");
        for (var i = 0; i < obj.membership_collection.length; i++){
          var node = document.createElement("div");
          var textnode = document.createTextNode(i + ": " + obj.membership_collection[i].userDisplayName + " Email: " + obj.membership_collection[i].userEmail);
          node.appendChild(textnode);
          document.body.appendChild(node);
        }
    })
  }
};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  urlG.requestURL();
});
