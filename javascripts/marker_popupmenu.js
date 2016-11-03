function popup_content_string(sitename, observername, lat, lng){
    var popup_content ='<span>[Site Name]&nbsp'+sitename+'</span><br><br>'
                      +'<span>[Location] </span><br>'
                      +'<span>&nbsp&nbsp Latitude : '+lat+'</span><br>'
                      +'<span>&nbsp&nbsp Longitude : '+lng+'</span><br><br>'
                      +'<span>[Observer]&nbsp'+observername+'</span>'
                      +'<br><br>'
                      +'<span>[Measurement Time]</span><br>'
                      +'<span id="start_time"></span><br>'
                      +'<span id="end_time"></span><br>'
                      +'<br>'
                      +'<progress id="progressbar" max="900" value="0" ></progress><br>'
                      +'<br>'
                      +'<button type="button" id="start_button" onClick="StartTimer()">START</button>&nbsp&nbsp'
                      +'<button type="button" id="end_button" onClick="EndProcess()" disabled >END</button>&nbsp&nbsp&nbsp&nbsp'
                      +'<button type="button" id="close_button" >CLOSE</button>&nbsp&nbsp'
                      +'<button type="submit" id="save_button" disabled >SAVE</button>';

    return popup_content;
}

function StartTimer(){
    var start_time = new Date();
    var year = start_time.getFullYear();
    var month = start_time.getMonth() + 1;
    var day = start_time.getDate();
    var start_hour = start_time.getHours();
    var start_minute = start_time.getMinutes();

    
    var end_hour = start_hour;
    var end_minute = start_minute + 15;
    if (end_minute >= 60){
        end_minute = end_minute - 60;
        end_hour = end_hour + 1;
    }
    
    str_start_hour = (("00")+start_hour).substr(-2)
    str_start_minute = (("00")+start_minute).substr(-2)
    str_end_hour = (("00")+end_hour).substr(-2)
    str_end_minute = (("00")+end_minute).substr(-2)

    //--- display start & end time ---
    var display_string0 = '&nbsp&nbspStart Time : '+year+'/'+month+'/'+day+' '+str_start_hour+':'+str_start_minute;
    document.getElementById("start_time").innerHTML = display_string0;
    var display_string1 = '&nbsp&nbspEnd Time &nbsp: '+year+'/'+month+'/'+day+' '+str_end_hour+':'+str_end_minute+'(schedule)';
    document.getElementById("end_time").innerHTML = display_string1;

    //--- start timer ---
    TimerStart();

    //--- change button attribute ---
    document.getElementById("start_button").disabled = true;
    document.getElementById("end_button").disabled = false;
//    document.getElementById("save_button").disabled = false;
}

function EndProcess(){
    //--- change button attribute ---
    document.getElementById("start_button").disabled = false;
    document.getElementById("end_button").disabled = true;
    document.getElementById("save_button").disabled = false;

    var end_time = new Date();
    var year = end_time.getFullYear();
    var month = end_time.getMonth() + 1;
    var day = end_time.getDate();
    var end_hour = end_time.getHours();
    var end_minute = end_time.getMinutes();

    str_end_hour = (("00")+end_hour).substr(-2)
    str_end_minute = (("00")+end_minute).substr(-2)

    //--- display start & end time ---
    var display_string1 = '&nbsp&nbspEnd Time &nbsp: '+year+'/'+month+'/'+day+' '+str_end_hour+':'+str_end_minute;
    document.getElementById("end_time").innerHTML = display_string1;
}

function TimerStart(){
    var progressBar = document.getElementById('progressbar');
    var maxValue = document.getElementById('progressbar').max;
    progressBar.value = 0;

    var timerID = setInterval(function(){
        
        progressBar.value = progressBar.value+1;
        if (progressBar.value == maxValue){
            clearInterval(timerID);
        }

    }, 10);
}

