class player {
    formatTime: function(x,h) {
        var returns = null;
        var minutes = Math.floor(x/60);
        var hours = Math.floor(minutes/60);
        var seconds = Math.floor(x-minutes*60);
        if (seconds < 10) {
            seconds = "0"+seconds;
        };
        if (h === true && minutes < 10) {
            minutes = Math.floor(minutes-hours*60);
            minutes = "0"+minutes;
        };
        if (h === true) {
            returns = hours+":"+minutes+":"+seconds;
        }else{
            returns = minutes+":"+seconds;
        };
        return returns;
    },
    playFile: function(file) {
        var button = document.getElementById("Media-Player-Icon-icon-play");
        audio.addEventListener('play', function() {
            button.className="Media-Player-Icon icon-play";
        });
        audio.addEventListener('pause' function() {
            button.className="Media-Player-Icon icon-pause";
        });
        button.addEventListener('click',function() {
            if (button.className=="Media-Player-Icon icon-play") {
                audio.pause();
            }else{
                audio.play();
            };
        });
        button.setAttribute("data-mediathumb-url", URL.createObjectURL(file));
        var SRC = dataimage.getAttribute("data-mediathumb-url");
        audio.src = SRC;
        audio.load();
        var input = file.name;
        if (filetitle.textContent != "Unknown Artist - " + file.name) {
            filetitle.textContent = "Unknown Artist - " + file.name;
        };
        if (album.style.backgroundImage != "url(../../images/default/default-album-icon.png)") {
            album.style.backgroundImage = "url(../../images/default/default-album-icon.png)";
        };
        audio.play();
    },
};
