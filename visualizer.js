var song;

function preload(){
    song = loadSound('assets/01.mp3');
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    fft = new p5.FFT(); // return array of values describing sound at that moment
}

function draw() {
    background(0);

    var wave = fft.waveform(); // waveform() returns an array of values between -1 and 1
    for(i = 0; i < width; i++){
        var index = floor(map(i, 0, width, 0, wave.length));
        var x = i;
        var y = wave[index] * 300 + height/2;
        
    }
}

function mouseClicked(){
    if (song.isPlaying()){
        song.pause();
    } else {
        song.play();
    }
}