const background = chrome.extension.getBackgroundPage();

var global = {};
chrome.tabs.query({}, function(tabs){
	background.console.log("yo")
	background.console.log(tabs)
});
chrome.tabs.onCreated.addListener(function(tab){
	console.log(tab);
});
chrome.tabs.onActivated.addListener(function(object){
	console.log(object);
});

class Session {
	constructor(time, date){
		this.time = time
		this.date = date
	}
}


