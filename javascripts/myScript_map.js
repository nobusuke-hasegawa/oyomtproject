var map;

$( document ).on( "pageinit", "#map", function( event ) {

    map = L.map('map_canvas');

    L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
		    maxZoom: 18,
                    crs: L.CRS.EPSG4326
		}
    ).addTo(map);

    map.setView([27.7336, 85.3080], 16);

    setTimeout(function(){ map.invalidateSize()}, 400);

});

$( document ).on( "pageshow", "#map", function( event ) {
    
    map.setView([27.7336, 85.3080], 16);
    L.resizer().addTo(map);

});

