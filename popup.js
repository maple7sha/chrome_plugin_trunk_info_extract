/*
  Trunk Plugin
  Implemented API calls to trunk site so as to display a list of utln and email addresses sorted by role
*/

/*
  To do this, we need:
  1. create div with Id if it does not exist yet, and add the element the div
  2. if the div has already existed, we just need to add the new node to that div 
*/  

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
        //var node = document.createElement("div");
        for (var i = 0; i < obj.membership_collection.length; i++){
          // if no such div id exists, creat and append to body
          var role = obj.membership_collection[i].memberRole;
          if(!document.getElementById(role)){
            // create header to start the category display 
            var hdr = document.createElement("h5");
            hdr.appendChild(document.createTextNode(role + ":"));
            // create new role node
            var newrolenode = document.createElement("div");
            newrolenode.setAttribute("id", role);
            // append header to the role node
            newrolenode.appendChild(hdr);
            // append role node to body
            document.body.insertBefore(newrolenode, document.body.firstChild);
          }
          // add the utln to the current page under the right div id defined according to their roles 
          var node = document.createElement("div");   
          var textnode = document.createTextNode(obj.membership_collection[i].userDisplayId);// + " Email: " + obj.membership_collection[i].userEmail);
          node.appendChild(textnode);
          document.getElementById(obj.membership_collection[i].memberRole).appendChild(node);
          /*if(obj.membership_collection[i].memberRole == "Organizer"){
            document.getElementById('Organizer').appendChild(node);
          }else if(obj.membership_collection[i].memberRole == "Participant"){
            document.getElementById('Participant').appendChild(node);
          }
          //document.body.appendChild(node);
          */
        }
    })
  }
};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  urlG.requestURL();
});
