// Instrument
RedSampler = function(config) {
    this.name  = config.name || '';
    this.url   = config.url || '';
    this.steps = config.steps || [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]
}

// Sampler
RedAudio = function(instruments) {
    this.tempo          = 120;
    this.sequenceStep   = 0;
    this.instruments    = instruments;
    this.buffer         = {};
    this.bufferReturn   = {};
    this.sequencerTimer = [];
}

/**
 * Initialize audio context. Load buffered files from instruments. Set callback / looper for sequencer.
 */
RedAudio.prototype.initialize = function() {
    // Set up context
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    var sampleList = this.getSamples();

    // Load up files
    this.buffer = new BufferLoader(
        context,
        sampleList,
        this.sequencerTimerStart.bind(this)
    );

    this.buffer.load();
}

/**
 * Get urls from all Samplers to be processed for Sequencer
 */
RedAudio.prototype.getSamples = function() {
    var urlList = [];

    // Get all instruments paths
    for (var i in this.instruments) {
        urlList.push(this.instruments[i].url)
    }

    return urlList;
}

/**
 * Begin loop for each instrument
 */
RedAudio.prototype.sequencerTimerStart = function(bufferReturnData) {
    // Calculate intervals given the BPM
    var interval = 60000 / this.tempo / 4;
    this.bufferReturn = bufferReturnData;

    console.log("Setting the timer to ", interval, " seconds");

    // Create the timer
    this.sequencerTimer = setInterval(this.sequencerRoutine.bind(this), interval);
}

/**
 * A typical sequencer routine
 */
RedAudio.prototype.sequencerRoutine = function() {
    console.log("SequenceStep + 1 (" + (this.sequenceStep + 1) + ") * " + this.STEPS_PER_PATTERN);

    for (var index in this.instruments) {
        var instrument = this.instruments[index];
        // Loop full bar
        if (this.sequenceStep == instrument.steps.length -1)
            this.sequenceStep = -1;

        var source = context.createBufferSource();

        source.buffer = this.bufferReturn[index];
        source.connect(context.destination);
        // source.stop(source.buffer);

        // Is this step active?
        if(instrument.steps[this.sequenceStep] === 1)
            source.start(source.buffer);
        // increment step position
    }

    this.next();
}

RedAudio.prototype.next = function(callback) {
    this.sequenceStep = this.sequenceStep + 1;
}

var kick = new RedSampler({
        'name': 'kick',
        'url': "../audio/kick.wav",
        'steps': [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    });

var snare = new RedSampler({
        'name': 'snare',
        'url': "../audio/snare.wav",
        'steps': [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
    });

var red = new RedAudio([kick, snare]);

red.initialize();
