# MMM-JsonTable
A module for the MagicMirror project which creates a table filled with a list gathered from a json request.

All the variables of the objects in the array are represented by a table column.
For every column it checks if a valid DateTime is given, and then formats it to HH:mm:ss if it is today or YYYY-MM-DD otherwise.

## Installation
````
git clone https://github.com/timdows/MMM-JsonTable.git
````

## Config Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| url | "" | The full url to get the json response from |
| arrayName | null | Define the name of the variable that holds the array to display |
| keepColumns | [] | Columns on json will be showed |
| tryFormatDate | false | For every column it checks if a valid DateTime is given, and then formats it to HH:mm:ss if it is today or YYYY-MM-DD otherwise |
| size | 0-3 | Text size at table, 0 is default, and 3 is H3 |
| updateInterval | 15000 | Milliseconds between the refersh |
| descriptiveRow | "" | Complete html table row that will be added above the array data |

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

## Example 2

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

## Example 3 (with font awesome icons)

![](https://user-images.githubusercontent.com/1011699/53985507-104ecc00-411c-11e9-9ca4-c994f0ae62e1.png)

Raw json response:

```json
{
   "cups":[  
      {  
         "icon":"fa-calendar",
         "data":"Senaste bryggning",
         "value":"2019-03-07",
         "type":""
      },
      {  
         "icon":"fa-clock-o",
         "data":"Klockan",
         "value":"17:32:06",
         "type":""
      },
      {  
         "icon":"fa-coffee",
         "data":"Totalt antal bryggda koppar",
         "value":60,
         "type":"st"
      },
      ...
   ]
}
```

## Example 4 (with descriptive row)

![](example4.png)

Raw json response:

```json
{
   "deviceKwhUsages":[  
      {
      "name": "Studie - MainDown",
      "today": 0,
      "todayFormatted": "0",
      "thisWeek": 1.27,
      "thisWeekFormatted": "1,27",
      "lastWeek": 7,
      "lastWeekFormatted": "7,00",
      "thisMonth": 17.41,
      "thisMonthFormatted": "17,41",
      "lastMonth": 30.58,
      "tLastMonthFormatted": "30,58"
    },
    {
      "name": "BoilerPower",
      "today": 0,
      "todayFormatted": "0",
      "thisWeek": 1.9,
      "thisWeekFormatted": "1,90",
      "lastWeek": 13.3,
      "lastWeekFormatted": "13,30",
      "thisMonth": 30.44,
      "thisMonthFormatted": "30,44",
      "lastMonth": 54.99,
      "tLastMonthFormatted": "54,99"
    },
      ...
   ]
}
```

Configuration:

```javascript
{
	module: 'MMM-JsonTable',
	position: 'top_right',
	header: 'HouseDB Kwh Statistics',
	config: {
		url: 'https://xyz/abc/get.json',
		arrayName: 'deviceKwhUsages',
		descriptiveRow: '<tr><td>Name</td><td>Today</td><td>ThisWeek</td><td>LastWeek</td><td>ThisMonth</td><td>LastMonth</td></tr>'
	}
}
```
