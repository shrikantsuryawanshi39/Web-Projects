// <<<<<<=========================== Global Variables ===========================>>>>>>

const currentSong = new Audio();
let songs;
let currentFolder;
let cards;


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



// <<<<<<======================= Fetching songs from the local server and parsing for songs name =======================>>>>>>

async function getSongs(folder) {
    let response = await fetch(`/songs/${folder}/`);
    let text = await response.text();
     /* console.log(text); // Check what is being returned */
    let div = document.createElement("div");
    div.innerHTML = text;

    // Find the links to the songs
    let songLinks = div.getElementsByTagName("a");
    songs = [];

    for (let link of songLinks) {
        if (link.href.endsWith(".mp3")) { // Filter for .mp3 files
            // href songlinks which ends with .mp3
            songs.push(link.href.split('/songs/')[1]);
        }
    }

    /* console.log(songs); // Check the list of songs */

    const songListContainer = document.getElementById("song_list");

    // show all the songs in the playlist
    songs.forEach(song => {
        // console.log(song);
        folder = folder.replaceAll('%20', " ")
        let nameOfTheSong = song.replaceAll('%20', " ").split(`${folder}/`)[1].split('.mp3')[0].replaceAll("%2C", ",");
        let nameOfTheArtist = nameOfTheSong.split(" - ")[1];
        document.querySelector('.playlistName').innerHTML = folder
        songListContainer.innerHTML += `<li>
        <img class="invert" src="/Utilities-folder/music.svg" alt="music">
        <div class="songInfo">
                                <div class="musicName">${nameOfTheSong.split(" - ")[0]}</div>
                                <div class="artistName">${nameOfTheArtist}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="play_pause_svg" src="/Utilities-folder/playsong.svg" alt="play">
                            </div>
                        </li>`;
    });


    // <<<<<===================== Attach an event listener to each song ======================>>>>>

    Array.from(document.querySelectorAll('#song_list li')).forEach(e => {
        let playNowBtn = e.getElementsByTagName('div')[3];
        // console.log(e);
        // we can directly targate e for click event if want to play when click anywhere on li
        playNowBtn.addEventListener("click", element => {
            let songInfo = e.getElementsByTagName('div')[0];
            let songName = `${folder}/` + songInfo.firstElementChild.innerHTML + ' - ' + songInfo.lastElementChild.innerHTML + '.mp3';
            console.log("Playing :- " + songName);
            console.log("Artists :- " + songInfo.lastElementChild.innerHTML);
            playMusic(songName)
        })

    })

    return songs;
}



function playMusic(songName) {
    // let audio = new Audio("/songs/" + songName);
    currentSong.src = "/songs/" + songName;
    currentSong.play()
    playPause.src = "/Utilities-folder/pausesong.svg";

    let atchualSongName = songName.replaceAll('%20', " ").split(`${currentFolder}/`)[1].split('.mp3')[0].replaceAll("%2C", ",");
    document.getElementById('songInfo').innerHTML = `${atchualSongName}`
}



// <<<<==================== Displaying all the folders of songs as cards of Playlists  =====================>>>>
async function displayFolders() {
    let response = await fetch(`/songs/`);
    let text = await response.text();

    let div = document.createElement('div')
    div.innerHTML = text;
    let anchors = div.getElementsByTagName("a")
    let anchorArr = Array.from(anchors)
    for (let i = 0; i < anchorArr.length; i++) {
        const e = anchorArr[i];
        if (e.href.includes('/songs/')) {
            let folder = e.title // folder name

            // Getting Details/metadata of the folder
            let response = await fetch(`/songs/${folder}/info.json`);
            let text = await response.json();
            let folderTitle = text.title;
            let folderDetails = text.details;

            let cardContainer = document.querySelector(".cardContainer");
            const cardsHtml = `<div data-folder="${folder}" class="card">
            <!-- Play SVG -->
            <div class="play_svg_container">
            <img src="/Utilities-folder/cardplay.svg" alt="play">
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="img">
            <h2 class="p_t_15">${folderTitle}</h2>
            <p class="light_gray p_t_10">${folderDetails}</p>
            </div>`
            cardContainer.innerHTML = cardContainer.innerHTML + cardsHtml;
        }
    };



    // <<<<==================== Adding an event listener to card for loading the playlist songs=====================>>>>
    cards = document.querySelectorAll('.card');
    Array.from(cards).forEach((e) => {
        // console.log(e.dataset.folder);
        e.addEventListener('click', async () => {
            document.querySelector('#song_list').innerHTML = ""
            currentFolder = e.dataset.folder
            currentFolder = currentFolder.replaceAll("%20", " ");
            let songs =  await getSongs(currentFolder);
            playMusic(songs[0])
            document.querySelector('.left').style.left = "0px"
            console.log(currentFolder)
        })

    })


    // <<<<<<=========================== Pop up play button on cards ===========================>>>>>>
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



}
// <<<<===================== Displaying all the folders [END] =====================>>>>



