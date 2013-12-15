var samplers = [
        new RedSampler({
            'name': 'kick',
            'url': "../audio/kick.wav",
            'steps': [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
        }),
        new RedSampler({
            'name': 'snare',
            'url': "../audio/snare.wav",
            'steps': [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
        }),
        new RedSampler({
            'name': 'hat',
            'url': "../audio/hat.wav",
            'steps': [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1]
        })
    ],
    red = new RedAudio(samplers, {
        'tempo': 120,
        'play': true
    });

// Start it up!
red.initialize();

// red.stop();
