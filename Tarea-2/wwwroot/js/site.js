const km = 12;
$(document).ready(function () {    
    checkLocation();
});
function checkLocation() {
    if (window.location.pathname === "/") {
        var urlParams = new URLSearchParams(window.location.search);        
        if (urlParams.get("competitor") != null) {            
            $.ajax({
                url: "../Home/RegistrarTiempo",
                success: function (data) {
                    buildMessage("Cambiando ventana\nCargando datos");
                    $("main section").addClass("move");
                    setTimeout(() => {
                        $("main section").after(data);
                        $("main section:last-child").removeClass("disable");
                        setTimeout(() => {
                            $("main section:first-child").remove();
                            loadCompetitor(urlParams.get("competitor"));
                        }, 250);
                    }, 550);
                }
            });
        }
        else
            checkSession();
    }        
    actionClick();
}
function loadCompetitor(competitor) {    
    var flagToFindCompetitor = false;
    $.ajax({
        url: "../Home/CompetitorRegistered",
        method: "post",
        cache: "false",        
        success: function (response) {
            if (response != null) {                
                var object = response.split("*");                
                for (var i = 0; i < object.length - 1; i++) {                    
                    if (object[i].split(",")[0] == competitor) {                                                
                        $("section .contentBody #tbID").val(competitor);
                        $("section .contentBody #tbName").val(object[i].split(",")[1]);
                        flagToFindCompetitor = true;
                        actionClick();
                        closeMessage();
                        break;
                    }
                }
                if (!flagToFindCompetitor)
                    location.href = "/";
            }
            else {
                location.href = "/";
            }
        }
    });
}
function checkSession() {    
    $.ajax({
        url: "../Home/CompetitorRegistered",
        method: "post",
        cache: "false",
        success: function (response) {            
            if (response != null) {                
                var object = response.split("*");
                $(".contentBody table tbody tr").remove();
                for (var i = 0; i < object.length - 1; i++) {                    
                    $(".contentBody table tbody").append(
                        "<tr>" +
                            "<td><a class='link-competitor' href='?competitor=" + object[i].split(",")[0] + "'>" + object[i].split(",")[0] + "</a>" +
                            "<td>" + object[i].split(",")[1] + "</td>" +
                            "<td>" + object[i].split(",")[2] + "</td>" +
                            "<td>" + object[i].split(",")[3] + "</td>" +
                        "</tr>"
                    );
                }
            }
            else {
                buildMessage("Sin competidores registrados");
            }
        }
    });
}
function actionClick() {
    $("#addNew").click(function () {
        location.href = "Home/NuevoCompetidor";
    });
    $("#register").click(function () {
        if (checkValue(""))
            checkIDCompetitor();
    });
    $("#registerTime").click(function () {
        if (checkValue($("#tbMinutes")))
            if (checkValue($("#tbSeconds")))
                calculateTime();
    });
    pressEnter();
}
function pressEnter() {
    $("#tbID,#tbName,#tbMinutes,#tbSeconds").keypress(function (event) {
        if (event.which === 13) {            
            if ($(this).attr("id") == "tbID") {
                if(checkValue($(this)))
                    $("#tbName").focus();                
            }
            else if ($(this).attr("id") == "tbMinutes") {
                if (checkValue($(this)))                  
                    $("#tbSeconds").focus();                
            }
            else if ($(this).attr("id") == "tbSeconds") {
                if (checkValue($(this)))                    
                    calculateTime();                
            }
            else if ($(this).attr("id") == "tbName") {
                if (checkValue($(this))) {
                    checkIDCompetitor();
                }
            }
        }
    });
}
function checkValue(object) {
    var flagToRegister = false;
    if (object == "") {
        if (/^\d+$/.test($("#tbID,#tbMinutes").val())) {            
            if (/^[\w\u00C0-\u017F¨Ññ]+\s[\w\u00C0-\u017F¨Ññ]+$/.test($("#tbName").val()) && $("#tbName").val().trim().split(/\s+/).length === 2) {
                flagToRegister = true;
            }
            else {
                buildMessage("Ingrese el nombre y primer apellido correctamente");
            }
        }
        else
            buildMessage("Solo se admite números enteros");
                        
    }
    else {
        if ($(object).attr("id") == "tbID" || $(object).attr("id") == "tbMinutes" || $(object).attr("id") == "tbSeconds") {
            if (/^\d+$/.test($(object).val())) {
                flagToRegister = true;
            }
            else {
                buildMessage("Solo se admite números enteros");
            }
        }
        else if ($(object).attr("id") == "tbName") {
            if (/^[\w\u00C0-\u017F¨Ññ]+\s[\w\u00C0-\u017F¨Ññ]+$/.test($(object).val()) && $(object).val().trim().split(/\s+/).length === 2) {
                flagToRegister = true;
            }
            else {
                buildMessage("Ingrese el nombre y primer apellido correctamente");

            }
        }
    }
    return flagToRegister;
}
function calculateTime() {    
    buildMessage("Calculando el tiempo contra los metros por segundo");
    var temp = "";
    var distance = 0;
    if (parseInt($("#tbMinutes").val()) == 0 && parseInt($("#tbSeconds").val()) == 0) {
        distance = 0;
    }
    else {
        distance = (parseInt($("#tbMinutes").val()) * 60) + (parseInt($("#tbSeconds").val()));
        distance = ((parseInt(km) * 1000) / parseInt(distance)).toFixed(2);    
    }
    $.ajax({
        url: "../Home/CompetitorRegistered",
        method: "post",
        cache: "false",
        success: function (response) {
            if (response != null) {
                var object = response.split("*");
                for (var i = 0; i < object.length - 1; i++) {
                    if (object[i].split(",")[0] == $("#tbID").val()) {
                        temp += object[i].split(",")[0] + ", " + object[i].split(",")[1] + ", " + $("#tbMinutes").val() + ":" + $("#tbSeconds").val() + ", ";
                        temp += distance + "*";
                    }
                    else {
                        temp += object[i] + "*";
                    }
                }
                registerTime(temp);
            }
        }
    });
}
function registerTime(competitor) {
    $.ajax({
        url: "../Home/RegisterTime",
        method: "post",
        cache: "false",
        data: { info: competitor },
        success: function (response) {
            location.href = "/";
        }
    });
}
function checkIDCompetitor() {
    var flagToFindCompetitor = false;
    buildMessage("Verificando si el ID ya se encuentra en uso");
    $.ajax({
        url: "../Home/CompetitorRegistered",
        method: "post",
        cache: "false",
        success: function (response) {
            if (response != null) {
                var object = response.split("*");
                for (var i = 0; i < object.length - 1; i++) {
                    if (object[i].split(",")[0] == $("#tbID").val()) {
                        flagToFindCompetitor = true;                        
                        buildMessage("ID en uso");
                        break;
                    }
                }
                if (!flagToFindCompetitor) {
                    registerCompetitor();
                }
            }
            else if (response == null)
                registerCompetitor();
        }
    });
}
function registerCompetitor() {
    
    $.ajax({
        url: "../Home/NewCompetitor",
        method: "post",
        cache: "false",
        data: {
            userID: $("#tbID").val(),
            userName: $("#tbName").val()
        },
        success: function () {
            buildMessage("Registro exitoso!");
            $("#tbID,#tbName").val(null);
            setTimeout(() => {
                closeMessage();
                setTimeout(() => {
                    buildMessage("Redireccionando al inicio");
                    setTimeout(() => {
                        location.href = "/";
                    }, 750)
                }, 250);
            }, 500);
        }
    });
}