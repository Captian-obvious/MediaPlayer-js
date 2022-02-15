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
        button.addEventListener('click',function() {
            if (button.className=="Media-Player-Icon icon-play") {
            
            };
        })
    },
};
