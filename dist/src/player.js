window.player = {
    replaceurl: function (paramText) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + paramText;
        window.history.pushState({ path: newurl }, "", newurl);
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
        rms = val
        return rms;
    },
    playFile: function(file) {
        var a = new Audio();
        var button = document.getElementById("MediaPlayerIcon-icon-play");
        button.setAttribute("data-mediathumb-url", URL.createObjectURL(file));
        var album = document.getElementById('album');
        var vol = document.getElementById('MediaPlayerControl-volume');
        var filetitle = document.getElementById('filename');
        var dur = document.getElementById('MediaPlayerControl-seekbar')
        var setting = document.getElementById('MediaPlayerIcon-icon-volume')
        var SRC = button.getAttribute("data-mediathumb-url");
        a.src = SRC;
        a.load();
        var input = file.name;
        if (filetitle.textContent != "Unknown Artist - " + file.name) {
            filetitle.textContent = "Unknown Artist - " + file.name;
        };
        if (album.style.backgroundImage != "url(/MediaPlayer-js/dist/images/default-album-icon.png)") {
            album.style.backgroundImage = "url(/MediaPlayer-js/dist/images/default-album-icon.png))";
        };
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
                if (filetitle.textContent != tags.artist+" - " + tags.title) {
                    filetitle.textContent = tags.artist+" - " + tags.title;
                };
                if (album.style.backgroundImage != "url("+tags.image+")") {
                    album.style.backgroundImage = "url("+tags.image+")";
                };
            },
            onError: function (error) {
                console.log(error);
            },
        });
        a.play();
        this.replaceurl("player=true&input="+input)
        var context = new AudioContext();
        console.log(context);
        var position = document.getElementById('time-position');
        var src = context.createMediaElementSource(a);
        var analyser = context.createAnalyser();
        var loud = 0;
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        src.connect(analyser);
        var gn = context.createGain();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        analyser.connect(gn);
        gn.connect(context.destination);
        var fft_Size = 512;
        analyser.fftSize = fft_Size;
        analyser.maxDecibels = -3;
        analyser.minDecibels = -150;
        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
        console.log(analyser);
        var dataArray = new Uint8Array(bufferLength);
        var maxHeight = canvas.height / 2;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var barWidth = WIDTH / bufferLength;
        var barHeight;
        function renderFrame() {
            requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(dataArray);
            var curtime = MediaPlayer.formatTime(a.currentTime);
            var time = MediaPlayer.formatTime(a.duration);
            position.innerHTML = curtime + " / " + time;
            loud = MediaPlayer.getRMS(dataArray);
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            let rad = loud / 7;
            gn.gain.setValueAtTime(vol.value / 100, a.currentTime);
            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 255 * 60;
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(90 + i * (Math.PI * 2 / bufferLength));
                var r = barHeight / 60 * 255 + 25 * (i / bufferLength);
                var g = 250 * (i / bufferLength);
                var b = 50;
                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(0, 0 + rad, barWidth, barHeight);
                ctx.fillStyle = "rgb(255,255,255)";
                ctx.fillRect(0, 0 + rad + barHeight, barWidth, 1);
                ctx.restore();
            }
            ctx.beginPath();
            ctx.arc(centerX, centerY, rad, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgb(" + loud + ", " + loud + ",0)";
            ctx.fill();
            ctx.closePath()
        };
        renderFrame();
        button.addEventListener("click", function () {
            if (this.className == "MediaPlayerIcon icon-pause") {
                this.className = "MediaPlayerIcon icon-play";
                a.pause()
            } else {
                this.className = "MediaPlayerIcon icon-pause";
                a.play();
            };
            a.addEventListener("ended", function () {
                button.className = "MediaPlayerIcon icon-play";
                dur.value = dur.max;
            });
        });
        a.addEventListener('play', function() {
            button.className="MediaPlayerIcon icon-pause";
        });
        a.addEventListener('pause', function() {
            button.className="MediaPlayerIcon icon-play";
        });
        dur.addEventListener("change", function () {
            a.currentTime = dur.value;
        });
        setting.addEventListener("click", function () {
            if (vol.hidden == true) {
                vol.hidden = false;
            } else {
                vol.hidden = true;
            }
        });
        a.addEventListener("timeupdate", function () {
            dur.value = a.currentTime;
            dur.max = a.duration;
        });
    },
};
