$(document).ready(function(){
    closeMessage();        
});
function buildMessage(message) {
    /*$(".contentPopUp .boxPopUp .leftPopUp h5").remove();*/
    if(message.includes("\n")){
        for(var i = 0; i < message.split("\n").length;i++){
            if(i == 0)
                $(".contentPopUp .boxPopUp .leftPopUp").append("<h5>"+message.split("\n")[i]+"</h5>");
            else
                $(".contentPopUp .boxPopUp .leftPopUp h5:last-child").after("<h5>"+message.split("\n")[i]+"</h5>");
        }
        
    }
    else{
        $(".contentPopUp .boxPopUp .leftPopUp").append("<h5>"+message+"</h5>");
    }
    $(".contentPopUp").addClass("active");
    setTimeout(() => {
        $(".contentPopUp").removeClass("active");
        setTimeout(() => {
            $(".contentPopUp .boxPopUp .leftPopUp h5").remove();
        }, 250);
    }, 10000);
}
function closeMessage(){
    $(".contentPopUp .btnClosePopUp").click(function(){
        $(".contentPopUp").removeClass("active");
        setTimeout(() => {
            $(".contentPopUp .boxPopUp .leftPopUp h5").remove();
        }, 250);
    });
}