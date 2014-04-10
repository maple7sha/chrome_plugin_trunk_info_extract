  /*
    Trunk Plugin
    Implemented API calls to trunk site so as to display a list of utln and email addresses sorted by role
    */

  /*
    To do this, we need:
    1. create div with Id if it does not exist yet, and add the element the div
    2. if the div has already existed, we just need to add the new node to that div 
    */  

  function getMembers(obj){
    var textnode = "";
      //var node = document.createElement("div");
    for (var i = 0; i < obj.membership_collection.length; i++){
      // if no such div id exists, creat and append to body
      var role = obj.membership_collection[i].memberRole;
      if(!document.getElementById(role)){
        //document.body.(document.createElement("br"));
        // create header to start the category display 
        var hdr = document.createElement("div");
        hdr.appendChild(document.createTextNode("---" + role + "s--"));
        // create new role node
        var newrolenode = document.createElement("div");
        newrolenode.setAttribute("id", role);
        // append header to the role node
        newrolenode.appendChild(hdr);
        // append role node to body
        document.body.insertBefore(document.createElement("br"), document.body.firstChild);
        document.body.insertBefore(newrolenode, document.body.firstChild);
      }
      // add the utln to the current page under the right div id defined according to their roles 
      var node = document.createElement("div");   
      textnode = document.createTextNode(obj.membership_collection[i].userDisplayId);
      node.appendChild(textnode);
      document.getElementById(obj.membership_collection[i].memberRole).appendChild(node);
    }
  }

  // Get properties of Sakai site
  function getProp(obj){
    var node = document.createElement("div"); 
    // published, it's type, and it's term site property
    var textnode0 = document.createTextNode("Published: " + obj.published);
    var textnode1 = document.createTextNode("Site Type: " + obj.type);

    node.appendChild(textnode0);
    node.appendChild(document.createElement("br"));
    node.appendChild(textnode1);
    if(obj.props.term != null){
      var textnode2 = document.createTextNode("Site Term: " + obj.props.term);
      node.appendChild(textnode2);
    }
    node.appendChild(document.createElement("br"));
    node.appendChild(document.createElement("br"));
    document.body.insertBefore(node, document.body.firstChild);
  }

  function dispError(){
    var node = document.createElement("div"); 
    var textnode0 = document.createTextNode("Published: " + obj.published);
    node.appendChild(textnode0);
    document.body.insertBefore(node, document.body.firstChild);
  }

  var urlG = {

    requestURL: function(){
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {

        tablink = tabs[0].url;
        var addr_array = tablink.split("/");
        var siteID = addr_array[5];
        var hostUrl = addr_array[2];
        var request = new XMLHttpRequest();
        var sakai = true;

        // Check if this is a Sakai Site
        url_versakai = "https://" + hostUrl + "/direct/describe";
        request.open("GET", url_versakai, false);
        request.send();
        request.onreadystatechange = function(){
          if (request.readyState == 4) {
            if (request.status == 200 || request.status == 0) {
            }else if(request.status == 403){
            }else if(request.status == 404 || true){
              //alert("Either this is not a Sakai Site or Site ID is not present : (");
              document.getElementById("error").appendChild(document.createTextNode("This is not a Sakai Site"));
              return false; 
            }
          }
        }

        //if(!request.responseText.test("Represents a site (a collection of users and tools) in the Sakai system")){
        //  document.getElementById("error").appendChild(document.createTextNode("This is not a Sakai Site"));

        //}
          //var obj = JSON.parse(request.responseText);
        if(siteID != null){
          // Get all current members of the site 
          var url_members = "https://" + hostUrl + "/direct/site/" + siteID + "/memberships";
          request.open("GET", url_members, false);
          request.send();
          request.onreadystatechange = function(){
            if (request.readyState == 4) {
              if (request.status == 200 || request.status == 0) {
              }
              else if(request.status == 403){
                  alert("Please Login and make sure you have Admin privilege");
                  return false;
              }else if(request.status == 404){
                  alert("Request not found");
              }
            }
          }
          var obj1 = JSON.parse(request.responseText);
          getMembers(obj1);

          // Get the property of this site 
          var url_prop = "https://" + hostUrl + "/direct/site/" + siteID + ".json";
          request.open("GET", url_prop, false);
          request.send();
          request.onreadystatechange = function(){
            if (request.readyState == 4) {
              if (request.status == 200 || request.status == 0) {
              }
              else if(request.status == 403){
                  alert("Please Login and make sure you have Admin privilege");
                  return false;
              }else if(request.status == 404){
                  alert("Request not found");
              }
            }
          }
          var obj2 = JSON.parse(request.responseText);
          getProp(obj2);
        }
        else{
          document.getElementById("error").appendChild(document.createTextNode("Please go to a Sakai Site page with site-ID"));
        }
     })
  }
  };

  // Run our kitten generation script as soon as the document's DOM is ready.
  document.addEventListener('DOMContentLoaded', function () {
    urlG.requestURL();
  });
