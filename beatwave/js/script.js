// <<<<<<=========================== Global Variables ===========================>>>>>>

const currentSong = new Audio();
let songs;
let currentFolder;
let cards;
let playPause = document.getElementById('playPause');
let libArr = {};
let randSongs = ["Arijit Singh", "Sonu Nigam", "Kailash Kher", "Shreya Ghoshal", "Honey Singh", "Raftaar", "Billie Eilish", "Vishal Shekhar", "Bayaan Maand", "Taylor Swift"];
let repeatMode = true;
let shuffleMode = false;

// <<<<<<=========================== Function to convert seconds into minute ===========================>>>>>>

function formatTime(seconds) {
    // Round the seconds to the nearest integer
    seconds = Math.floor(seconds);

    // Calculate minutes
    const minutes = Math.floor(seconds / 60);
    // Calculate remaining seconds
    const remainingSeconds = seconds % 60;

    // Format the remaining seconds to always have two digits
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Return the formatted time 
    return `${minutes}:${formattedSeconds}`;
}

// <<<<<<=========================== Function to get the user search input and searching songs ===========================>>>>>>

const searchInput = document.getElementById('searchBar')
function searchSongs() {
    const searchValue = searchInput.value.toLowerCase();
    // console.log("Search Value : ", searchValue)
    return searchValue;
}

searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        userSearchBtn();
    }
});

const userSearchBtn = (params) => {
    currentSong.pause();
    let seekbarCircle = document.querySelector('.seekbar_circle')
    seekbarCircle.style.left = 0 + '%';
    let searchQuery = searchSongs();
    searchQuery = searchQuery.replace(/[^a-zA-Z0-9 ]/g, '')
    // console.log(" searhc query is : ",searchQuery);

    let playPause = document.getElementById('playPause')
    playPause.src = "/Utilities-folder/playsong.svg";


    if (searchQuery) {
        // console.log("Running search for : ", searchQuery);
        getSongs(searchQuery);
        setInfoInPlaybar(0)
    } else {
        const randNum = Math.floor(Math.random() * 10);
        console.log(randNum);
        getSongs(randSongs[randNum]);
        setInfoInPlaybar(0)
    }

}
const searchSongBtn = document.getElementById("searchSongBtn");
searchSongBtn.addEventListener("click", userSearchBtn)

userSearchBtn()


// <<<<<<=========================== Function for playing songs ===========================>>>>>>
function playSong(songLink, num) {

    // let audio = new Audio("/songs/" + songName);
    currentSong.src = songLink;
    currentSong.dataset.index = num;
    currentSong.play()
    playPause.src = "/Utilities-folder/pausesong.svg"; // at top

    let songName = libArr[num].title;
    let songArtist = libArr[num].artist.name;
    let songTime = formatTime(libArr[num].duration);
    if (songName.length > 39) {
        songName = songName.substring(0, 39);
    }
    document.getElementById('songInfo').innerHTML = `${songName} - ${songArtist}`
    document.getElementById('timeStamps').innerHTML = `${songTime} / ${songTime}`
}


// <<<<<<<<<<<<<<<<<<<<<=================== ⬇️ playing and showing name of first song on playbar ⬇️ ========================>>>>>>>>>>>>>>>>>>>>>>


function setInfoInPlaybar(params) {
    setTimeout(() => {
        let songName = libArr[params].title;
        if (songName.length > 39) {
            songName = songName.substring(0, 39);
        }
        let seekbarCircle = document.querySelector('.seekbar_circle')
        seekbarCircle.style.left = 0 + '%';
        let songArtist = libArr[params].artist.name;
        let songTime = formatTime(libArr[params].duration);
        currentSong.src = libArr[params].preview
        document.getElementById('songInfo').innerHTML = `${songName} - ${songArtist}`
        document.getElementById('timeStamps').innerHTML = `${songTime} / ${songTime}`
        // console.log("Playbar Info");
    }, 1500)

}
// <<<<<<======================= Fetching songs from the API and parsing for songs info. =======================>>>>>>

