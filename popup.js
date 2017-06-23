var port = chrome.extension.connect({
      name: "Data Communication"
 });
var dataSet = []
var label = []
var colors = []
port.postMessage("Requesting Data");
 
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
  loadData(msg, 0, function(){
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
      options:null
    })
  });


  var dialog = document.querySelector('dialog');
  var showModalButton = document.querySelector('.show-modal');
  if (! dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
  showModalButton.addEventListener('click', function() {
    dialog.showModal();
  });
  dialog.querySelector('.close').addEventListener('click', function() {
    dialog.close();
  });
 });

