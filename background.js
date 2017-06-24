const background = chrome.extension.getBackgroundPage();

var global = {};
var otherURL = []
//storage of Tab Title :  Array of Sessions

//initialization
var lastDate = Date.now();
var currentTab = null;
function activeTab(){
	chrome.tabs.query({active:true}, function(tabs){
		currentTab = tabs[0];
		return tabs[0];
	});	
}

activeTab();

chrome.extension.onConnect.addListener(function(port) {
	console.log("Connected ..... to " + port.name);
	if(port.name == "Data Communication"){
		port.onMessage.addListener(function(msg) {
			if(msg == "Requesting Data"){
				console.log("message recieved : " + msg);
				var b = calculatePercentages()
				port.postMessage(["initialize",b]);
			}else if(msg == "get total time"){
				console.log("getting total time");
				var time = totalTime()
				port.postMessage(["total time data", time]);
			}else if(msg[0] == "other"){
				otherURL = msg[1];
			}	
		});
	}else{
		//otherwise, send specific data
		port.onMessage.addListener(function(msg) {
			console.log("message recieved : " + msg);
			if(msg == "Other"){
				var object = {};
				object["title"] = "Other"
				var a = [];
				for(obj in otherURL){
					var url = otherURL[obj];
					a = a.concat(global[url]["array"])
					console.log(global[url]);
				}
				object["array"] = a;
				port.postMessage(object)
			}else{
				var data = global[msg]
				port.postMessage(data);
			}
		});
	}
})
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
	if(changeInfo["url"] != null){
		console.log("URL CHANGED");
		var timeSpent = findOffset();
		logTime(timeSpent, currentTab);
		console.log(currentTab)
		currentTab = tab;
		console.log(currentTab)
	}else{
		currentTab = tab;
	}
});

chrome.tabs.onCreated.addListener(function(tab){
	var timeSpent = findOffset();
	logTime(timeSpent, currentTab);
	currentTab = tab;
	console.log(tab);
});

//Get the chrome strogae tabs


var blacklist = [];
chrome.storage.sync.get('value', function(result){
	var channels = result.value;
	console.log(channels);
	blacklist.push(channels);
});
/*
chrome.webRequest.onBeforeRequest.addListener(
        function(details) { 
        	return {cancel: true}; },
        {urls: blacklist},
        ["blocking"]);*/
//when a Tab is selected, calculate and push time for previous tab (call logTime)
chrome.tabs.onActivated.addListener(function(object){
	chrome.tabs.get(object.tabId, function(tab){
		var timeSpent = findOffset();
		logTime(timeSpent, currentTab);
		currentTab = tab;
	});
});

chrome.idle.onStateChanged.addListener(function (state){
	if(state == "idle" || state == "locked"){
		console.log("Detected idle, saving session...")
		var timeSpent = findOffset()
		logTime(timeSpent, currentTab)
	}else if(state == "active"){
		console.log("New session starting...")
		lastDate = Date.now();
	}
});

/*
if it's a new tab, make a new key in the global object. 
Otherwise, add the session to the existing key in the global object.
*/
function logTime(timeSpent,tab){
	console.log("executed");
	if(tab.favIconUrl != undefined){
		var s = new Session(timeSpent[0], tab.title, timeSpent[1]);
		var relevantPart = tab.url.split('/')
		var url = relevantPart[2]
		if(global[url] == null){
			var obj = {};
			var array = []
			obj["title"] = url;
			obj["image"] = tab.favIconUrl
			array.push(s);
			obj["array"] = array
			global[url] = obj
		}else{
			var array = global[url]["array"];
			array.push(s);
			global[url]["array"] = array
		}
	}else{
		console.log("undefined favicon");
	}
}
//saves into chrome stroage
/*
function block(){
	var relevantPart = tab.url.split('/')
		var url = relevantPart[2]
	if(url == ){
		alert("You have blocked this site");
	}
}*/
//find Offset between session times using the beginning and ending times of a session.
function findOffset(){
	var beginning = lastDate;
	var offset = Date.now() - lastDate;
	lastDate = Date.now();
	background.console.log(offset);
	return [offset, beginning];
}
//O(n^2), iterate through keys and sum session times
function totalTime(sinceDate){
	timeArr = [];
	for (var key in global) {
    	if (global.hasOwnProperty(key)){
    		var ses = global[key]["array"]
    		//an array of Sessions
    		for(a in ses){
    			//TODO : Check if ses[a].time fits the time constraint parameter
    			timeArr.push(ses[a].time);
    		}
    	}
	}
	var sum = timeArr.reduce((a,b) => a + b, 0);
	return sum;
}
function calculatePercentages(sinceDate){
	var relativeList = {};
	for(var key in global){
		if(global.hasOwnProperty(key)){
			var ses = global[key]["array"]
			var sum = 0.0
			for(a in ses){
				//TODO : Check if ses[a].time fits the time constraint parameter
				sum += ses[a].time;
			}
			var obj = {};
			obj["sum"] = sum
			obj["img"] = global[key]["image"]
			relativeList[key] = obj;
		}
	}
	return relativeList;

}
/*
This class is the basis of a session -> 
	session.time -> amount of time in a session
	session.date -> date the session began 
*/
class Session {
	constructor(time, title, date){
		this.title = title
		this.time = time
		this.date = date
	}
}
