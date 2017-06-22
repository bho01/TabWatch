const background = chrome.extension.getBackgroundPage();

var global = {};
var lastDate = Date.now();
var lastTab = null;
chrome.tabs.query({}, function(tabs){
	background.console.log("yo")
	background.console.log(tabs)
});
chrome.tabs.onCreated.addListener(function(tab){
	console.log(tab);
});
chrome.tabs.onActivated.addListener(function(object){
	chrome.tabs.get(object.tabId, function(tab){
		background.console.log(tab);
		lastTab = tab;
		var timeSpent = findOffset();
		logTime(timeSpent, lastTab)
	});
});

function logTime(timeSpent,tab){
	var s = new Session(timeSpent[0],timeSpent[1]);
	if(global[tab.title] == null){
		var array = [];
		array.push(s);
		global[tab.title] = array
	}else{
		var array = global[tab.title];
		array.push(s);
		global[tab.title] = array;
	}
	console.log(global);
}

function findOffset(){
	var beginning = lastDate;
	var offset = Date.now() - lastDate;
	lastDate = Date.now();
	background.console.log(offset);
	return [offset,beginning];
}
class Session {
	constructor(time, date){
		this.time = time
		this.date = date
	}
}


