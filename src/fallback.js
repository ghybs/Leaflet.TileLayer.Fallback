L.TileLayer.Fallback = L.TileLayer.extend({

	options: {
		minNativeZoom: 0
	},

	initialize: function (urlTemplate, options) {
		L.TileLayer.prototype.initialize.call(this, urlTemplate, options);
	},

	createTile: function (coords, done) {
		var tile = L.TileLayer.prototype.createTile.call(this, coords, done);
		tile._originalCoords = coords;
		tile._originalSrc = tile.src;

		return tile;
	},

	_createCurrentCoords: function (originalCoords) {
		var currentCoords = this._wrapCoords(originalCoords);

		currentCoords.fallback = true;

		return currentCoords;
	},

	_originalTileOnError: L.TileLayer.prototype._tileOnError,

	_tileOnError: function (done, tile, e) {
		var layer = this, // `this` is bound to the Tile Layer in L.TileLayer.prototype.createTile.
		    originalCoords = tile._originalCoords,
		    currentCoords = tile._currentCoords = tile._currentCoords || layer._createCurrentCoords(originalCoords),
		    fallbackZoom = tile._fallbackZoom = tile._fallbackZoom === undefined ? originalCoords.z - 1 : tile._fallbackZoom - 1,
		    scale = tile._fallbackScale = (tile._fallbackScale || 1) * 2,
		    tileSize = layer.getTileSize(),
		    style = tile.style,
		    newUrl, top, left;

		// If no lower zoom tiles are available, fallback to errorTile.
		if (fallbackZoom < layer.options.minNativeZoom) {
			return this._originalTileOnError(done, tile, e);
		}

		// Modify tilePoint for replacement img.
		currentCoords.z = fallbackZoom;
		currentCoords.x = Math.floor(currentCoords.x / 2);
		currentCoords.y = Math.floor(currentCoords.y / 2);

		// Generate new src path.
		var originalZoom = layer._tileZoom;
		layer._tileZoom = currentCoords.z;
		newUrl = layer.getTileUrl(currentCoords);
		layer._tileZoom = originalZoom;

		// Zoom replacement img.
		style.width = (tileSize.x * scale) + 'px';
		style.height = (tileSize.y * scale) + 'px';

		// Compute margins to adjust position.
		top = (originalCoords.y - currentCoords.y * scale) * tileSize.y;
		style.marginTop = (-top) + 'px';
		left = (originalCoords.x - currentCoords.x * scale) * tileSize.x;
		style.marginLeft = (-left) + 'px';

		// Crop (clip) image.
		// `clip` is deprecated, but browsers support for `clip-path: inset()` is far behind.
		// http://caniuse.com/#feat=css-clip-path
		style.clip = 'rect(' + top + 'px ' + (left + tileSize.x) + 'px ' + (top + tileSize.y) + 'px ' + left + 'px)';

		layer.fire('tilefallback', {
			tile: tile,
			url: tile._originalSrc,
			urlMissing: tile.src,
			urlFallback: newUrl
		});

		tile.src = newUrl;
	}

});



// Supply with a factory for consistency with Leaflet.
L.tileLayer.fallback = function (urlTemplate, options) {
	return new L.TileLayer.Fallback(urlTemplate, options);
};
