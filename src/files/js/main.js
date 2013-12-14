var bufferLoader,
    context = window.AudioContext ? window.AudioContext : window.webkitAudioContext;

var audio = {
    context: context,
    buffer: {},
    compatibility: {},
    files: [
        "../audio/kick.wav",
        "../audio/snare.wav",
        "../audio/hat.wav"
    ],
    proceed: true,
    source_loop: {},
    source_once: {},
    startTime: context.currentTime + 0.100,
    tempo: 120, // BPM (beats per minute)
    eighthNoteTime: (60 / 120) / 2,
};

function timer(bufferList) {
    var start = new Date().getTime(),
        bpm = 120 * 4 * audio.eighthNoteTime,
        time = 0,
        elapsed = '0.0';

    function instance() {
        time += bpm;

        elapsed = Math.floor(time / 100) / 10;

        if (Math.round(elapsed) == elapsed) {
            elapsed += '.0';
        }

        var diff = (new Date().getTime() - start) - time;

        play(bufferList[0], 0);
        // play(bufferList[1], 0);

        window.setTimeout(instance, (bpm - diff));
    }

    window.setTimeout(instance, bpm);
}

// function loop(bufferList) {
//     // Play 2 bars of the following:
//     play(bufferList[0], 0);
//     timer()
//     // for (var bar = 0; bar < 2; bar++) {
//     // var time = bar * 120 * audio.eighthNoteTime;
//     // Play the bass (kick) drum on beats 1, 5
//     // }
// }

function play(buffer, time) {
    // Create a context, add buffer, connect and start
    var source = context.createBufferSource();

    // Loop this sound
    console.log(source)
    // source.loop = true;
    // source.loopEnd = 1;

    // Connect and set buffer of source
    source.buffer = buffer;
    source.connect(context.destination);

    // If source.start doesn't exist, use noteOn as start
    if (!source.start)
        source.start = source.noteOn;
    source.start(time);
}

function initialize(bufferLoader, fileList, callback) {
    // Set up context
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    // Load up files
    bufferLoader = new BufferLoader(
        context,
        audio.files,
        callback
    );

    bufferLoader.load();
}

initialize(bufferLoader, audio.file, timer);
