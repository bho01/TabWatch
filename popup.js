const background = chrome.extension.getBackgroundPage();

var global = {};
//storage of Tab Title :  Array of Sessions

//initialization
var lastDate = Date.now();
var lastTab = null;

chrome.tabs.query({}, function(tabs){
	background.console.log("yo")
	background.console.log(lastDate);
	background.console.log(tabs)
});
chrome.tabs.onCreated.addListener(function(tab){
	console.log(tab);
});
//when a Tab is selected, calculate and push time for previous tab (call logTime)
chrome.tabs.onActivated.addListener(function(object){
	chrome.tabs.get(object.tabId, function(tab){
		background.console.log(tab);
		lastTab = tab;
		var timeSpent = findOffset();
		logTime(timeSpent, lastTab);
		background.console.log(lastTab);
	});
});
/*
if it's a new tab, make a new key in the global object. 
Otherwise, add the session to the existing key in the global object.
*/
function logTime(timeSpent,tab){
	var s = new Session(timeSpent[0],timeSpent[1]);
	if(global[tab.title] == null){
		var array = [];
		array.push(s);
		global[tab.title] = array
	}else{
		var array = global[tab.title];
		array.push(s);
		global[tab.title] = array
	}
	console.log(global);
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
function totalTime(){
	timeArr = [];
	for (var key in global) {
    	if (global.hasOwnProperty(key)){
    		var ses = global[key]
    		//an array of Sessions
    		for(a in ses){
    			timeArr.push(ses[a].time);
    		}
    	}
	}
	var sum = timeArr.reduce((a,b) => a + b, 0);
	console.log(convertToTime(sum));
}
function calculatePercentages(sinceDate){
	var relativeList = {};
	for(var key in global){
		if(global.hasOwnProperty(key)){
			var ses = global[key]
		}
	}

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
