// Set Urls
const items = [
    {
        title: "Jellyfin",
        subtitle: "stream.deltanet.tk:57207", // Add subtitle text here
        image: "img/jellyfin_icon.png",
        link: "https://stream.deltanet.tk:57207",
        pingUrl: "https://stream.deltanet.tk:57207/system/info/public"
    },
    /*
    {
        title: "121.st",
        subtitle: "stream.121.st:57207", // Add subtitle text here
        image: "img/jellyfin_icon.png",
        link: "https://stream.121.st:57207",
        pingUrl: "https://stream.121.st:57207/system/info/public"
    },
    */
    {
        title: "Jellyfin",
        subtitle: "1.121.st:57207", // Add subtitle text here
        image: "img/jellyfin_icon.png",
        link: "https://1.121.st:57207",
        pingUrl: "https://1.121.st:57207/system/info/public"
    },
    {
        title: "Downloads",
        subtitle: "jellyfin.org/downloads", // Add subtitle text here
        image: "img/jellyfin_icon.png",
        link: "https://jellyfin.org/downloads",
        pingUrl: "https://jellyfin.org/downloads"
    }
];

// Function to generate HTML for items
function generateItems() {
    const container = document.getElementById("itemsContainer");
    items.forEach((item, index) => { // Use index to create unique IDs
        const itemDiv = document.createElement("div");
        itemDiv.className = "item";
        itemDiv.innerHTML = `
            <div class="item-inner">
                <div class="row1">
                    <img src="${item.image}" alt="${item.title} logo" class="img">
                </div>
                <div class="row2">
                    <p class="title">${item.title}</p>
                    <p class="subtitle" id="subtitle-${index}">${item.subtitle}</p> <!-- Unique subtitle ID -->
                </div>
                <div class="row3">
                    <div class="buttons">
                        <a href="${item.link}" class="button"><img src="img/material-open.svg"></a>
                        <div class="status">
                            <span class="dot" id="status-${index}"></span> <!-- Unique status ID for the dot -->
                        </div>
                        <a onclick="copyToClipboard('${item.subtitle}')" class="button"><img src="img/material-copy.svg"></a> <!-- Pass subtitle text directly -->
                    </div>
                </div>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}


// Function to ping URLs and update status
function pingUrls() {
    items.forEach((item, index) => {
        const statusElementId = `status-${index}`; // Create the correct status ID for the dot
        pingUrl(item.pingUrl, statusElementId);
    });
}

// Call functions to generate items and ping URLs
generateItems();
pingUrls();

// Copy to clipboard function
function copyToClipboard(text) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val(`https://${text}`).select(); // Add https:// to the text
    document.execCommand("copy");
    $temp.remove();
    $("#notification").css("height", "50px");
    setTimeout(function () {
        $("#notification").css("height", "0");
    }, 3000);
}

// Fetch user IP and location remains the same
fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        const ip = data.ip;
        fetch(`https://ipapi.co/${ip}/json/`)
            .then(response => response.json())
            .then(data => {
                const city = data.city;
                document.getElementById("ipAddress").textContent = ip;
                document.getElementById("location").textContent = `${city}`;
                document.getElementById("divider").textContent = "|";
                document.getElementById("footerContent").classList.add("fade-in");
            });
    });

// Function to ping a URL and update the status
function pingUrl(Url, statusElementId) {
    document.getElementById(statusElementId).classList.add("fade-in-out");
    fetch(Url)
        .then(response => {
            console.log(`Pinging ${Url}: ${response.status}`); // Log the response status
            if (response.ok) {
                document.getElementById(statusElementId).classList.remove("fade-in-out");
                document.getElementById(statusElementId).classList.remove("down");
                document.getElementById(statusElementId).classList.add("up");
            } else {
                console.error(`Error: ${response.statusText}`);
                document.getElementById(statusElementId).classList.remove("fade-in-out");
                document.getElementById(statusElementId).classList.remove("up");
                document.getElementById(statusElementId).classList.add("down");
            }
        })
        .catch(error => {
            console.error(`Fetch error: ${error}`);
            document.getElementById(statusElementId).classList.remove("fade-in-out");
            document.getElementById(statusElementId).classList.remove("up");
            document.getElementById(statusElementId).classList.add("down");
        });
}

