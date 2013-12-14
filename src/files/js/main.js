RedAudio = function() {
    this.tempo = 120;
    this.sequenceStep = -1;
    this.STEPS_PER_PATTERN = 16;
    this.steps = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0];
    this.buffer = {};
    this.bufferReturn = {};
    this.files = [
        "../audio/kick.wav"
    ];
}

// Globalish
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

// Per instrument
RedAudio.prototype.sequencerTimerStart = function(bufferReturnData) {
    // Calculate intervals given the BPM
    var interval = 60000 / this.tempo / 4;
    this.bufferReturn = bufferReturnData;

    console.log("Setting the timer to ", interval, " seconds");

    // Create the timer
    this.sequencerTimer = setInterval(this.sequencerRoutine.bind(this), interval);
}

// Per instrument
RedAudio.prototype.sequencerRoutine = function() {
    console.log("*** sequenceStep + 1 (" + (this.sequenceStep + 1) + ") * " + this.STEPS_PER_PATTERN);

    // Loop full bar
    if (this.sequenceStep == this.steps.length -1)
        this.sequenceStep = -1;

    var source = context.createBufferSource();

    source.buffer = this.bufferReturn[0];
    source.connect(context.destination);

    // Is this step active?
    if(this.steps[this.sequenceStep] === 1)
        source.start(this.buffer);

    // increment step position
    this.next();
}

RedAudio.prototype.next = function(callback) {
    this.sequenceStep = this.sequenceStep + 1;
}

var red = new RedAudio();

red.setup();
