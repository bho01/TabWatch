var url = window.location.hash.substring(1);
console.log(url);

var port = chrome.extension.connect({
      name: "Detailed Data"
 });
port.postMessage(url)
port.onMessage.addListener(function (msg){
	console.log(msg);
});