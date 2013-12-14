RedAudio = function() {
    this.tempo = 120;
    this.sequenceStep = 0;
    this.instruments = [{
        'name': 'kick',
        'url': "../audio/kick.wav",
        'steps': [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    }];
    this.buffer = {};
    this.bufferReturn = {};
    this.sequencerTimer = [];
}

// Globalish
RedAudio.prototype.setup = function() {
    // Set up context
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    var urlList = [];

    // Get all instruments
    for (var i in this.instruments) {
        urlList.push(this.instruments[i].url)
    }

    // Load up files
    this.buffer = new BufferLoader(
        context,
        urlList,
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
    for (var i in this.instruments) {
        this.sequencerTimer[i] = setInterval(this.sequencerRoutine.bind(this, this.instruments[i], i), interval);
    }
}

// Per instrument
RedAudio.prototype.sequencerRoutine = function(instrument, index) {
    console.log("*** sequenceStep + 1 (" + (this.sequenceStep + 1) + ") * " + this.STEPS_PER_PATTERN);

    // Loop full bar
    if (this.sequenceStep == instrument.steps.length -1)
        this.sequenceStep = -1;

    var source = context.createBufferSource();

    source.buffer = this.bufferReturn[index];
    source.connect(context.destination);
    source.stop(this.buffer);

    // Is this step active?
    if(instrument.steps[this.sequenceStep] === 1)
        source.start(this.buffer);

    // increment step position
    this.next();
}

RedAudio.prototype.next = function(callback) {
    this.sequenceStep = this.sequenceStep + 1;
}

var red = new RedAudio();

red.setup();
