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
    eighthNoteTime: (60 / 120) * 2,
};

/*
function play(buffer, time) {
    // Create a buffer
    var source = context.createBufferSource();

    // Connect and set buffer of source
    source.buffer = buffer;
    source.connect(context.destination);
    source.onended(finished)
    source.start(time);
}*/

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

initialize(bufferLoader, audio.file, finished);

// Assume context is a web audio context, buffer is a pre-loaded audio buffer.
var startOffset = 0;
var startTime = 0;

function pause() {
    source.stop();
    // Measure how much time passed since the last pause.
    startOffset += context.currentTime - startTime;
}

function play(buffer) {
    startTime = context.currentTime;
    var source = context.createBufferSource();
    // Connect graph
    source.buffer = buffer;
    source.connect(context.destination);
    // Start playback, but make sure we stay in bound of the buffer.
    source.start(0, startOffset % buffer.duration);
}

function finished (bufferList) {
    for (var bar = 0; bar < 2; bar++) {
        var time = startTime + bar * 8 * audio.eighthNoteTime;
        // Play the bass (kick) drum on beats 1, 5
        play(bufferList[0], time);
        // play(bufferList[0], time + 4 * audio.eighthNoteTime);

        // Play the snare drum on beats 3, 7
        // play(bufferList[1], time + 2 * audio.eighthNoteTime);
        // play(bufferList[1], time + 6 * audio.eighthNoteTime);

        // Play the hihat every eighth note.
        for (var i = 0; i < 8; ++i) {
            play(bufferList[2], time + i * audio.eighthNoteTime);
        }
    }

}




RedAudio = {
    sequenceStep: -1,
    STEPS_PER_PATTERN: 16
}

RedAudio.sequencerTimerStart = function() {
    // Calculate intervals given the BPM
    var interval = 60000 / 120 / 4;
    console.log("Setting the timer to ", interval, " seconds");
    // Create the timer
    this.sequencerTimer = setInterval(this.sequencerRoutine.bind(RedAudio), interval);
}

// total steps
// current step
    // ? is active




RedAudio.sequencerRoutine = function() {
    console.log("*** sequenceStep + 1 (" + (this.sequenceStep + 1) + ") === this.status.numberOfPatterns (" + this.status.numberOfPatterns + ") * " + this.STEPS_PER_PATTERN);

    var nextStep = (this.sequenceStep + 1) % (this.STEPS_PER_PATTERN * this.status.numberOfPatterns);

    // Play note
    if (this.status.steps[nextStep].active === 1) {
        // If the next step is active, turn the playing note off.
        this.audioManager.noteOff();
        // If there really is a note (not a pause), play it.
        if (this.status.steps[nextStep].note !== -1) {
            this.audioManager.noteOn(this.status.steps[nextStep].note - 33, Math.round(this.status.steps[nextStep].velocity * 127));
        }
    }

    //increment position
    this.sequenceStep = nextStep;
}

console.log(RedAudio)
