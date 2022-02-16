window.player = {
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
        if (typeof(window.a)==='undefined') {
            window.a = new Audio();
        };
        var button = document.getElementById("MediaPlayerIcon-icon-play");
        a.addEventListener('play', function() {
            button.className="MediaPlayerIcon icon-play";
        });
        a.addEventListener('pause' function() {
            button.className="MediaPlayerIcon icon-pause";
        });
        button.addEventListener('click',function() {
            if (button.className=="MediaPlayerIcon icon-play") {
                a.pause();
            }else{
                a.play();
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
        a.play();
        var context = new AudioContext;
        console.log(context);
        var vol = document.getElementById('Media-Player-Control-volume');
        var position = document.getElementById('time-position');
        var src = context.createMediaElementSource(audio);
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
        var dataArray1 = new Uint8Array(fft_Size);
        var maxHeight = canvas.height / 2;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var barWidth = WIDTH / bufferLength;
        var barHeight;
        function renderFrame(){
            requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(dataArray);
            analyser.getByteTimeDomainData(dataArray1);
            var curtime = player.formatTime(a.currentTime);
            var time = formatTime(a.duration);
            position.innerHTML = curtime + " / " + time;
            loud = getRMS(dataArray);
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
            ctx.fillStyle = "rgb(" + calcRMSColor(loud) + ", " + calcRMSColor(loud) + ",0)";
            ctx.fill();
            ctx.closePath()
        };
        renderFrame();
        a.addEventListener('ended', function() {
            context = null;
        });
    },
};