async function getSongs(query) {
    const response = await fetch(
        `https://api.lyrics.ovh/suggest/${query}`
    );

    const dataObj = await response.json();
    // console.log(dataObj.data);
    const songs = dataObj.data; // array of songs
    // displaySongs(dataObj.data);
    libArr = songs;


    const songListContainer = document.getElementById("song_list");

    //<<<<<<<<<<<<<<<<<<<<<<============= show all the songs in the Libary ===================>>>>>>>>>>>>>>>>>>>>>>>>>
    function displayLibrary() {
        let i = 0;
        songListContainer.innerHTML = " " // empty library before re-adding songs after re-search
        songs.forEach(song => {
            // console.log(song);
            let nameOfTheSong = song.title;
            let nameOfTheArtist = song.artist.name;
            if (nameOfTheSong.length > 39) {
                nameOfTheSong = nameOfTheSong.substring(0, 39) + " ...";
            }

            songListContainer.innerHTML += `<li data-num="${0 + i}">
            <img class="invert" src="/Utilities-folder/music.svg" alt="music">
            <div class="songInfo">
                                    <div class="musicName">${nameOfTheSong}</div>
                                    <div class="artistName">${nameOfTheArtist}</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="play_pause_svg" src="/Utilities-folder/playsong.svg" alt="play">
                                </div>
                            </li>`;
            i++;
        });

        // <<<<<===================== Attach an event listener to each song ======================>>>>>
        Array.from(document.querySelectorAll('#song_list li')).forEach(e => {
            let playNowBtn = e.getElementsByTagName('div')[3];
            // console.log(playNowBtn);
            let songInfo = e.getElementsByTagName('div')[0];
            let songName = songInfo.firstElementChild.innerHTML;
            let artistName = songInfo.lastElementChild.innerHTML;

            // console.log("Songs : ", song);
            playNowBtn.addEventListener("click", (element) => {
                // console.log("Playing :- " + songName);
                // console.log("Artists :- " + artistName);
                let crrPlayingSong = document.querySelector('#crr_playing_song')
                crrPlayingSong.innerHTML = ""
                let arrNum = e.dataset.num;
                playSong(libArr[arrNum].preview, arrNum)
                console.log(e.dataset.num);
            })

        })
    }
    displayLibrary()


    // <<<<==================== Displaying all the songs as cards  =====================>>>>
    async function displayFolders() {

        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = " " // empty cards before re-adding after re-search
        let j = 0;
        songs.forEach(song => {
            // console.log(song);
            // console.log(song.album.title);

            // for making song name short so they can fit in cards
            let songTitle = song.title;
            if (songTitle.length > 39) {
                songTitle = songTitle.substring(0, 36) + "...";
            }

            // onclick="playSong('${song.preview}')" add in playbtn
            const cardsHtml = `<div class="card" data-num="${0 + j}">
            <!-- Play SVG -->
            <div class="play_svg_container">
            <img src="/Utilities-folder/cardplay.svg" alt="play">
            </div>
            <img class="songImg" src="${song.album.cover_xl}" alt="${song.title}" />
            <h2 class="p_t_15">${songTitle}</h2>
            <p class="light_gray p_t_10">${song.artist.name}</p>
            </div>`
            cardContainer.innerHTML = cardContainer.innerHTML + cardsHtml;
            j++
        })


        // <<<<<<=========================== Pop up play button on cards ===========================>>>>>>
        cards = document.querySelectorAll('.card');
        let svgContainers = document.querySelectorAll('.play_svg_container');
        // for phone in if - for medium and pcs in else 
        if (window.innerWidth < 480) {
            cards.forEach((card, index) => {
                card.addEventListener("mouseover", () => {
                    svgContainers[index].style.opacity = "1";
                    svgContainers[index].style.bottom = "82px";
                });

                card.addEventListener("mouseout", () => {
                    svgContainers[index].style.opacity = "0";
                    svgContainers[index].style.bottom = "55px";
                });
            });
        } else {
            cards.forEach((card, index) => {
                card.addEventListener("mouseover", () => {
                    svgContainers[index].style.opacity = "1";
                    svgContainers[index].style.bottom = "110px";
                });

                card.addEventListener("mouseout", () => {
                    svgContainers[index].style.opacity = "0";
                    svgContainers[index].style.bottom = "55px";
                });
            });
        }


        // <<<<==================== Adding an event listener to card for loading the playlist songs=====================>>>>
        cards = document.querySelectorAll('.card');
        Array.from(cards).forEach((e) => {
            // console.log(e.dataset.folder);
            e.addEventListener('click', async () => {
                let libraryList = document.querySelector('#song_list')
                // libraryList.innerHTML = ""
                let arrNum = e.dataset.num;
                // console.log(e.dataset.num);
                playSong(libArr[arrNum].preview, arrNum)
                // document.querySelector('.left').style.left = "0px"

                // dispClickedSongInLib(libArr[arrNum], arrNum)
            })

        })


        // to display song of clicked card in library sidebar =================>>>>>>>>>>>>>>>>>
        /*
        function dispClickedSongInLib(song, num) {
            let crrPlayingSong = document.querySelector('#crr_playing_song')
            let clickedSong = song;
            let nameOfTheSong = clickedSong.album.title;
            let nameOfTheArtist = clickedSong.artist.name;

            // crrPlayingSong.innerHTML = `<li data-num="${num}">
            //     <img class="invert" src="/Utilities-folder/music.svg" alt="music">
            //     <div class="songInfo">
            //                             <div class="musicName">${nameOfTheSong}</div>
            //                             <div class="artistName">${nameOfTheArtist}</div>
            //                         </div>
            //                         <div class="currPlaying">
            //                             <img class="onPlay" src="/Utilities-folder/play2.png" alt="play">
            //                         </div>
            //                     </li>`
        }
        */
    }
    displayFolders();


    return songs;
}


