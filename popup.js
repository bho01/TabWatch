var port = chrome.extension.connect({
      name: "Data Communication"
 });
 port.postMessage("Requesting Data");
 port.onMessage.addListener(function(msg) {
      console.log("message recieved" + msg);
      var dataSet = []
      var label = []
      for (var key in msg) {
    	if (msg.hasOwnProperty(key)){
    		label.push(key)
    		dataSet.push(msg[key]);
    	}
	}
      var data = {
      	datasets:[{data : dataSet}],
      	labels:label
      }

      var ctx = document.getElementById("chart")
      var pieChart = new Chart(ctx, {
      	type:'pie',
      	data : data,
      	options : null
      })
 });