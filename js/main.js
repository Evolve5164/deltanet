// Set Urls
const stream = "stream.deltanet.tk:55826"
const downloads = "jellyfin.org/downloads"

// Set Urls to ping
const streamPing = "https://" + stream + "/system/info/public";
const downloadsPing = "https://" + downloads;

// Set <a> href to given urls
function setLinks() {
    document.getElementById("stream").textContent = stream
    document.getElementById("downloads").textContent = downloads
}

// Set <a> href to given urls
function setButtonLinks() {
    document.getElementById("streamButton").href = "https://" + stream
    document.getElementById("downloads").href = "https://" + downloads
}

function pingUrl(Url, statusElementId) {
    document.getElementById(statusElementId).classList.add("fade-in-out");
    fetch(Url)
        .then(response => {
            if (response.ok) {
                document.getElementById(statusElementId).classList.remove("fade-in-out");
                document.getElementById(statusElementId).classList.remove("down");
                document.getElementById(statusElementId).classList.add("up");
            }
        })
        .catch(error => {
            document.getElementById(statusElementId).classList.remove("fade-in-out");
            document.getElementById(statusElementId).classList.remove("up");
            document.getElementById(statusElementId).classList.add("down");
            console.error(error);
        });
}

/* Get user IP and location */
fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        const ip = data.ip;
        fetch(`https://ipapi.co/${ip}/json/`)
            .then(response => response.json())
            .then(data => {
                const city = data.city;
                const region = data.region;
                const country = data.country_name;
                document.getElementById("ipAddress").textContent = ip;
                document.getElementById("location").textContent = `${city}`;
                document.getElementById("divider").textContent = "|";
                document.getElementById("footerContent").classList.add("fade-in");
            });
    });

function copyToClipboard(element) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val("https://" + $(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
    // Display a sliding notification that the text has been copied
    $("#notification").css("height", "50px");
    setTimeout(function () {
        $("#notification").css("height", "0");
    }, 3000);
}

setLinks()
setButtonLinks()
pingUrl(streamPing, "streamStatus");
pingUrl(downloadsPing, "downloadsStatus");