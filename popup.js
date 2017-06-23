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
      	type:'doughnut',
      	data : data,
      	data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: ['rgb(244, 67, 54)', 'rgb(156, 39, 176)', 'rgb(33, 150, 243)', 'rgb(76, 175, 80)', 'rgb(255, 235, 59)', 'rgb(255, 152, 0)', 'rgb(255, 87, 34)'],
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    },
      	options : null
      })
       var dialog = document.querySelector('dialog');
    
 });
