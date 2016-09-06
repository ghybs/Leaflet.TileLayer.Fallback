module.exports = {

    ///////////////////////////
    before:
    ///////////////////////////
'(function (root, factory) {\n' +
'    if (typeof define === "function" && define.amd) {\n' +
'        define(["leaflet"], function (L) {\n' +
'            return (root.L.TileLayer.Fallback = factory(L));\n' +
'        });\n' +
'    } else if (typeof module === "object" && module.exports) {\n' +
'        module.exports = factory(require("leaflet"));\n' +
'    } else {\n' +
'        root.L.TileLayer.Fallback = factory(root.L);\n' +
'    }\n' +
'}(this, function (L) {\n\n',


    ///////////////////////////
    after:
    ///////////////////////////
'\n    return FallbackTileLayer;\n' + // Must be the same identifier as in src!
'\n' +
'}));\n'

};
