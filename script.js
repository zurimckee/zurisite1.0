
function logContent(){
    const logContent = document.querySelector('.log-content');
    const entries = Array.from(logContent.querySelectorAll('p, hr'));
    logContent.innerHTML = ''; // Clear current content
    entries.reverse().forEach(entry => logContent.appendChild(entry)); // Append in reverse order
}

function toggleMenu(){
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

function toggleMusic(){
    const audio = document.getElementById("music");
    const playpausebtn = document.getElementById("play-icon");
    if (audio.muted) {
        audio.muted = false;
        playpausebtn.src = "assets/volup.png";
    } else {
        audio.muted = true;
        playpausebtn.src = "assets/voldown.png";
    }
}

logContent();

