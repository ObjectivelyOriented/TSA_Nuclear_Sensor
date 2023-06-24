To run dev server: DEBUG=tsanuclearsensorapp:\* npm start
To run azure cli, run: /home/ziono/bin/az
To restart SHELL, run: exec -l $SHELL
To deploy code to azure (first run), run: /home/ziono/bin/az webapp up --sku F1 --name tsanuclearsensorapp
To deploy code to azure: /home/ziono/bin/az webapp up
Azure url (use after code is deployed): http://tsanuclearsensorapp.azurewebsites.net
IoT hub name: TSANucSensorIoTHub
Using IoT Hub connection string [HostName=TSANucSensorIoTHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=cRG1ggRmULriOoL43BkYgO5wSFyaNHRZ61F/3gxsUfg=]

TSAConsumerName
Using event hub consumer group [TSAConsumerName]

IoT Resource name: Ziononwujuba233_rg_4872
The partition ids are: [ '0', '1', '2', '3' ]

IoT hub creation json:
{
"etag": "AAAADH5S4sI=",
"id": "/subscriptions/0c62632f-ca37-40ec-bd64-b21a3e4f2fe2/resourceGroups/TSAResourceGroup/providers/Microsoft.Devices/IotHubs/TSANuclearSensorIoTHub",
"identity": {
"principalId": null,
"tenantId": null,
"type": "None",
"userAssignedIdentities": null
},
"location": "eastus",
"name": "TSANuclearSensorIoTHub",
"properties": {
"allowedFqdnList": [],
"authorizationPolicies": null,
"cloudToDevice": {
"defaultTtlAsIso8601": "1:00:00",
"feedback": {
"lockDurationAsIso8601": "0:00:05",
"maxDeliveryCount": 10,
"ttlAsIso8601": "1:00:00"
},
"maxDeliveryCount": 10
},
"comments": null,
"deviceStreams": null,
"disableDeviceSas": null,
"disableLocalAuth": null,
"disableModuleSas": null,
"enableDataResidency": null,
"enableFileUploadNotifications": false,
"encryption": null,
"eventHubEndpoints": {
"events": {
"endpoint": "sb://iothub-ns-tsanuclear-25073437-ce78dc3b00.servicebus.windows.net/",
"partitionCount": 4,
"partitionIds": [
"0",
"1",
"2",
"3"
],
"path": "tsanuclearsensoriothub",
"retentionTimeInDays": 1
}
},
"features": "GWV2",
"hostName": "TSANuclearSensorIoTHub.azure-devices.net",
"ipFilterRules": [],
"locations": [
{
"location": "East US",
"role": "primary"
},
{
"location": "West US",
"role": "secondary"
}
],
"messagingEndpoints": {
"fileNotifications": {
"lockDurationAsIso8601": "0:00:05",
"maxDeliveryCount": 10,
"ttlAsIso8601": "1:00:00"
}
},
"minTlsVersion": null,
"networkRuleSets": null,
"privateEndpointConnections": null,
"provisioningState": "Succeeded",
"publicNetworkAccess": null,
"restrictOutboundNetworkAccess": null,
"rootCertificate": null,
"routing": {
"endpoints": {
"cosmosDbSqlCollections": [],
"eventHubs": [],
"serviceBusQueues": [],
"serviceBusTopics": [],
"storageContainers": []
},
"enrichments": null,
"fallbackRoute": {
"condition": "true",
"endpointNames": [
"events"
],
"isEnabled": false,
"name": "$fallback",
        "source": "DeviceMessages"
      },
      "routes": []
    },
    "state": "Active",
    "storageEndpoints": {
      "$default": {
"authenticationType": null,
"connectionString": "",
"containerName": "",
"identity": null,
"sasTtlAsIso8601": "1:00:00"
}
}
},
"resourcegroup": "TSAResourceGroup",
"sku": {
"capacity": 1,
"name": "S1",
"tier": "Standard"
},
"subscriptionid": "0c62632f-ca37-40ec-bd64-b21a3e4f2fe2",
"systemData": {
"createdAt": "2023-06-06T23:37:54.390000+00:00",
"createdBy": null,
"createdByType": null,
"lastModifiedAt": null,
"lastModifiedBy": null,
"lastModifiedByType": null
},
"tags": {},
"type": "Microsoft.Devices/IotHubs"
}
