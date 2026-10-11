
const qrInput = document.getElementById("qrInput");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const qrContainer = document.querySelector(".qr-container");
const qrImage = document.getElementById("qrImage");
const message = document.getElementById("message");

// Countdown display
const timer = document.createElement("h3");
timer.style.margin = "15px 0";
timer.style.color = "#667eea";
timer.style.textAlign = "center";
qrContainer.parentNode.insertBefore(timer, qrContainer);

let countdownInterval;
let changeTimeout;

// Generate QR Code
function generateQR() {
    const qrText = qrInput.value.trim();

    if (qrText === "") {
        message.textContent = "Please enter text or URL!";
        message.style.color = "red";
        return;
    }

    // Clear previous timers
    clearInterval(countdownInterval);
    clearTimeout(changeTimeout);

    message.textContent = "";
    qrContainer.style.display = "block";
    downloadBtn.hidden = false;

    // Generate initial QR code
    qrImage.src =
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="
        + encodeURIComponent(qrText);

    let seconds = 10;

    timer.textContent = `QR changes in ${seconds} seconds`;

    // Countdown every second
    countdownInterval = setInterval(function () {
        seconds--;

        if (seconds > 0) {
            timer.textContent = `QR changes in ${seconds} seconds`;
        } else {
            clearInterval(countdownInterval);
        }
    }, 1000);

    // Change QR code after 10 seconds
    changeTimeout = setTimeout(function () {
        const newText = "Thank You users";

        qrImage.src =
            "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="
            + encodeURIComponent(newText);

        timer.textContent = "QR Code Changed!";
        message.textContent = "New QR code: " + newText;
        message.style.color = "green";
    }, 10000);
}

// Generate button
generateBtn.addEventListener("click", generateQR);

// Enter key support
qrInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        generateQR();
    }
});

// Download QR code
downloadBtn.addEventListener("click", async function () {
    try {
        const response = await fetch(qrImage.src);

        if (!response.ok) {
            throw new Error("Image download failed");
        }

        const blob = await response.blob();
        const imageURL = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = imageURL;
        link.download = "my-qr-code.png";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(imageURL);
    } catch (error) {
        message.textContent =
            "Download failed. Please try again.";
        message.style.color = "red";
    }
});
