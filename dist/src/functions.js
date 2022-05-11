window.functions = {
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
}
