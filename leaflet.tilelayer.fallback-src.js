/**
 * Leaflet.TileLayer.Fallback replaces missing Tiles (404 error) by scaled
 * lower zoom Tiles.
 *
 * Copyright 2015 Boris Seang
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['leaflet'], function (L) {
			return (root.L.TileLayer.Fallback = factory(L));
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('leaflet'));
	} else {
		root.L.TileLayer.Fallback = factory(root.L);
	}
}(this, function (L) {

	var TL = L.TileLayer,
	    TLproto = TL.prototype;


	var FallbackTileLayer = TL.extend({

		statics: {
			version: '0.1.0'
		},

		options: {
			minNativeZoom: 0
		},

		initialize: function (urlTemplate, options) {
			TLproto.initialize.call(this, urlTemplate, options);
		},

		_loadTile: function (tile, tilePoint) {
			TLproto._loadTile.call(this, tile, tilePoint);
			tile._originalTilePoint = tilePoint;
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
			newUrl = L.Util.template(layer._url, L.extend({
				s: layer._getSubdomain(tilePoint),
				z: tilePoint.z,
				x: tilePoint.x,
				y: tilePoint.y
			}, layer.options));

			// Zoom replacement img.
			this.style.width = this.style.height = (tileSize * scale) + 'px';

			// Compute margins to adjust position.
			top = (originalTilePoint.y - tilePoint.y * scale) * tileSize;
			this.style.marginTop = (-top) + 'px';
			left = (originalTilePoint.x - tilePoint.x * scale) * tileSize;
			this.style.marginLeft = (-left) + 'px';

			// Crop (clip) image.
			// clip-path browsers support is not wide enough. http://caniuse.com/#feat=css-clip-path
			this.style.clip = 'rect(' + top + 'px ' + (left + tileSize) + 'px ' + (top + tileSize) + 'px ' + left + 'px)';

			this.src = newUrl || layer.options.errorTileUrl || this.src;
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
		return new TL.Fallback(urlTemplate, options);
	};

	// Just return a value to define the module export.
	return FallbackTileLayer;
}));
