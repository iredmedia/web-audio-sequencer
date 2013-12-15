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
 * Sequencer
 *
 * @param instruments - [array] of RedSamplers
 * @param config - {object} containing configuration options
 */
RedAudio = function(instruments, config) {
    this.instruments = instruments;
    this.tempo       = config.tempo || 120;
    this.play        = config.play === undefined ? true : config.play
    $sequencer       = config.context || $('.w-sequencer');
}


/**
 * Build start/stop buttons, attach handlers.
 */
RedAudio.prototype.buildControlsDOM = function() {
    var wrap  = $('<div class="controls"></div>'),
        start = $('<button class="play">Play</button>'),
        stop  = $('<button class="stop">Stop</button>');

    wrap.on('click', '.play', $.proxy(function(){
        this.stop();
        this.start();
    }, this)).on('click', '.stop', $.proxy(function(){
        this.stop();
    }, this));

    wrap.append(start).append(stop);
    $sequencer.after(wrap);
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

    this.buildSequencerDOM();
    this.buildControlsDOM();

    this.setPattern('kick');
    this.setPattern('snare');
    this.setPattern('hat');

    this.getPattern('kick');
    this.getPattern('snare');
    this.getPattern('hat');
}

/**
 * Set pattern from config
 */
RedAudio.prototype.getInstrumentByName = function(instrumentName) {
    for (var index in this.instruments) {
        if (this.instruments[index].name == instrumentName) {
            return this.instruments[index];

        }
    }
}

/**
 * Build interface
 */
RedAudio.prototype.buildSequencerDOM = function() {
    for (var index in this.instruments) {
        var $row  = $('<div class="row"></div>'),
            $step = $('<input type="checkbox">');

        // Create a new instrument
        var row = $row.appendTo($sequencer);
        row.prepend('<label>' + this.instruments[index].name +'</label>')

        row.attr('data-instrument', this.instruments[index].name);

        // Create a step based on the instruments pattern
        for (var steps in this.instruments[index].steps) {
            var step = $step.clone().appendTo(row);
            step.attr('data-step', parseInt(steps) + 1);
        }
    }
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
 * Return pattern from DOM
 */
RedAudio.prototype.getPattern = function(instrumentName) {
    var name = instrumentName,
        pattern = [];

    $sequencer.find('[data-instrument="' + name +'"]').find('input').each(function(index, value){
        pattern.push($(value).prop('checked'));
    });
}

/**
 * Set pattern from config
 */
RedAudio.prototype.setPattern = function(instrumentName) {
    var instrument = this.getInstrumentByName(instrumentName);

    for (var index in instrument.steps) {
        $sequencer.find('[data-instrument="' + name +'"]').eq(index).prop('checked', true);

        if (instrument.steps[index] === 1)
            $sequencer.find('[data-instrument="' + instrument.name +'"]').find('input').eq(index).prop('checked', 'checked');
    }
}

/**
 * Callback for buffer loader. Begin sequencer
 *
 * @param bufferData
 */
RedAudio.prototype.onLoadComplete = function(bufferData) {
    buffer = bufferData;

    // Create the timer
    if (this.play)
        this.start();
}
