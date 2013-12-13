var context;
var bufferLoader;
var sourceList = [];
var $tracks = $('.w-tracks');

/**
 * Initialize the required assets and page controlls
 */
function initialize() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

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
 *
 *
 * @param bufferLoader A buffer class
 */
function loadSounds(bufferLoader) {
    // Load up files
    bufferLoader = new BufferLoader(
        context,
        getPaths(),
        finishedLoading
    );

    bufferLoader.load();
}

/**
 * Play all sounds when BufferLoader has completed loading
 *
 * @param bufferList List of buffered sounds
 */
function finishedLoading(bufferList) {
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
