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

		/**
		 * Instantiates a FallbackTileLayer.
		 */
		initialize: function (urlTemplate, options) {
			TLproto.initialize.call(this, urlTemplate, options);
		},

		_loadTile: function (tile, tilePoint) {
			TLproto._loadTile.call(this, tile, tilePoint);
			this._originalTilePoint = tilePoint;
		},

		_tileOnError: function () {
			var layer = this._layer,
				originalTilePoint = this._originalTilePoint,
				tilePoint = this._tilePoint,
				fallbackZoom = this._fallbackZoom = (this._fallbackZoom || this._originalTilePoint.z) - 1,
				scale = (this._scale || 1) * 2,
				newUrl;

			if (fallbackZoom < this.options.minNativeZoom) {
				layer.fire('tileerror', {
					tile: this,
					url: this.src
				});

				newUrl = layer.options.errorTileUrl;
				if (newUrl) {
					this.src = newUrl;
				}

				layer._tileLoaded();
			}

			// NEW FROM HERE.
			var zxy = (/\/(\d+)\/(\d+)\/(\d+)\.(?:[a-zA-Z0-9])+/i).exec(this.src),
			    tileSize = layer._getTileSize();

			if (zxy && zxy.length && zxy.length >= 4) {
				// Keep original zxy coordinates.
				this.origin = this.origin || {
						z: zxy[1],
						x: zxy[2],
						y: zxy[3]
					};
				// Compute new zxy coordinates for replacement img.
				zxy = {
					z: zxy[1] - 1,
					x: Math.floor(zxy[2] / 2),
					y: Math.floor(zxy[3] / 2)
				};
				// Generate new src path.
				if (zxy) {
					newUrl = L.Util.template(layer._url, L.extend({
						s: layer.options.subdomains[0],
						z: zxy.z,
						x: zxy.x,
						y: zxy.y
					}, layer.options));
				}

				// Keep track of total scale, used for margins computation.
				this.scale = (this.scale || 1) * 2;
				// Zoom replacement img.
				this.style.width =
					this.style.height = (tileSize * this.scale) + 'px';

				// Compute margins to adjust position.
				this.style.marginLeft =
					(((zxy.x * this.scale) - this.origin.x) * tileSize) + 'px';
				this.style.marginTop =
					(((zxy.y * this.scale) - this.origin.y) * tileSize) + 'px';
			}

			this.src = newUrl || layer.options.errorTileUrl || this.src;

			// NEW UP TO HERE.

			layer._tileLoaded();
		}



	});



	// Supply with a factory for consistency with Leaflet.
	L.tileLayer.fallback = function (urlTemplate, options) {
		return new TL.Fallback(urlTemplate, options);
	};

	// Just return a value to define the module export.
	return FallbackTileLayer;
}));
