/**
 * Sampler
 *
 * @param config - {object} containing configuration options
 */
RedSampler = function(config) {
    this.state = config.state || true; // Muted(false)/Solo(true)/On(null)
    this.name  = config.name  || ''; // Name
    this.url   = config.url   || ''; // Location of sample
    this.steps = config.steps || [ // Pattern
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ];
}

/**
 * Sampler Sequencer
 *
 * @param instruments - [array] of RedSamplers
 * @param config - {object} containing configuration options
 */
RedAudio = function(instruments, config) {
    this.instruments = instruments;
    this.tempo       = config.tempo || 120;
    this.play        = config.play === undefined ? true : config.play
}

/**
 * Initialize audio context. Load buffered files from instruments. Set callback / looper for sequencer.
 */
RedAudio.prototype.initialize = function() {
    // Fix AudioContext compatibility
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context             = new AudioContext();

    // Get all instrument samples ready
    var sampleList      = this.getSamples();

    // Buffer files
    var buffer = new BufferLoader(
        context,
        sampleList,
        this.onLoadComplete.bind(this)
    );

    // Execute loader
    buffer.load();
}

/**
 * Start sequencer
 */
RedAudio.prototype.start = function() {
    // Calculate intervals given the tempo
    var interval = 60000 / this.tempo / 4;
    sequencerStep = 0;

    this.play = true;
    sequencerTimer = setInterval(this.run.bind(this), interval);
}

/**
 * Stop sequencer
 */
RedAudio.prototype.stop = function() {
    this.play = false;
    clearInterval(sequencerTimer);
}

/**
 * A typical sequencer routine
 */
RedAudio.prototype.run = function() {
    for (var index in this.instruments) {
        // Get current instrument
        var instrument = this.instruments[index];

        // Loop until the end of the pattern
        if (sequencerStep == instrument.steps.length) {
            sequencerStep = 0;
        }

        // Is this step active?
        if (instrument.steps[sequencerStep] === 1 && instrument.state) {
            var source = context.createBufferSource();
            source.buffer = buffer[index];
            source.connect(context.destination);
            source.start(source.buffer);
        }
    }

    // Next step
    this.next();
}

/**
 * Hit the next step in the sequencer
 */
RedAudio.prototype.next = function() {
    sequencerStep = sequencerStep + 1;
}

/**
 * Hit the previous step in the sequencer
 */
RedAudio.prototype.prev = function() {
    sequencerStep = sequencerStep - 1;
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
 * Callback for buffer loader. Begin sequencer
 * @param bufferData
 */
RedAudio.prototype.onLoadComplete = function(bufferData) {
    buffer = bufferData;

    // Create the timer
    if (this.play)
        this.start();
}