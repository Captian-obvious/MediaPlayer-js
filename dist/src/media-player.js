require('https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.js');
window.MediaPlayer = {
    volume: 0,
    currentTrack: 0,
    readFile: function(file) {
        var tags = {};
        var ID3 = window.jsmediatags;
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
