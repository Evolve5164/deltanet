// Set Urls
const stream1 = "stream.deltanet.tk:55251"
const stream2 = "deltastream.duckdns.org:55251"
const request1 = "request.deltanet.tk:55251"
const request2 = "deltarequest.duckdns.org:55251"
const downloads = "jellyfin.org/downloads"

// Set Urls to ping
const stream1Ping = "https://" + stream1 + "/system/info/public";
const stream2Ping = "https://" + stream2 + "/system/info/public";
const request1Ping = "https://" + request1 + "/api/v1/status";
const request2Ping = "https://" + request2 + "/api/v1/status";
const downloadsPing = "https://" + downloads;

// Set <a> href to given urls
function setLinks() {
    document.getElementById("stream1").textContent = stream1
    document.getElementById("stream2").textContent = stream2
    document.getElementById("request1").textContent = request1
    document.getElementById("request2").textContent = request2
    document.getElementById("downloads").textContent = downloads
}

// Set <a> href to given urls
function setButtonLinks() {
    document.getElementById("stream1Button").href = "https://" + stream1
    document.getElementById("stream2Button").href = "https://" + stream2
    document.getElementById("request1Button").href = "https://" + request1
    document.getElementById("request2Button").href = "https://" + request2
    document.getElementById("downloads").href = "https://" + downloads
}

function pingUrl(Url, statusElementId) {
    fetch(Url)
    .then(response => {
        if (response.ok) {
            document.getElementById(statusElementId).classList.remove("down");
            document.getElementById(statusElementId).classList.add("up");
        }
    })
    /*
    .catch(error => {
        document.getElementById(statusElementId).classList.remove("up");
        document.getElementById(statusElementId).classList.add("down");
        console.error(error);
    });
    */
}

function copyToClipboard(element) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val("https://" + $(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
    // Display a sliding notification that the text has been copied
    $("#notification").css("height", "50px");
    setTimeout(function() {
        $("#notification").css("height", "0");
    }, 3000);
}

window.onload = pingUrl(stream1Ping, "stream1Status");
window.onload = pingUrl(stream2Ping, "stream2Status");
window.onload = pingUrl(request1Ping, "request1Status");
window.onload = pingUrl(request2Ping, "request2Status");
window.onload = pingUrl(downloadsPing, "downloadsStatus");
window.onload = setLinks()
window.onload = setButtonLinks()