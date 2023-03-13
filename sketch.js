var song;
var fft;
var img;
var whiten = 50;
var particles = [];

function preload(){
    song = loadSound('money machine.mp3');
    img = loadImage('kevdozer1_the_stone_tower_temple_from_majoras_mask_painted_by_m_373f8a9a-98f2-4945-a091-e3580d76aa2f.png');
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    imageMode(CENTER);
    rectMode(CENTER);
    fft = new p5.FFT(); // return array of values describing sound at that moment

    img.filter(BLUR, 12);
}

function draw() {
    background(0);

    translate(width/2, height/2);
    fft.analyze();
    amp = fft.getEnergy(20, 200);

    push();
    if(amp > 180){
      rotate(random(-2, 2));
    }
    image(img, 0, 0, width + 20, height + 20);
    pop();

    var alpha = map(amp, 0, 255, 220, 80);
    fill(0, alpha);
    noStroke();
    rect(0, 0, width, height);

    stroke(255);
    strokeWeight(3);
    noFill();

    var wave = fft.waveform(); // waveform() returns an array of values between -1 and 1
    for(var t = -1; t <= 1; t += 2){
      beginShape();
      for(i = 0; i <= 180; i+=0.5){
          var index = floor(map(i, 0, 180, 0, wave.length - 1));

          var r = map(wave[index], -1, 1, 150, 350)

          var x = r * sin(i) * t;
          var y = r * cos(i);
          vertex(x, y);
      }
      endShape();
    }
    var p = new Particle();
    particles.push(p);
    for(var i = particles.length-1 ; i >= 0; i--){
      if(particles[i].edges){
        particles[i].update(amp > 180);
        particles[i].show();
      } else{
        particles.splice(i, 1);
      }
    }
}

function mouseClicked(){
    if (song.isPlaying()){
        song.pause();
        noLoop();
    } else {
        song.play();
        loop();
    }
}

class Particle{
  constructor(){
    this.pos = p5.Vector.random2D().mult(250);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.001, .0001));
    this.w = random(3, 5);
    // pick a random color from img
    var x = floor(random(0, img.width));
    var y = floor(random(0, img.height));
    this.c = img.get(x, y);
    this.c = color(this.c[0] + whiten, this.c[1] + whiten, this.c[2] + whiten, 100);
  }
  update(cond){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if(cond){
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }
  edges(){// return true if particle is out of bounds
    if(this.pos.x > width/2 || this.pos.x < -width/2 || this.pos.y > height/2 || this.pos.y < -height/2){
      return true;
    } else{
      return false;
    }
  }
  show(){
    noStroke();
    fill(this.c);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
}