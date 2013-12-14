// var bufferLoader,
//     context = window.AudioContext ? window.AudioContext : window.webkitAudioContext;

// var audio = {
//     context: context,
//     buffer: {},
//     compatibility: {},
//     files: [
//         "../audio/kick.wav",
//         "../audio/snare.wav",
//         "../audio/hat.wav"
//     ],
//     proceed: true,
//     source_loop: {},
//     source_once: {},
//     startTime: context.currentTime + 0.100,
//     tempo: 120, // BPM (beats per minute)
//     eighthNoteTime: (60 / 120) * 2,
// };

// function initialize(bufferLoader, fileList, callback) {
//     // Set up context
//     window.AudioContext = window.AudioContext || window.webkitAudioContext;
//     context = new AudioContext();

//     // Load up files
//     bufferLoader = new BufferLoader(
//         context,
//         audio.files,
//         callback
//     );

//     bufferLoader.load();
// }

// function pause() {
//     source.stop();
//     // Measure how much time passed since the last pause.
//     startOffset += context.currentTime - startTime;
// }



// // Assume context is a web audio context, buffer is a pre-loaded audio buffer.
// var startOffset = 0;
// var startTime = 0;

// initialize(audio.buffer, audio.file, audio.callback);


// total steps
// current step
    // ? is active
RedAudio = function() {
    this.sequenceStep = 0;
    this.STEPS_PER_PATTERN = 16;
    this.steps = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0];
    this.buffer = {};
    this.bufferReturn = {};
    this.files = [
        "../audio/kick.wav"
    ];
}

RedAudio.prototype.setup = function() {
    // Set up context
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    // Load up files
    this.buffer = new BufferLoader(
        context,
        this.files,
        this.sequencerTimerStart.bind(this)
    );

    this.buffer.load();
}

RedAudio.prototype.sequencerTimerStart = function(bufferReturnData) {
    // Calculate intervals given the BPM
    var interval = 60000 / 120 / 4;
    this.bufferReturn = bufferReturnData;

    console.log("Setting the timer to ", interval, " seconds");
    // console.log(buffers);
    // Create the timer
    this.sequencerTimer = setInterval(this.sequencerRoutine.bind(this), interval);
}

RedAudio.prototype.sequencerRoutine = function() {
    console.log(this.bufferReturn);
    // console.log("*** sequenceStep + 1 (" + (this.sequenceStep + 1) + ") === this.status.numberOfPatterns (" + this.status.numberOfPatterns + ") * " + this.STEPS_PER_PATTERN);

    if (this.sequenceStep == this.steps.length)
        this.sequenceStep = 0;
    // Play note
    // if (this.steps[this.sequenceStep] === 1) {
    //     console.log('HIT');
    //     // If the next step is active, turn the playing note off.
    //     kick.stop();
    //     // If there really is a note (not a pause), play it.
    //     kick.start(0);
    // }

    startTime = context.currentTime;
    var source = context.createBufferSource();

    // Connect graph
    source.buffer = this.bufferReturn[0];
    source.connect(context.destination);
    // Start playback, but make sure we stay in bound of the buffer.

    if(this.steps[this.sequenceStep] === 1)
        source.start(this.buffer);

    //increment position
    this.sequenceStep = this.sequenceStep + 1
}

RedAudio.prototype.get = function() {
    return this;
}
RedAudio.prototype.kick = function() {
    startTime = context.currentTime;
    var source = context.createBufferSource();
    // Connect graph
    source.buffer = this.buffer;
    source.connect(context.destination);
    // Start playback, but make sure we stay in bound of the buffer.

    return source; // source.start(0, startOffset % buffer.duration);
}

var red = new RedAudio();

red.setup();
console.log('Get red: ', red.get());
