# Leaflet.TileLayer.Fallback

Replaces missing Tiles (404 error) by scaled lower zoom Tiles.

[Leaflet](http://leafletjs.com/) is the leading open-source JavaScript library
for mobile-friendly interactive maps.

Current TileLayer.Fallback version: 0.1.0



## Requirements

- Leaflet stable (0.7.x)



## Usage instructions

HTML:
```html
<!-- add TileLayer.Fallback script after Leaflet -->
<script src="leaflet.tilelayer.fallback-src.js"></script>
```

JavaScript:
```javascript
var myTileLayer = L.tileLayer.fallback(url, options);
```

Now missing tiles will be automatically replaced by scaled up tiles from lower zoom levels.


### Installing the plugin

Simply add the "leaflet.tileLayer.fallback-src.js" script file to your page after
Leaflet script (whether in the HTML head or body).


### Creation

Simply use the `L.tileLayer.fallback` factory instead of your regular `L.tileLayer`:

```javascript
var myTileLayer = L.tileLayer.fallback(url, options);

myTileLayer.addTo(map);
```



## API Reference

### Creation

| Factory | Description |
| :------ | :---------- |
| **L.tileLayer.fallback**( `<String>` urlTemplate, `<TileLayer options>` options? ) | Instantiates a tile layer object given a [URL template](http://leafletjs.com/reference.html#url-template) and optionally an options object. When tile images return a 404 error, they are replaced by a scaled up tile from lower zoom. |


### Options

| Option | Type | Default | Description |
| :----- | :--- | :------ | :---------- |
| **minNativeZoom** | `Number` | 0 | Minimum zoom number the tiles source has available. If tiles are missing down to that zoom level (included), they will be replaced by the standard Error Tile (specified by `errorTileUrl`). |


### Events

| Event | Data | Description |
| :---- | :--- | :---------- |
| **tilefallback** | `TileFallbackEvent` | Fired when a tile is being replaced by a scaled up tile of lower zoom. |

#### TileFallbackEvent

| Property | Type | Description |
| :------- | :--- | :---------- |
| `tile` | `HTMLElement` | The tile element (image). |
| `url` | `String` | The **original** source URL of the tile (before any fallback is applied). |
| `urlMissing` | `String` | The missing source URL of the tile (possibly after a few fallback attempts). |
| `urlFallback` | `String` | The fallback source URL of the tile (which may turn out to be also missing). |


### Methods

Leaflet.TileLayer.Fallback does not provide any extra method beyond what
[L.TileLayer](http://leafletjs.com/reference.html#tilelayer) already provides.



## License

Leaflet.TileLayer.Fallback is distributed under the [Apache 2.0 License](http://choosealicense.com/licenses/apache-2.0/).
