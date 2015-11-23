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
| **L.tileLayer.fallback**( `<ILayer>` parentGroup?, `<ILayer[]>` layersArray? ) | Creates a sub-group with events, optionally given a parent group and an initial array of child layers. |



## License

Leaflet.TileLayer.Fallback is distributed under the [Apache 2.0 License](http://choosealicense.com/licenses/apache-2.0/).
