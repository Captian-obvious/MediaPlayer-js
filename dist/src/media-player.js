require('https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.js');
window.ID3 = window.jsmediatags
window.MediaPlayer = {
    volume: 0,
    maxRMS: 0,
    currentTrack: 0,
    readFile: function(file) {
        var tags = {};
        ID3.read(file, {
            onSuccess: function (tag) {
                console.log(tag);
                var data = tag.tags.picture.data;
                var format = tag.tags.picture.format;
                var url = "";
                if (data.length != 0 && format != null) {
                    var str = "";
                    for (var o = 0; o < data.length; o++) {
                        str += String.fromCharCode(data[o]);
                    }
                    url = "data:" + format + ";base64," + window.btoa(str);
                };
                tags.image = url
                tags.title = tag.tags.title
                tags.artist = tag.tags.artist
            },
            onError: function (error) {
                console.log(error);
            },
        });
        return tags;
    },
    getRMS: function(arr) {
        var square = 0;
        var mean = 0;
        var val = 0;
        var rms = 0;
        var n = arr.length;

        // Calculate square.
        for (var i = 0; i < n; i++) {
            square += Math.pow(arr[i], 2);
        };

        // Calculate Mean.
        mean = square / n;
        // Calculate Root.
        val = Math.sqrt(mean);
        this.maxRMS = Math.max(val, this.maxRMS)
        rms = (val/this.maxRMS)*255
        return rms;
    },
    formatTime: function(x) {
        var minutes = Math.floor(x/60);
        var seconds = Math.floor(x-minutes*60);
        if (seconds < 10) {
            seconds = "0"+seconds;
        };
        return minutes+":"+seconds;
    },
    createPlayer: function(container) {
        document.getElementById(''+container).innerHTML = `
        <label id="filename" for="thefile">Choose Audio file.</label>
        <canvas id="canvas"></canvas>
        <div id="main">
            <div id="album">
                <div id="MediaPlayerControls">
                    <div id="MediaPlayerIcon-icon-play" class="MediaPlayerIcon icon-play" data-mediathumb-url="src"></div>
                    <div id="sound_options" class="MediaPlayerIcon icon-volume">
                        <input id="volume" class="MediaPlayerControl-volume" type="range" max="100" min="0" />
                    </div>
                </div>
                <input id="MediaPlayerControl-seekbar" type="range" name="rng" min="0" value="0">
                <div id="time-position"></div>
            </div>
        </div>
        `
    },
}
