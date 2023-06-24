// TODO: Implement todo changes

$(document).ready(() => {
    // if deployed to a site supporting SSL, use wss://
    const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
    const webSocket = new WebSocket(protocol + location.host);
  
    // A class for holding the last N points of telemetry for a device
    class DeviceData {
      constructor(deviceId) {
        this.deviceId = deviceId;
        this.maxLen = 60;
        this.timeData = new Array(this.maxLen);
        this.batteryData = new Array(this.maxLen);
        this.cpmData = new Array(this.maxLen);
        this.sievertsData = new Array(this.maxLen);
        this.dangerLevelData = new Array(this.maxLen);
      }
  
      addData(time, battery, cpm, sieverts, dangerLevel) {
        this.timeData.push(time);
        this.batteryData.push(battery || null);
        this.cpmData.push(cpm);
        this.sievertsData.push(sieverts);
        this.dangerLevelData.push(dangerLevel);

  
        if (this.timeData.length > this.maxLen) {
          this.timeData.shift();
          this.batteryData.shift();
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
          borderColor: 'rgba(255, 204, 0, 1)',
          pointBoarderColor: 'rgba(255, 204, 0, 1)',
          backgroundColor: 'rgba(255, 204, 0, 0.4)',
          pointHoverBackgroundColor: 'rgba(255, 204, 0, 1)',
          pointHoverBorderColor: 'rgba(255, 204, 0, 1)',
          spanGaps: true,
        }
      ]
    };
  
    const chartOptions = {
      scales: {
        yAxes: [{
          id: 'sieverts',
          type: 'linear',
          scaleLabel: {
            labelString: 'sieverts (mSv/hr)',
            display: true,
          },
        position: 'left',
        ticks: {
          beginAtZero: true
        }
        }
      ]
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
    const batteryLevel = document.getElementById('battery');
    const date = document.getElementById('date');
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
  
        // find or add device to list of tracked devices
        const existingDeviceData = trackedDevices.findDevice(messageData.DeviceId);
  
        if (existingDeviceData) {
          var messageDate = new Date(messageData.MessageDate).toLocaleString();
          existingDeviceData.addData(messageDate, messageData.IotData.Battery, messageData.IotData.CPM, messageData.IotData.sieverts, messageData.IotData.danger_level);
          
          batteryLevel.innerText = "Battery: " + messageData.IotData.Battery + "%";
          date.innerText = "Last data point date: " + messageDate;
          sieverts.innerText = messageData.IotData.sieverts + " uSv/hr";
          dangerLevel.innerText = "Danger Level: " + messageData.IotData.danger_level;
          cpm.innerText = "Counts per Minute: " + messageData.IotData.CPM;
        } else {
          const newDeviceData = new DeviceData(messageData.DeviceId);
          var messageDate = new Date(messageData.MessageDate).toLocaleString();
          trackedDevices.devices.push(newDeviceData);
          const numDevices = trackedDevices.getDevicesCount();
          deviceCount.innerText = numDevices === 1 ? `${numDevices} device` : `${numDevices} devices`;
          newDeviceData.addData(messageDate, messageData.IotData.Battery, messageData.IotData.CPM, messageData.IotData.sieverts, messageData.IotData.danger_level);
          console.log(messageData.sievertsData);
          
          batteryLevel.innerText = "Battery: " + messageData.IotData.Battery + "%";
          date.innerText = "Last data point date: " + messageDate;
          sieverts.innerText = messageData.IotData.sieverts + " uSv/hr";
          dangerLevel.innerText = "Danger Level: " + messageData.IotData.danger_level;
          cpm.innerText = "Counts per Minute: " + messageData.IotData.CPM;

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