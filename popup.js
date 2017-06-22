const background = chrome.extension.getBackgroundPage();

var global = {};
var lastDate = Date.now();
var lastTab = null;
var timeArr = [];

chrome.tabs.query({}, function(tabs){
	background.console.log("yo")
	background.console.log(lastDate);
	background.console.log(tabs)
});
chrome.tabs.onCreated.addListener(function(tab){
	console.log(tab);
});
chrome.tabs.onActivated.addListener(function(object){
	chrome.tabs.get(object.tabId, function(tab){
		background.console.log(tab);
		lastTab = tab;
		var milliseconds = findMillis();
		var timeSpent = findOffset();
		logTime(timeSpent, lastTab, milliseconds);
		background.console.log(lastTab);
		background.console.log(milliseconds);
		timeArr.push(milliseconds);
		background.console.log(timeArr);
		var sum = timeArr.reduce((a,b) => a + b, 0);
	console.log(sum);
	var wow = convertToTime(sum);
	console.log(wow)
	});
});

function logTime(timeSpent,tab, mills){
	var s = new Session(timeSpent[0],timeSpent[1]);
	var ms = new millisSession(mills[0]);
	if(global[tab.title] == null){
		var array = [];
		var millisArray = [];
		millisArray.push(ms);
		array.push(s);
		global[tab.title] = millisArray
		global[tab.title] = array
	}else{
		var array = global[tab.title];
		var millisArray = global[tab.title];
		array.push(s);
		millisArray.push(ms);
		global[tab.title] = millisArray
		global[tab.title] = array
	}
	console.log(global);
}
function convertToTime(milli){
	var milliseconds = parseInt((milli%1000)/100)
            , seconds = parseInt((milli/1000)%60)
            , minutes = parseInt((milli/(1000*60))%60)
            , hours = parseInt((milli/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
function findMillis(){
	var offset = Date.now()-lastDate;
	return offset;
}
function findOffset(){
	var beginning = lastDate;
	var offset = Date.now() - lastDate;
	lastDate = Date.now();
	background.console.log(offset);
	return [offset, beginning];
}
function totalTime(){
	var sum = timeArr.reduce((a,b) => a + b, 0);
	console.log(sum);
}
class Session {
	constructor(time, date){
		this.time = time
		this.date = date
	}
}

class millisSession{
	constructor(time){
		this.time = time
	}
}

	/*	timeArr.push(timeSpent);
		background.console.log(timeArr);
		var sum = timeArr.reduce((a,b) => a + b, 0);
	console.log(sum);*/