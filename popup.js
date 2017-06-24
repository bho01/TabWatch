var port = chrome.extension.connect({
      name: "Data Communication"
 });
var dataSet = []
var label = []
var colors = []
var total = 0.0
var other = []
port.postMessage("get total time");
port.postMessage("Requesting Data");

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
    total = msg[1];
    var wasted = other.reduce((a, b) => a + b, 0);
    $("#time").text(convertToTime(msg[1]));
  }

});

function loadData(msg, number, callback){
  if(number < Object.keys(msg).length){
    var key = Object.keys(msg)[number];
    var n = msg[key]["sum"];
    var percentOfTotal = n / total
    if(percentOfTotal >= 0.1){
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
    }else{
      var index = label.indexOf("Other");
      other.push(key);
      number ++;
      if(index == -1){
        label.push("Other");
        dataSet.push(msg[key]["sum"]);
        colors.push("#607D8B")
      }else{
        var otherSum = dataSet[index]
        otherSum += msg[key]["sum"];
        dataSet[index] = otherSum;
      }
      if(number == Object.keys(msg).length){
        callback();
      }else{
        loadData(msg, number, callback);
      }
    }
    
  }
}
function convertToTime(milli){
  var milliseconds = parseInt((milli%1000)/100)
            , seconds = parseInt((milli/1000)%60)
            , minutes = parseInt((milli/(1000*60))%60)
            , hours = parseInt((milli/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        var str = "";
        if(hours != "00"){
            str += hours + "h "
        } 
        if(minutes != "00"){
            str += minutes + "m "
        }
        if(seconds != "00"){
            str += seconds + "s"
        } 
        if(milliseconds != "00"){
            str += " : " + milliseconds
        }
        return str
}

function manageClick(event, array){
  console.log(event)
  console.log(array)
  var element = array[0]["_model"]["label"]
  console.log(element)
  if(element == "Other"){
    port.postMessage(["other",other]);
  }
  location.href = "detailed.html" + "#"+element;
  console.log("script still running")
}

