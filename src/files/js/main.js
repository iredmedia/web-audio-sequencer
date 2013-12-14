var context,
    bufferLoader,
    sourceList = [],
    $context = $('.page-content'),
    $tracks = $context.find('.w-tracks'),
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



var list = [
    "../audio/kick.wav",
    "../audio/snare.wav",
    "../audio/hat.wav"
];


function playNow(bufferList) {
    // play(list[0], time + 4 * eighthNoteTime);

    // We'll start playing the rhythm 100 milliseconds from "now"
    var startTime = context.currentTime + 0.100;
    var tempo = 120; // BPM (beats per minute)
    var eighthNoteTime = (60 / tempo) / 2;

    playLoop(startTime, tempo, eighthNoteTime);
}

function playLoop(startTime, tempo, eighthNoteTime) {
    // Play 2 bars of the following:
    for (var bar = 0; bar < 2; bar++) {
        var time = startTime + bar * 8 * eighthNoteTime;

        play(bufferList[0], time + 4 * eighthNoteTime);

        // Play the bass (kick) drum on beats 1, 5
        // play(list[0], time);

        // Play the snare drum on beats 3, 7
        // play(list[1], time + 2 * eighthNoteTime);
        // play(list[1], time + 6 * eighthNoteTime);

        // Play the hi-hat every eighthh note.
        // for (var i = 0; i < 8; ++i) {
        //     // play(list[2], time + i * eighthNoteTime);
        // }
    }
}

initialize();
playNow();
loadSounds(bufferLoader, list);

/**
 * Create sequencer
 *
 * @param bars
 * @param instruments
 */

function createGrid(bars, instruments) {
    var $template = $("<input type='checkbox'>"),
        indexRow, indexColumn;

    for (indexRow = 0; indexRow < bars; indexRow++) {
        var rowName = 'row-' + indexRow,
            $row = $('<div class="' + rowName + '"></div>').appendTo($sequencer);

        $row.append('<label>Instrument</label>');

        for (indexColumn = 0; indexColumn < instruments; indexColumn++) {
            $row.append($template.attr('value', indexColumn * 10).clone());
        }
    }

    return $sequencer;
}



function setupSequencer(argument) {
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
    // setupSequencer();

    // Attach button handlers
    // setupControls();
}

/**
 * Setup click handlers for play/stop
 */

function setupControls() {
    $('.play').click(function() {
        stopAll(sourceList);
        loadSounds(bufferLoader, getPaths());
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
 * @param fileList A list of wav files
 */

function loadSounds(bufferLoader, fileList) {
    // Load up files
    bufferLoader = new BufferLoader(
        context,
        fileList,
        playNow
        // playAll
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
