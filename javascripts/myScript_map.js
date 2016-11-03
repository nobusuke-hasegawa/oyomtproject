var map;
var markers;
var curr_marker;
var curr_marker_status = 0;

var siteIcon = L.icon({
        iconUrl: '/img/Map-Marker-Ball-Right-Azure-icon.png',
        iconSize: [32, 32],
        iconAnchor: [13, 40],
        popupAnchor: [0, -32]
});

var currentPosIcon = L.icon({
        iconUrl: '/img/marker-xxl.png',
        iconSize: [32, 32],
        iconAnchor: [13, 40],
        popupAnchor: [0, -32]
});
                

$( document ).on( "pageinit", "#map", function( event ) {

//    map = L.map('map_canvas');

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


function projectSend() {
    var button_status = 'send_project_info';
    var radioList = document.getElementsByName("radioProject");

    if(radioList[0].checked){
        alert("HERE-0");
    }
    if(radioList[1].checked){
        var project = $("#selectProject").val();
        draw_map(project);
    }
    if(radioList[2].checked){
        var project = $("#joinProject").val();
        draw_map(project);
    }
    if(radioList[3].checked){
        var project = document.getElementById("create_project").value;
        var file = document.querySelector('#listObsPoints').files[0];

        var button_status = "send_obspointlist";
        var reader = new FileReader();

        reader.onload = function(){
//            alert(reader.result)
            var json_data = { button_status: button_status, project: project, sitelist: file.name, obs_cntl_file: reader.result };

            $.ajax({
                url: "/",
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(json_data),
                success: function(data) {
                    if (data.status == "1") {
                        draw_map(project);
                    } else if (data.status == "9") {
                        alert("something wrong");
                    }
                }
            });
        }
        reader.readAsText(file);

    }

//    var str = JSON.stringify(json_data);
//    alert(str);

}

//---------------------------------------
//    select project & draw map
//---------------------------------------
function draw_map(project){
    var button_status = "select_project";
    var userid = window.localStorage.getItem("userid");
    var json_data = { "button_status": button_status, "userid": userid, "project": project };

    $.ajax({
        url: "/",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(json_data),
        success: function(data) {
 
            if (data.status == "1") {
                map = L.map('map_canvas');
//                var arr1 = data.sitelist.split(/\r\n|\r|\n/);
//                var arr1 = JSON.parse(data.sitesdata)
                var sitesdata = JSON.parse(data.sitesdata)
                var LatLng;
                var username = window.localStorage.getItem("username");
                for (var key in sitesdata){
                    var sitename = key;
                    var lng = sitesdata[key]["longitude"];
                    var lat = sitesdata[key]["latitude"];
                    LatLng = new L.LatLng(lat, lng);

                    marker = L.marker(LatLng, { icon: siteIcon, title: sitename, draggable: true } )
                                .bindPopup(popup_content_string(sitename, username, lat, lng))
                                .addTo(map);
                }

                if (navigator.geolocation ){
//                    alert("You can get current position");
                    watchCurrPosition_start();
                }
                $('body').pagecontainer('change', '#map' );
            } else if (data.status == "9") {
                  alert("can not find project name : " + project);
            }
        }
    });
        
}


//---------------------------------------
//    get current position
//---------------------------------------
function watchCurrPosition_start(){
    var id, target, options;

    function success(pos) {
        var crd = pos.coords;

        LatLng = new L.LatLng(crd.latitude, crd.longitude);
        alert("curr_marker_status = " + curr_marker_status + " , " + LatLng);

        if (curr_marker_status == 0){
            curr_marker = L.marker(LatLng, { icon: currentPosIcon }).addTo(map);
            curr_marker_status = 1;
        }else{
             curr_marker.setLatLng(LatLng); 
        }
        map.setView(LatLng);
        L.resizer().addTo(map);

//        if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
//            console.log('Congratulations, you reached the target');
//            navigator.geolocation.clearWatch(id);
//        } else {
//
//        }
    };

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    target = {
        latitude : 0,
        longitude: 0,
    }

    options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    id = navigator.geolocation.watchPosition(success, error, options);    

//    navigator.geolocation.getCurrentPosition(function(pos) {
//                            alert("Latitude : " + pos.coords.latitude + " Longitude : " + pos.coords.longitude);
//                            currentPos = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
//                            marker = L.marker(LatLng, { icon: currentPosIcon }).addTo(map);
//                            map.setView(currentPos, 16);
//                        });
}

function onMouseDblClick(e){
    alert(this.getLatLng());
//    $('body').pagecontainer('change', '#login' );
}