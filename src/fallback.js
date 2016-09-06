var TL = L.TileLayer,
    TLproto = TL.prototype;


var FallbackTileLayer = TL.extend({

	options: {
		minNativeZoom: 0
	},

	initialize: function (urlTemplate, options) {
		TLproto.initialize.call(this, urlTemplate, options);
	},

	_loadTile: function (tile, tilePoint) {
		TLproto._loadTile.call(this, tile, tilePoint);
		tile._originalTilePoint = tilePoint;
		tile._originalSrc = tile.src;
	},

	_tileOnError: function () {
		var layer = this._layer,
		    originalTilePoint = this._originalTilePoint,
		    tilePoint = this._tilePoint = this._tilePoint || L.extend({}, originalTilePoint),
		    fallbackZoom = this._fallbackZoom = (this._fallbackZoom || originalTilePoint.z) - 1,
		    scale = this._fallbackScale = (this._fallbackScale || 1) * 2,
		    tileSize = layer._getTileSize(),
		    newUrl, top, left;

		// If no lower zoom tiles are available, fallback to errorTile.
		if (fallbackZoom < layer.options.minNativeZoom) {
			layer.fire('tileerror', {
				tile: this,
				url: this.src
			});

			newUrl = layer.options.errorTileUrl;
			if (newUrl) {
				this.src = newUrl;
			}

			layer._tileLoaded();
			return;
		}

		// Modify tilePoint for replacement img.
		tilePoint.z = fallbackZoom;
		tilePoint.x = Math.floor(tilePoint.x / 2);
		tilePoint.y = Math.floor(tilePoint.y / 2);

		// Generate new src path.
		newUrl = layer.getTileUrl(tilePoint);

		// Zoom replacement img.
		this.style.width = this.style.height = (tileSize * scale) + 'px';

		// Compute margins to adjust position.
		top = (originalTilePoint.y - tilePoint.y * scale) * tileSize;
		this.style.marginTop = (-top) + 'px';
		left = (originalTilePoint.x - tilePoint.x * scale) * tileSize;
		this.style.marginLeft = (-left) + 'px';

		// Crop (clip) image.
		// `clip` is deprecated, but browsers support for `clip-path: inset()` is far behind.
		// http://caniuse.com/#feat=css-clip-path
		this.style.clip = 'rect(' + top + 'px ' + (left + tileSize) + 'px ' + (top + tileSize) + 'px ' + left + 'px)';

		layer.fire('tilefallback', {
			tile: this,
			url: this._originalSrc,
			urlMissing: this.src,
			urlFallback: newUrl
		});

		this.src = newUrl;
	},

	_resetTile: function (tile) {
		var tileSize = this._getTileSize() + 'px';

		delete tile._originalTilePoint;
		delete tile._fallbackZoom;
		delete tile._fallbackScale;
		tile.style = {
			width: tileSize,
			height: tileSize
		};
	}

});



// Supply with a factory for consistency with Leaflet.
L.tileLayer.fallback = function (urlTemplate, options) {
	return new FallbackTileLayer(urlTemplate, options);
};

