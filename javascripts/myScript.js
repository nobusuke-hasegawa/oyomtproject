function loginInfoSend() {

    var button_status = 'login';
    var user_id = document.getElementById('userID').value;
    var user_pw = document.getElementById("userPW").value;

    var json_data = { button_status: button_status, user_id: user_id, user_pw: user_pw }

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
                var optItem = ''
 //               alert(data.projects.length);
 
                for (var i = 0; i < data.projects.length; i++){
                    optItem +=
                      '<option value"' + data.projects[i] + '">' + data.projects[i] + '</opton>';
                }
                $('#selectProject').append(optItem);


                $('body').pagecontainer('change', '#select_project' );
            } else if (data.status == "2") {
                alert("does not match your password.");
//                alert(data.comment);
//                $('#loginPage_comment').val(data.comment);
            } else {
                alert("can not find your ID.");
            }
        }
    });

//    if (window.confirm('実行しますか？')) {
//        document.frm.submit();
//     } else {
//        return false;
//     }
}

function accountInfoSend() {

    var button_status = 'account';
    var user_nm = document.getElementById('new_userName').value;
    var user_pw = document.getElementById("new_userPW").value;
    var user_id = document.getElementById("new_userMail").value;

    var json_data = { button_status: button_status, user_id: user_id, user_nm: user_nm ,user_pw: user_pw }

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

function projectInfoSend() {

    var button_status = 'send_project_info';

    var radioList = document.getElementsByName("radioProject");

    if(radioList[0].checked){
        alert("HERE-0");
    }
    if(radioList[1].checked){
        alert("HERE-1");
    }
    if(radioList[2].checked){
        alert("HERE-2");
    }
    if(radioList[3].checked){
        var project = document.getElementById("create_project").value;
        var file = document.querySelector('#listObsPoints').files[0];
//        alert(file.name);

        var button_status = "send_obspointlist";
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(){
            var json_data = { button_status: button_status, project: project, data: reader.result };

            $.ajax({
                url: "/",
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(json_data),
//                success: function(data) {
//                    if (data.status == "1") {
//                        $('body').pagecontainer('change', '#select_project' );
//                    } else if (data.status == "9") {
//                        alert("can not find your ID");
//                        $('body').pagecontainer('change', '#login' );
//                    }
//                }
            });
        }
//        alert("HRER-3")
    }



//    var str = JSON.stringify(json_data);
//    alert(str);


}
