# MMM-JsonTable
A module for the MagicMirror project which creates a table filled with a list gathered from a json request.

All the variables of the objects in the array are represented by a table column.
For every column it checks if a valid DateTime is given, and then formats it to HH:mm:ss if it is today or YYYY-MM-DD otherwise.

## Example
End result:

![](example.png)

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

## Installation
````
git clone https://github.com/timdows/MMM-JsonTable.git
````

## Config Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| url | "" | The full url to get the json response from |
| arrayName | null | Define the name of the variable that holds the array to display |
| updateInterval | 15000 | Milliseconds between the refersh |