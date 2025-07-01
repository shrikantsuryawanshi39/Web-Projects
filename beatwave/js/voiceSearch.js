const micButton = document.getElementById("mic-btn"); // Button to start voice search
const micImg = micButton.firstElementChild;


// Check if browser supports Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert("Your browser does not support voice search.");
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after one sentence
    recognition.lang = "en-IN"; // Set language
    recognition.interimResults = false; // Get only final results

    let isListening = false; // Track if speech recognition is active

    // Start voice recognition when clicking the mic button
    micButton.addEventListener("click", () => {
        currentSong.pause();
        setPlaybarDefult();
        console.log(playPause)
        if (isListening) {
            recognition.stop();
            micImg.src = `/Utilities-folder/mic-off.svg`
            isListening = false;
        }
        else {
            recognition.start();
            micImg.src = `/Utilities-folder/mic-on.svg`
            isListening = true;
        }
    });

    function setPlaybarDefult(){
        let playPause = document.getElementById("playPause");
        playPause.src = "/Utilities-folder/playsong.svg";
        let seekbarCircle = document.querySelector('.seekbar_circle')
        seekbarCircle.style.left = 0 + '%';
    }

    // Process the voice input
    recognition.onresult = (event) => {
        // console.log(event);
        const voiceInput = event.results[0][0].transcript.toLowerCase();
        micImg.src = `/Utilities-folder/mic-off.svg`
        isListening = false;
        let searchInput = document.getElementById("searchBar");
        searchInput.value = voiceInput; // Update the search input
        console.log("You said:", voiceInput);
        searchInput.focus(); // ✅ Make search input active
    };

    recognition.onerror = (event) => {
        micImg.src = `/Utilities-folder/mic-off.svg`;
        isListening = false;
        console.error("Error in recognition:", event.error);
    };
}
