const recorder = require('node-record-lpcm16');
const fs = require('fs')

const file = fs.createWriteStream('test.wav', { encoding: 'binary' })

// Start recording from the microphone
const writeStream = recorder.record({
                    sampleRate: 44100,
                    channels: 1,
                    audioType: 'wav',
                    recorder: 'sox', 
                  })
                  .stream()
                  .on('error', err => {
                    console.error('recorder threw an error:', err)
                  })
                  .pipe(file)

writeStream.on('open', () => {
    console.log('Recording started');
})

writeStream.on('finish', () => {
  console.log('Recording finished');
  process.exit();
})

setTimeout(() => {
    writeStream.end();
}, 3000);
