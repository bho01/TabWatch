const background = chrome.extension.getBackgroundPage();

var global = {};
var lastDate = Date.now();
chrome.tabs.query({}, function(tabs){
	background.console.log("yo")
	background.console.log(tabs)
});
chrome.tabs.onCreated.addListener(function(tab){
	console.log(tab);
});
chrome.tabs.onActivated.addListener(function(object){
	console.log(object);
	findOffset();
});

function findOffset(){
	var offset = Date.now() - lastDate;
	lastDate = Date.now();
	background.console.log(offset);
}
class Session {
	constructor(time, date){
		this.time = time
		this.date = date
	}
}


