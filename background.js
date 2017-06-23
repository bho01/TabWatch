const background = chrome.extension.getBackgroundPage();

var global = {};
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
	console.log(port);
	if(port.name == "Data Communication"){
		port.onMessage.addListener(function(msg) {
			if(msg == "Requesting Data"){
				console.log("message recieved : " + msg);
				var b = calculatePercentages()
				console.log(b)
				port.postMessage(b);
			}else{
				console.log(msg);
			}	
		});
	}else{
		port.onMessage.addListener(function(msg) {
				console.log("message recieved : " + msg);
				console.log(global[msg]);
		});
	}
})

chrome.tabs.onCreated.addListener(function(tab){
	console.log(tab);
});
//when a Tab is selected, calculate and push time for previous tab (call logTime)
chrome.tabs.onActivated.addListener(function(object){
	chrome.tabs.get(object.tabId, function(tab){
		var timeSpent = findOffset();
		logTime(timeSpent, currentTab);
		currentTab = tab;
	});
});
/*
if it's a new tab, make a new key in the global object. 
Otherwise, add the session to the existing key in the global object.
*/
function logTime(timeSpent,tab){
	var s = new Session(timeSpent[0],timeSpent[1]);
	if(global[tab.title] == null){
		var obj = {};
		var array = []
		console.log(tab);
		obj["image"] = tab.favIconUrl
		array.push(s);
		obj["array"] = array
		global[tab.title] = obj
	}else{
		var array = global[tab.title]["array"];
		array.push(s);
		global[tab.title]["array"] = array
	}
	totalTime();
}
function convertToTime(milli){
	var milliseconds = parseInt((milli%1000)/100)
            , seconds = parseInt((milli/1000)%60)
            , minutes = parseInt((milli/(1000*60))%60)
            , hours = parseInt((milli/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + "h " + minutes + "m " + seconds + "s : " + milliseconds;
}

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
	console.log(convertToTime(sum));
	calculatePercentages();
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
	console.log(relativeList);
	return relativeList;

}
/*
This class is the basis of a session -> 
	session.time -> amount of time in a session
	session.date -> date the session began 
*/
class Session {
	constructor(time, date){
		this.time = time
		this.date = date
	}
}
