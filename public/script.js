let audio = new Audio();
let currentSongIndex = -1; 
let songs = [];
let isPlaying = false; 
let isShuffleOn = false;
let shuffledSongs = []; 

window.onload = function () {
    document.querySelectorAll('.song').forEach((song) => {
        songs.push({
            element: song,
            filePath: song.querySelector('button[onclick*="selectSong"]').getAttribute('onclick').match(/'([^']+)'/)[1], 
            id: song.id.split('-')[1], 
            title: song.querySelector('h3').innerText, 
            artist: song.querySelector('p').innerText.replace('Artist: ', '') 
        });
    });
};

function selectSong(filePath) {
    currentSongIndex = isShuffleOn ? shuffledSongs.findIndex(song => song.filePath === filePath) : songs.findIndex(song => song.filePath === filePath);

    if (currentSongIndex !== -1) { // Ensure a valid index is selected
        audio.src = filePath; // Set the audio source
        audio.load(); // Load the new audio

        audio.onloadedmetadata = function () {
            document.getElementById('duration').textContent = formatTime(audio.duration);
            document.getElementById('audioRange').max = audio.duration; 
        };

        audio.ontimeupdate = function () {
            document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
            document.getElementById('audioRange').value = audio.currentTime; 
        };

        audio.onended = function () {
            nextSong(); 
        };

        const currentSong = isShuffleOn ? shuffledSongs[currentSongIndex] : songs[currentSongIndex];
        document.getElementById('currentSongTitle').textContent = currentSong.title; 
        document.getElementById('currentSongArtist').textContent = currentSong.artist; 

        highlightCurrentSong(currentSongIndex);

        playPauseSong(); 
    } else {
        console.error('Song not found:', filePath);
    }
}

function playPauseSong() {
      if (isPlaying) {
          audio.pause();
          document.getElementById('playPauseBtn').textContent = 'Play';
      } else {
          audio.play();
          document.getElementById('playPauseBtn').textContent = 'Pause';
      }
      isPlaying = !isPlaying; 
  }


function highlightCurrentSong(index) {
    songs.forEach((song) => {
        song.element.classList.remove('playing'); 
    });

    songs[index].element.classList.add('playing'); 
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length; 
    selectSong(songs[currentSongIndex].filePath); 
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; 
    selectSong(songs[currentSongIndex].filePath);
}


function replaySong() {
    audio.currentTime = 0; 
    playPauseSong(); 
}

function shuffleSongs() {
    isShuffleOn = !isShuffleOn; 
    if (isShuffleOn) {
        shuffledSongs = [...songs].sort(() => 0.5 - Math.random()); 
    } else {
        shuffledSongs = []; 
    }
    alert(isShuffleOn ? 'Shuffle is ON' : 'Shuffle is OFF');
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

function setAudioTime(value) {
    audio.currentTime = value; 
}

function openInsertModal() {
    document.getElementById('insertModal').style.display = 'flex'; 
}

function closeInsertModal() {
    document.getElementById('insertModal').style.display = 'none'; 
}

function openUpdateModal(songId) {
    const song = songs.find(s => s.id === songId.toString());
    document.getElementById('updateForm').elements['title'].value = song.title;
    document.getElementById('updateForm').elements['artist'].value = song.artist; 
    document.getElementById('updateForm').action = `/update-song/${songId}`; 
    document.getElementById('updateModal').style.display = 'flex'; 
}

function closeUpdateModal() {
    document.getElementById('updateModal').style.display = 'none'; 
}

function deleteSong(songId) {
    if (confirm('Are you sure you want to delete this song?')) {
        fetch(`/delete-song/${songId}`, { method: 'POST' })
            .then(() => {
                document.getElementById(`song-${songId}`).remove();
            })
            .catch(error => {
                console.error('Error deleting song:', error);
            });
    }
}

function likeSong(songId) {
    fetch(`/like-song/${songId}`, { method: 'POST' })
        .then(() => {
            alert('Song liked!');
        })
        .catch(error => {
            console.error('Error liking song:', error);
        });
}
