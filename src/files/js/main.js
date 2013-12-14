var context,
    bufferLoader,
    sourceList = [],
    $context   = $('.page-content'),
    $tracks    = $context.find('.w-tracks'),
    $sequencer = $context.find('.w-sequencer');

var audio = {
    buffer: {},
    compatibility: {},
    files: [
        'synth.wav',
        'beat.wav'
    ],
    proceed: true,
    source_loop: {},
    source_once: {}
};

/**
 * Create sequencer
 *
 * @param bars
 * @param instruments
 */
function createGrid (bars, instruments) {
    var $template = $("<input type='checkbox'>"),
        indexRow, indexColumn;

    for (indexRow = 0; indexRow < bars; indexRow++) {
        var rowName = 'row-' + indexRow,
            $row    = $('<div class="' + rowName + '"></div>').appendTo($sequencer);

        $row.append('<label>Instrument</label>');

        for (indexColumn = 0; indexColumn < instruments; indexColumn++) {
            $row.append($template.clone());
        }
    }

    return $sequencer;
}



function setupSequencer (argument) {
    // Create step sequencer
    var labels = createGrid(16, 16).find('label');
    // labels.append('<input type="file">');
}

/**
 * Initialize the required assets and page controlls
 */
function initialize() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    // setup step sequencer (grid)
    setupSequencer();

    // Attach button handlers
    setupControls();
}

/**
 * Setup click handlers for play/stop
 */
function setupControls() {
    $('.play').click(function() {
        stopAll(sourceList);
        loadSounds(bufferLoader);
    console.log(context.currentTime);
    });

    $('.stop').click(function() {
        stopAll(sourceList);
    })
}

/**
 * Retrieve paths for sounds to play
 */
function getPaths() {
    var list = [];
    // Get the list of files to play
    $tracks.find('input:checked').each(function(index) {
        list[index] = $(this).attr('data-file');
    });

    return list;
}

/**
 * Buffer list of sounds
 *
 * @param bufferLoader A buffer class
 */
function loadSounds(bufferLoader) {
    // Load up files
    bufferLoader = new BufferLoader(
        context,
        getPaths(),
        playAll
    );

    bufferLoader.load();
}

/**
 * Play all sounds when BufferLoader has completed loading
 *
 * @param bufferList List of buffered sounds
 */
function playAll(bufferList) {
    for (sound in bufferList) {
        play(bufferList[sound], 0)
    }
}

/**
 * Stop all sounds in the soundlist
 *
 * @param sourceList List of sound sources
 */
function stopAll(sourceList) {
    for (source in sourceList) {
        if (sourceList[source]) {
            stop(sourceList[source]);
        }
    }
}

/**
 * Stop a single sound
 *
 * @param sound Individual sound
 */
function stop(sound) {
    sound.stop(0);
    sound.disconnect(context.destination);
    delete sound;
}

/**
 * Play a single sound
 *
 * @param buffer
 * @param time
 */
function play(buffer, time) {
    // Create a context, add buffer, connect and start
    var source = context.createBufferSource();

    // Loop this sound
    source.loop = true;

    // If time is set
    time = time ? time : 0;
    // Connect and set buffer of source
    source.buffer = buffer;
    source.connect(context.destination);
    // If source.start doesn't exist, use noteOn as start
    if (!source.start)
      source.start = source.noteOn;
    source.start(time);

    // Add to collection
    sourceList.push(source);
}

window.onload = initialize;
