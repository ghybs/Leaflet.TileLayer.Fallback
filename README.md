# Leaflet.TileLayer.Fallback

Plugin for Leaflet. Replaces missing Tiles (404 error) by scaled lower zoom Tiles.

[Leaflet](http://leafletjs.com/) is the leading open-source JavaScript library
for mobile-friendly interactive maps.

Current TileLayer.Fallback version: 0.1.1 (for Leaflet 0.7)



## Requirements

- Leaflet stable (0.7.x)
- For Leaflet 1.0, use the [`master` branch](https://github.com/ghybs/Leaflet.TileLayer.Fallback/)



## Demo
[TileLayer.Fallback demonstration page](http://ghybs.github.io/Leaflet.TileLayer.Fallback/examples/tileLayerFallback-demo.html)



## Usage instructions

### Quick Guide

**HTML:**

```html
<!-- add TileLayer.Fallback script after Leaflet -->
<script src="leaflet.tilelayer.fallback.js"></script>
```

**JavaScript:**

```javascript
var myTileLayer = L.tileLayer.fallback(url, options);
```

Now missing tiles will be automatically replaced by scaled up tiles from lower zoom levels.


### Installing the plugin

#### Local copy
1. Download the `leaflet.tilelayer.fallback.js` file.
2. Place the file alongside your page.
3. Add the `script` tag (see [Quick Guide > HTML](#quick-guide)) to your page after Leaflet script.

#### CDN
You can alternatively use the free [RawGit](https://rawgit.com/) CDN service, but keep in mind that there are [no uptime or support guarantees](https://rawgit.com/faq#no-uptime-guarantee).

```html
<!-- After Leaflet script -->
<script src="https://cdn.rawgit.com/ghybs/Leaflet.TileLayer.Fallback/v0.1.1/dist/leaflet.tilelayer.fallback.js"></script>
```



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
| **L.tileLayer.fallback**( `<String>` [urlTemplate](http://leafletjs.com/reference.html#url-template), [`<TileLayer options>`](#options) options? ) | Instantiates a tile layer object given a [URL template](http://leafletjs.com/reference.html#url-template) and optionally an options object. When tile images return a 404 error, they are replaced by a scaled up tile from lower zoom. |


### Options

| Option | Type | Default | Description |
| :----- | :--- | :------ | :---------- |
| **minNativeZoom** | `Number` | 0 | Minimum zoom number the tiles source has available. If tiles are missing down to that zoom level (included), they will be replaced by the standard Error Tile (specified by [`errorTileUrl`](http://leafletjs.com/reference.html#tilelayer-errortileurl)). |

All other [TileLayer options](http://leafletjs.com/reference.html#tilelayer-options) are applicable.


### Events

| Event | Data | Description |
| :---- | :--- | :---------- |
| **tilefallback** | [`TileFallbackEvent`](#tilefallbackevent) | Fired when a tile is being replaced by a scaled up tile of lower zoom. |

All other [TileLayer events](http://leafletjs.com/reference.html#tilelayer-loading) are applicable.


#### TileFallbackEvent

| Property | Type | Description |
| :------- | :--- | :---------- |
| `tile` | `HTMLElement` | The tile element (image). |
| `url` | `String` | The **original** source URL of the tile (before any fallback is applied). |
| `urlMissing` | `String` | The missing source URL of the tile (possibly after a few fallback attempts). |
| `urlFallback` | `String` | The fallback source URL of the tile (which may turn out to be also missing). |


### Methods

All regular [TileLayer methods](http://leafletjs.com/reference.html#tilelayer-addto) are applicable.



## Limitations
TileLayer.Fallback plugin tries to replace each missing tile by its immediate
lower zoom equivalent, and if that one is also missing, it goes to lower zoom
again; and so on until a tile image is returned by the server, or it reaches
[`minNativeZoom`](#options).

That means it has to wait for the server to return a 404 error before attempting
to replace the tile by a lower zoom equivalent. If several zoom levels are
missing, it has to wait as many times as the number of missing zooms. Therefore,
the more missing zoom levels, the more time it takes to replace a tile.



## License

Leaflet.TileLayer.Fallback is distributed under the [Apache 2.0 License](http://choosealicense.com/licenses/apache-2.0/).
