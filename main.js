const recorder = require('node-record-lpcm16');
const fs = require('fs');
const vosk = require('vosk');

const file = fs.createWriteStream('test.wav', { encoding: 'binary' });
const FILE_NAME = "test.wav"
const MODEL_PATH = 'vosk-model-en-us-0.22';
const SAMPLE_RATE = 44100;

if (!fs.existsSync(MODEL_PATH)) {
    console.log("Please download the model from https://alphacephei.com/vosk/models and unpack as " + MODEL_PATH + " in the current folder.")
    process.exit()
}

if (process.argv.length > 2) {
    FILE_NAME = process.argv[2]
}
    
vosk.setLogLevel(0);
const model = new vosk.Model(MODEL_PATH);
const rec = new vosk.Recognizer({model: model, sampleRate: SAMPLE_RATE});

// Start recording from the microphone
const writeStream = recorder.record({
    sampleRate: SAMPLE_RATE,
    channels: 1,
    audioType: 'wav',
    recorder: 'sox', 
})
    .stream()
    .on('error', err => {
        console.error('recorder threw an error:', err);
    })
    .pipe(file);

writeStream.on('open', () => {
    console.log('Recording started');
});

writeStream.on('data', (data) => {
    if (rec.acceptWaveform(data)) {
        console.log(rec.result());
    }
});

writeStream.on('finish', () => {
    console.log('Recording finished');
    process.exit();
});

setTimeout(() => {
    writeStream.end();
}, 10000);
