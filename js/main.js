function copyToClipboard(element) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
    // Display a sliding notification that the text has been copied
    $("#notification").css("height", "50px");
    setTimeout(function() {
        $("#notification").css("height", "0");
    }, 3000);
}