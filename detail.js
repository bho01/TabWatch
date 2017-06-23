var url = window.location.hash.substring(1);
console.log(url);

var port = chrome.extension.connect({
      name: "Detailed Data"
 });
port.postMessage(url)
port.onMessage.addListener(function (msg){
	console.log(msg);


var ctx = document.getElementById('line').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: [10,13,16,1,19],

    // Configuration options go here
    options: {}
});
});