async function main() {


    setInfoInPlaybar(0)

    // <<<<<====================== Function and Adding event listener to play pause next and previous [START] ======================>>>>>
    let playPause = document.getElementById('playPause')
    let previous = document.getElementById("previous")
    let next = document.getElementById("next")
    // console.log(playPause);

    function playPauseSong() {
        if (currentSong.src) {
            if (currentSong.paused) {
                currentSong.play()
                currentSong.dataset.index = 0;
                // console.log(currentSong);

                playPause.src = "/Utilities-folder/pausesong.svg";
            }
            else {
                currentSong.pause();
                playPause.src = "/Utilities-folder/playsong.svg";
            }
        } else {
            // currentSong.src = libArr[0].preview
            // currentSong.play()
            playPause.src = "/Utilities-folder/pausesong.svg";
        }
    }
    playPause.addEventListener('click', () => {
        playPauseSong();
    })


    //<<<<<<<<<<<<<<<<<<<<<============= event listeners for play and pause when space key is pressed ==============>>>>>>>>>>>>>>>>>>>
    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {

            // Prevent pausing/playing when the input field is focused
            if (document.activeElement === userInput || document.activeElement === searchInput) return;

            event.preventDefault(); // Prevent page scrolling when pressing space
            if (currentSong.src) {
                if (currentSong.paused) {
                    currentSong.play()
                    currentSong.dataset.index = 0;
                    // console.log(currentSong);

                    playPause.src = "/Utilities-folder/pausesong.svg";
                }
                else {
                    currentSong.pause();
                    playPause.src = "/Utilities-folder/playsong.svg";
                }
            } else {
                // currentSong.src = libArr[0].preview
                // currentSong.play()
                playPause.src = "/Utilities-folder/pausesong.svg";
            }
        }
    });


    // Function and Event listener for previous song button 
    function previousSong() {
        let currSongIndex = currentSong.dataset.index;
        //  console.log(libArr[currSongIndex]);

        if (currSongIndex > 0) {
            // console.log("Prev If part");
            if (shuffleMode === true) {
                // getting random number between 0 and 15
                let randNum = Math.floor(Math.random() * 15)
                let randSongLink = libArr[randNum].preview;
                playSong(randSongLink, randNum)
                // console.log("Random Song Number : ", randNum);
                return;
            }
            let prevSong = libArr[--currSongIndex]
            playSong(prevSong.preview, currSongIndex);
        } else {
            // This will repeat the first song every time the user wants to play the previous song while staying at index [0]
            //  console.log("Prev Else part");
            let prevSong = libArr[currSongIndex]
            playSong(prevSong.preview, currSongIndex);
        }
    }
    previous.addEventListener('click', () => {
        previousSong();
    })

    // Function and Event listener for Next song button 
    function nextSong() {
        let currSongIndex = currentSong.dataset.index;
        // console.log(libArr[currSongIndex]);

        if (currSongIndex >= 0 && currSongIndex < 14) {
            // console.log("Next If part");
            if (shuffleMode === true) {
                // getting random number between 0 and 15
                let randNum = Math.floor(Math.random() * 15)
                let randSongLink = libArr[randNum].preview;
                playSong(randSongLink, randNum)
                // console.log("Random Song Number : ", randNum);
                return;
            }
            let nextSong = libArr[++currSongIndex]
            playSong(nextSong.preview, currSongIndex);

        } else {
            // This will return to first song when user reach last one
            // console.log("Next Else part");
            let nextSong = libArr[0]
            playSong(nextSong.preview, 0);
        }
    }
    next.addEventListener('click', () => {
        nextSong();
    })
    // <<<<<====================== play pause next and previous [END]======================>>>>>



    // <<<<<<=================== Adding event listners to volume bar ===================>>>>>>
    let volume = document.querySelector('.volume')
    let volumeRange = document.getElementById("volumeRange")
    let volNum = document.querySelector('.volNum')
    // show volumebar on hover
    volume.addEventListener("mouseover", () => {
        volumeRange.style.opacity = "1";
        volumeRange.style.bottom = "30px";
        volumeRange.style.width = "55px";
        document.querySelector('.volNum').style.opacity = "1"
    })

    // hide volumebar on mouse out
    volume.addEventListener('mouseout', () => {
        volumeRange.style.opacity = "0";
        volumeRange.style.bottom = "15px";
        volumeRange.style.width = "30px";
        document.querySelector('.volNum').style.opacity = "0"
    })

    if (window.innerWidth < 1200) {
        volume.style.display = 'none'; // Hide volume bar
    } else {
        volume.style.display = ''; // Show volume bar
    }

    // working of increasing and decreasing volume
    // we can use 'change' event insted of 'input', it's slightly different
    volumeRange.addEventListener('input', (e) => {
        // console.log('volume : ', e.target.value);
        currentSong.volume = e.target.value / 100
        volNum.innerHTML = e.target.value
    })


    // <<<<<<=================== Volume control using keyboard ===================>>>>>>

    // Listen for keydown events on the whole page
    document.addEventListener('keydown', (e) => {
        let volumeValue = parseInt(volumeRange.value); // Get current volume (0-100)

        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault(); // Stop page from scrolling when up/down keys are pressed
        }

        if (e.key === "ArrowUp") {
            // Increase volume
            volumeValue = Math.min(100, volumeValue + 5); // increase by 5, max 100
            volumeRange.value = volumeValue;
            currentSong.volume = volumeValue / 100;
            volNum.innerHTML = volumeValue;
        } else if (e.key === "ArrowDown") {
            // Decrease volume
            volumeValue = Math.max(0, volumeValue - 5); // decrease by 5, min 0
            volumeRange.value = volumeValue;
            currentSong.volume = volumeValue / 100;
            volNum.innerHTML = volumeValue;
        }
    });

    // <<<<<=================== Volume bar [END] ======================>>>>>


    // <<<<==================== Adding event listener to Hamburger and Close button (Responsive) =====================>>>>

    document.querySelector('#hamburger').addEventListener('click', () => {
        let sidebar = document.querySelector('.left')
        sidebar.style.left = "0"
        // console.log(sidebar);
    })

    document.querySelector('#closeBtn').addEventListener('click', () => {
        let sidebar = document.querySelector('.left')
        sidebar.style.left = "-120%"
    })


    //    <<<<=============== Updating current time of the song ===============>>>>
    currentSong.addEventListener('timeupdate', () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        let time = formatTime(currentSong.currentTime)
        let songDuration = formatTime(currentSong.duration)
        // console.log(time, songDuration);
        if (songDuration === 'NaN:NaN') {
            document.querySelector('#timeStamps').innerHTML = `${time} / 0:00`
        } else {
            document.querySelector('#timeStamps').innerHTML = `${time} / ${songDuration}`
        }

        let seekbar = document.querySelector('.seekbar')
        let seekbarCircle = document.querySelector('.seekbar_circle')
        let seekbarWidth = (currentSong.currentTime / currentSong.duration) * 100
        seekbarCircle.style.left = seekbarWidth + '%'

        if (time == songDuration) {
            if (repeatMode === true) {
                nextSong();
            }
            else if (shuffleMode === true) {
                // getting random number between 0 and 15
                let randNum = Math.floor(Math.random() * 15)
                let randSongLink = libArr[randNum].preview;
                playSong(randSongLink, randNum)
                // console.log("Random Song Number : ", randNum);
            }
        }
    })
    // <<<<==================== Adding event listener to seekbar =====================>>>>
    let seekbarCircle = document.querySelector('.seekbar')
    seekbarCircle.addEventListener('click', (e) => {
        let seekbarWidth = e.offsetX / seekbarCircle.clientWidth * currentSong.duration
        currentSong.currentTime = seekbarWidth

    })

    // <<<<=================== repeat and shuffle function =====================>>>>>>>

    let repeatBtn = document.querySelector('#repeat')
    let shuffleBtn = document.querySelector('#shuffle')
    function repeatSong() {
        repeatMode = true;
        shuffleMode = false;
        if (repeatMode === true) {
            repeatBtn.style.filter = "invert(0)"
            shuffleBtn.style.filter = "invert(1)"
        } else {
            repeatBtn.style.filter = "invert(1)"
            shuffleBtn.style.filter = "invert(0)"
        }
        console.log("repeat mode -------->>>>>");
        console.log("shuffle : ", shuffleMode);
        console.log("Repeat : ", repeatMode);
    }

    function shuffleSong() {
        repeatMode = false;
        shuffleMode = true;
        if (shuffleMode === true) {
            shuffleBtn.style.filter = "invert(0)"
            repeatBtn.style.filter = "invert(1)"
        } else {
            shuffleBtn.style.filter = "invert(1)"
            repeatBtn.style.filter = "invert(0)"
        }
        console.log("shuffle mode -------->>>>>");
        console.log("shuffle : ", shuffleMode);
        console.log("Repeat : ", repeatMode);
    }

    repeatBtn.addEventListener('click', repeatSong)
    shuffleBtn.addEventListener('click', shuffleSong)

}


main();

searchSongs(); // LINE NO 30-50 