// <<<<============= Main Function From Here =============>>>>
async function main() {

    await displayFolders()

    currentFolder = 'Aasa Kooda'  //This will show the Aasa Kooda folder by default
    await getSongs(currentFolder);

    // playing and showing name of first song on playbar using [My Way] ⬇️
    currentSong.src = "/songs/" + songs[0];
    let playbarSongName = songs[0].replaceAll('%20', " ").split(`${currentFolder}/`)[1].split('.mp3')[0].replaceAll("%2C", ",");
    document.getElementById('songInfo').innerHTML = `${playbarSongName}`
    document.getElementById('timeStamps').innerHTML = `00:00 / 00:00`



    // <<<<<====================== Adding event listener to play pause next and previous [START] ======================>>>>>

    let playPause = document.getElementById('playPause')
    let previous = document.getElementById("previous")
    let next = document.getElementById("next")
    // console.log(playPause);
    playPause.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            playPause.src = "/Utilities-folder/pausesong.svg";
        }
        else {
            currentSong.pause();
            playPause.src = "/Utilities-folder/playsong.svg";
        }
    })

    // Event listener for previous song button 
    previous.addEventListener('click', () => {
        let currSongName = currentSong.src.split("songs/").pop()
        let currSongIndex = songs.indexOf(currSongName);
        if (currSongIndex > 0) {
            let prevSong = songs[currSongIndex - 1]
            playMusic(prevSong);
        } else {
            // This will repeat the first song every time the user wants to play the previous song while staying at index [0]
            let prevSong = songs[0]
            playMusic(prevSong);
        }
    })

    // Event listener for Next song button 
    next.addEventListener('click', () => {
        let currSongName = currentSong.src.split("songs/").pop()
        let currSongIndex = songs.indexOf(currSongName);
        if (currSongIndex < songs.length - 1) {
            let prevSong = songs[currSongIndex + 1]
            playMusic(prevSong);
        } else {
            // this will repeat the playlist after last song
            let prevSong = songs[0]
            playMusic(prevSong);
        }
    })
    // <<<<<====================== play pause next and previous [END]======================>>>>>




    //    <<<<=============== Updating current time of the song ===============>>>>
    currentSong.addEventListener('timeupdate', () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        let time = formatTime(currentSong.currentTime)
        let songDuration = formatTime(currentSong.duration)
        document.querySelector('#timeStamps').innerHTML = `${time} / ${songDuration}`

        let seekbar = document.querySelector('.seekbar')
        let seekbarCircle = document.querySelector('.seekbar_circle')
        let seekbarWidth = (currentSong.currentTime / currentSong.duration) * 100
        seekbarCircle.style.left = seekbarWidth + '%'

        if (time == songDuration) {
            let currSongName = currentSong.src.split("songs/").pop();
            let currSongIndex = songs.indexOf(currSongName);
            if (currSongIndex < songs.length - 1) {
                let prevSong = songs[currSongIndex + 1]
                playMusic(prevSong);
            }
            else {
                let prevSong = songs[0]
                playMusic(prevSong);
            }

            /*>>>> we can use this code if we want to stop playing after song end 

            // seekbarCircle.style.left = 0 + '%'
            // playPause.src = "/Utilities-folder/playsong.svg";
            // document.querySelector('#timeStamps').innerHTML = `00:00 / ${songDuration}`
            */
        }
    })
    // <<<<==================== Adding event listener to seekbar =====================>>>>
    let seekbarCircle = document.querySelector('.seekbar')
    seekbarCircle.addEventListener('click', (e) => {
        let seekbarWidth = e.offsetX / seekbarCircle.clientWidth * currentSong.duration
        currentSong.currentTime = seekbarWidth

    })

    // <<<<<<=================== Adding event listners to volume bar ===================>>>>>>
    let volume = document.querySelector('.volume')
    let volumeRange = document.getElementById("volumeRange")
    let volNum = document.querySelector('.volNum')
    // show volumebar on hover
    volume.addEventListener("mouseover", () => {
        document.getElementById("volumeRange").style.opacity = "1";
        document.getElementById("volumeRange").style.bottom = "30px";
        document.getElementById("volumeRange").style.width = "55px";
        document.querySelector('.volNum').style.opacity = "1"
    })

    // hide volumebar on mouse out
    volume.addEventListener('mouseout', () => {
        document.getElementById("volumeRange").style.opacity = "0";
        document.getElementById("volumeRange").style.bottom = "15px";
        document.getElementById("volumeRange").style.width = "30px";
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

}


main();
