// TODO: Implement todo changes

$(document).ready(() => {
    // if deployed to a site supporting SSL, use wss://
    const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
    const webSocket = new WebSocket(protocol + location.host);
    
  
    // A class for holding the last N points of telemetry for a device
    class DeviceData {
      constructor(deviceId) {
        this.deviceId = deviceId;
        this.maxLen = 6;
        this.timeData = new Array(this.maxLen);
        this.cpmData = new Array(this.maxLen);
        this.sievertsData = new Array(this.maxLen);
        this.dangerLevelData = new Array(this.maxLen);
      }
  
      addData(time, cpm, sieverts, dangerLevel) {
        this.timeData.push(time);
        this.cpmData.push(cpm);
        this.sievertsData.push(sieverts);
        this.dangerLevelData.push(dangerLevel);

  
        if (this.timeData.length > this.maxLen) {
          this.timeData.shift();
          this.cpmData.shift();
          this.sievertsData.shift();
          this.dangerLevelData.shift();
          
        }
      }
    }
  
    // All the devices in the list (those that have been sending telemetry)
    class TrackedDevices {
      constructor() {
        this.devices = [];
      }
  
      // Find a device based on its Id
      findDevice(deviceId) {
        for (let i = 0; i < this.devices.length; ++i) {
          if (this.devices[i].deviceId === deviceId) {
            return this.devices[i];
          }
        }
  
        return undefined;
      }
  
      getDevicesCount() {
        return this.devices.length;
      }
    }
  
    const trackedDevices = new TrackedDevices();
  
    // Define the chart axes
    const chartData = {
      datasets: [
        {
          fill: false,
          label: 'sieverts',
          yAxisID: 'sieverts',
          xAxisID: 'timeStamp',
          borderColor: '#1C315E', // line color
          backgroundColor: '#227C70', //point color
          pointHoverBackgroundColor: '#1C315E',
          pointHoverBorderColor: '#227C70',
          spanGaps: true,
        }
      ]
    };
  
    const chartOptions = {
    plugins:{
      title: {
        text: 'Sieverts',
        display: true,
        font: {
          family: 'Comic Sans MS',
          size: 24,
          weight: 'bold',
          lineHeight: 1.2,

        color: "#41644A"
        },
    },
    customCanvasBackgroundColor: {
      color: '#F2E3DB',
    },
    },
       
    
      scales: {
        sieverts: {
          id: 'sieverts',
          type: 'linear',
          title: {
            text: 'sieverts (mSv/hr)',
            display: true,
          },
          
        },
        timeStamp: {
            id: 'timestamps',
            title: {
              text: 'Time Stamps',
              display: true,
            },
           
        },
        
      responsive: true,
        position: 'right',
      
      }
    };
  
    // Get the context of the canvas element we want to select
    const ctx = document.getElementById('iotChart').getContext('2d');
    const myLineChart = new Chart(
      ctx,
      {
        type: 'line',
        data: chartData,
        options: chartOptions,
      });
  
    // Manage a list of devices in the UI, and update which device data the chart is showing
    // based on selection
    let needsAutoSelect = true;
    const deviceCount = document.getElementById('deviceCount');
    const listOfDevices = document.getElementById('listOfDevices');
    const deviceLocation = document.getElementById('location');
    const sieverts = document.getElementById('sieverts');
    const dangerLevel = document.getElementById('dangerLevel');
    const cpm = document.getElementById('CPM');
    function OnSelectionChange() {
      const device = trackedDevices.findDevice(listOfDevices[listOfDevices.selectedIndex].text);
      chartData.labels = device.timeData;
      chartData.datasets[0].data = device.sievertsData;
      myLineChart.update();
    }
    listOfDevices.addEventListener('change', OnSelectionChange, false);
  
    // When a web socket message arrives:
    // 1. Unpack it
    // 2. Validate it has date/time and temperature
    // 3. Find or create a cached device to hold the telemetry data
    // 4. Append the telemetry data
    // 5. Update the chart UI
    webSocket.onmessage = function onMessage(message) {
      try {
        const messageData = JSON.parse(message.data);
  
        // time and either temperature or humidity are required
        if (!messageData.MessageDate || (!messageData.IotData.sieverts && !messageData.IotData.CPM)) {
          return;
        }
        const device_location = messageData.IotData.location; 
        var messageDate = new Date(messageData.MessageDate);
        dangerLevel.style.color = dangerLevelColor(messageData.IotData.danger_level);
        // find or add device to list of tracked devices
        const existingDeviceData = trackedDevices.findDevice(messageData.DeviceId);
  
        if (existingDeviceData) {
          
          deviceLocation.innerText = device_location;
          sieverts.innerText = messageData.IotData.sieverts + " uSv/hr";
          
          dangerLevel.innerText = messageData.IotData.danger_level;
          cpm.innerText = messageData.IotData.CPM;
          existingDeviceData.addData(timeString(messageDate), messageData.IotData.CPM, messageData.IotData.sieverts, messageData.IotData.danger_level);
        } else {
          const newDeviceData = new DeviceData(messageData.DeviceId);
         
          trackedDevices.devices.push(newDeviceData);
          
          deviceLocation.innerText = device_location;
          sieverts.innerText = messageData.IotData.sieverts + " uSv/hr";
          dangerLevel.innerText = messageData.IotData.danger_level;
          cpm.innerText = messageData.IotData.CPM;
          newDeviceData.addData(timeString(messageDate), messageData.IotData.CPM, messageData.IotData.sieverts, messageData.IotData.danger_level);

          // add device to the UI list
          const node = document.createElement('option');
          const nodeText = document.createTextNode(messageData.DeviceId);
          node.appendChild(nodeText);
          listOfDevices.appendChild(node);

          
  
          // if this is the first device being discovered, auto-select it
          if (needsAutoSelect) {
            needsAutoSelect = false;
            listOfDevices.selectedIndex = 0;
            OnSelectionChange();
          }
        }
        
        

        myLineChart.update();
      } catch (err) {
        console.log(err);
       
        
      }
    };
   
    
    
  });
  function timeString(date){
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let time = date.toLocaleTimeString();

    return time + ", " + month + "/" + day
  }
  function dangerLevelColor(danger_level){
    
    switch (danger_level) {
      case "LOW":
        text_color = "green";
        return text_color;
      case "MED":
        text_color = "yellow";
        return text_color;
      case "HIGH":
        text_color = "red";
        return text_color;
      default:
        text_color = "black";
        return text_color;
    }
    
  }