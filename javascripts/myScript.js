var SiteLocationData;

function loginData() {
    var button_status = 'login';
    var user_id = document.getElementById('userID').value;
    var user_pw = document.getElementById("userPW").value;

    var json_data = { button_status: button_status, user_id: user_id, user_pw: user_pw }
//
//    var str = JSON.stringify(json_data);
//    alert(str);

    $.ajax({
        url: "/",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(json_data),
        success: function(data) {
            if (data.status == "1") {
                //--- set select menu option ---
                var optItem = ''
                for (var i = 0; i < data.projects.length; i++){
                    optItem +=
                      '<option value"' + data.projects[i] + '">' + data.projects[i] + '</opton>';
                }
                $('#selectProject').append(optItem);

                //--- local storage (username) ---
                window.localStorage.setItem('username', data.username);
                window.localStorage.setItem('userid', user_id);

                //--- move to select project page ---
                $('body').pagecontainer('change', '#select_project' );
            } else if (data.status == "2") {
                alert("does not match your password.");
            } else {
                alert("can not find your ID.");
            }
        }
    });
}

function accountSend() {
    var button_status = 'account';
    var user_nm = document.getElementById('new_userName').value;
    var user_pw = document.getElementById("new_userPW").value;
    var user_id = document.getElementById("new_userMail").value;

    var json_data = { button_status: button_status, user_id: user_id, user_nm: user_nm ,user_pw: user_pw }

    var str = JSON.stringify(json_data);

    $.ajax({
        url: "/",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(json_data),
        success: function(data) {
            if (data.status == "1") {
                $('body').pagecontainer('change', '#select_project' );
            } else if (data.status == "9") {
                alert("already exit your ID");
                $('body').pagecontainer('change', '#login' );
            }
        }
    });

}

function passwordSend() {
    //
    // I don't know the method to set up mail server'
    //
    var button_status = 'send_password';
    var user_id = document.getElementById("exist_userMail").value;

    var json_data = { button_status: button_status, user_id: user_id }

//    var str = JSON.stringify(json_data);
//    alert(str);

    $.ajax({
        url: "/",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(json_data),
        success: function(data) {
            if (data.status == "1") {
                $('body').pagecontainer('change', '#select_project' );
            } else if (data.status == "9") {
                alert("can not find your ID");
                $('body').pagecontainer('change', '#login' );
            }
        }
    });

}

