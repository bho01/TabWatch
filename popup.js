var port = chrome.extension.connect({
      name: "Data Communication"
 });
var dataSet = []
var label = []
var colors = []
port.postMessage("Requesting Data");
port.postMessage("get total time");
function loadData(msg, number, callback){
  if(number < Object.keys(msg).length){
    var key = Object.keys(msg)[number];
    label.push(key)
    dataSet.push(msg[key]["sum"]);
    var img = new Image();
    img.src = msg[key]["img"]
    img.onload = function(){
      number ++;
      var colorThief = new ColorThief();
      var color = colorThief.getColor(img);
      console.log(color);
      var colorString = "rgb("+color[0]+","+color[1]+","+color[2]+")"
      colors.push(colorString)
      console.log(number + " vs " + Object.keys(msg).length)
      if(number == Object.keys(msg).length){
        callback();
      }else{
        loadData(msg, number, callback);
      }
    }
    img.onerror = function(){
      number ++;
      colors.push("#000");
      if(number == Object.keys(msg).length){
        callback();
      }else{
        loadData(msg, number, callback);
      }
    }
  }
}
port.onMessage.addListener(function(msg) {
  console.log("message recieved" + msg);
  if(msg[0] == "initialize"){
    loadData(msg[1], 0, function(){
      var data = {
        datasets:[{
          data : dataSet,
          backgroundColor:colors
        }],
        labels:label
      }
      var ctx = document.getElementById("chart")
      var pieChart = new Chart(ctx, {
        type:'doughnut',
        data : data,
        options:{
          onClick: manageClick
        }
      })
    });
  }else if(msg[0] == "total time data"){
    $("#time").text(msg[1]);
  }
});

function manageClick(event, array){
  console.log(event)
  console.log(array)
  var element = array[0]["_model"]["label"]
  console.log(element)

  location.href = "detailed.html" + "#"+element;
  console.log("script still running")
}

