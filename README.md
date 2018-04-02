# MMM-JsonTable
A module for the MagicMirror project which creates a table filled with a list gathered from a json request.

All the variables of the objects in the array are represented by a table column.
For every column it checks if a valid DateTime is given, and then formats it to HH:mm:ss if it is today or YYYY-MM-DD otherwise.

## Example 1
End result:

![](example1.png)

Raw json response:

```json
{
    "items": [
        {
            "name": "Watt",
            "value": "270 Watt"
        },
        {
            "name": "Today",
            "value": "5.85 kWh"
        },
        {
            "name": "ThisWeek",
            "value": "5.83 kWh"
        },
        {
            "name": "ThisMonth",
            "value": "12.8 kWh"
        },
        {
            "name": "LastMonth",
            "value": "246.75 kWh"
        }
    ]
}
```

Configuration:

```javascript
{
	module: 'MMM-JsonTable',
	position: 'top_right',
	header: 'HouseDB Sevensegment',
	config: {
		url: 'https://xyz/abc/get.json', // Required
		arrayName: 'items' // Optional
	}
}
```

## Example 1

![](example2.png)

Raw json response:

```json
{
    "currentUsages": [
        {
            "deviceName": "P1",
            "currentWattValue": 180,
            "todayKwhUsage": 5.902,
            "lastUpdate": "2018-04-02T18:12:06Z"
        },
        {
            "deviceName": "Studie - MainDown",
            "currentWattValue": 76,
            "todayKwhUsage": 0.46,
            "lastUpdate": "2018-04-02T18:06:52Z"
        },
        {
            "deviceName": "BoilerPower",
            "currentWattValue": 0,
            "todayKwhUsage": 2.21,
            "lastUpdate": "2018-04-02T17:30:01Z"
        },
        {
            "deviceName": "Koelkast",
            "currentWattValue": 1.3,
            "todayKwhUsage": 0.55,
            "lastUpdate": "2018-04-02T18:09:55Z"
        },
        {
            "deviceName": "Vaatwasser",
            "currentWattValue": 0.5,
            "todayKwhUsage": 0.01,
            "lastUpdate": "2018-04-02T18:10:51Z"
        },
        {
            "deviceName": "Wasmachine",
            "currentWattValue": 0,
            "todayKwhUsage": 0,
            "lastUpdate": "2018-04-02T18:12:06Z"
        }
    ]
}
```

Configuration:

```javascript
{
	module: 'MMM-JsonTable',
	position: 'top_right',
	header: 'HouseDB Current Usages',
	config: {
		url: 'https://xyz/abc/get.json', // Required
		arrayName: 'currentUsages', // Optional
		tryFormatDate: true
	}
}
```

## Installation
````
git clone https://github.com/timdows/MMM-JsonTable.git
````

## Config Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| url | "" | The full url to get the json response from |
| arrayName | null | Define the name of the variable that holds the array to display |
| tryFormatDate | false | For every column it checks if a valid DateTime is given, and then formats it to HH:mm:ss if it is today or YYYY-MM-DD otherwise |
| updateInterval | 15000 | Milliseconds between the refersh |