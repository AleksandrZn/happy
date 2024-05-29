// helper functions
const PI2 = Math.PI * 2
const random = (min, max) => Math.random() * (max - min + 1) + min | 0
const timestamp = _ => new Date().getTime()

// container
class Birthday {
  constructor() {
    this.resize()

    // create a lovely place to store the firework
    this.fireworks = []
    this.counter = 0

  }
  
  resize() {
    this.width = canvas.width = window.innerWidth
    let center = this.width / 2 | 0
    this.spawnA = center - center / 4 | 0
    this.spawnB = center + center / 4 | 0
    
    this.height = canvas.height = window.innerHeight
    this.spawnC = this.height * .1
    this.spawnD = this.height * .5
    
  }
  
  onClick(evt) {
     let x = evt.clientX || evt.touches && evt.touches[0].pageX
     let y = evt.clientY || evt.touches && evt.touches[0].pageY
     
     let count = random(3,5)
     for(let i = 0; i < count; i++) this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        x,
        y,
        random(0, 260),
        random(30, 110)))
          
     this.counter = -1
     
  }
  
  update(delta) {
    ctx.globalCompositeOperation = 'hard-light'
    ctx.fillStyle = `rgba(20,20,20,${ 7 * delta })`
    ctx.fillRect(0, 0, this.width, this.height)

    ctx.globalCompositeOperation = 'lighter'
    for (let firework of this.fireworks) firework.update(delta)

    // if enough time passed... create new new firework
    this.counter += delta * 3 // each second
    if (this.counter >= 1) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        random(0, this.width),
        random(this.spawnC, this.spawnD),
        random(0, 360),
        random(30, 110)))
      this.counter = 0
    }

    // remove the dead fireworks
    if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead)

  }
}

class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    this.dead = false
    this.offsprings = offsprings

    this.x = x
    this.y = y
    this.targetX = targetX
    this.targetY = targetY

    this.shade = shade
    this.history = []
  }
  update(delta) {
    if (this.dead) return

    let xDiff = this.targetX - this.x
    let yDiff = this.targetY - this.y
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) { // is still moving
      this.x += xDiff * 2 * delta
      this.y += yDiff * 2 * delta

      this.history.push({
        x: this.x,
        y: this.y
      })

      if (this.history.length > 20) this.history.shift()

    } else {
      if (this.offsprings && !this.madeChilds) {
        
        let babies = this.offsprings / 2
        for (let i = 0; i < babies; i++) {
          let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0
          let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0

          birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0))

        }

      }
      this.madeChilds = true
      this.history.shift()
    }
    
    if (this.history.length === 0) this.dead = true
    else if (this.offsprings) { 
        for (let i = 0; this.history.length > i; i++) {
          let point = this.history[i]
          ctx.beginPath()
          ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)'
          ctx.arc(point.x, point.y, 1, 0, PI2, false)
          ctx.fill()
        } 
      } else {
      ctx.beginPath()
      ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)'
      ctx.arc(this.x, this.y, 1, 0, PI2, false)
      ctx.fill()
    }

  }
}

let canvas = document.getElementById('birthday')
let ctx = canvas.getContext('2d')

let then = timestamp()

let birthday = new Birthday
window.onresize = () => birthday.resize()
document.onclick = evt => birthday.onClick(evt)
document.ontouchstart = evt => birthday.onClick(evt)

  ;(function loop(){
  	requestAnimationFrame(loop)

  	let now = timestamp()
  	let delta = now - then

    then = now
    birthday.update(delta / 1000)
  	

  })()

  //!!!!!!!!!!!!!!!!!!!!!!!!!

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const notes = [
{ f: 262, d: .5, t: "Hap", p: p1 },
{ f: 262, d: .5, t: "py&nbsp;", p: p1 },
{ f: 294, d: 1, t: "Birth", p: p1 },
{ f: 262, d: 1, t: "day&nbsp;", p: p1 },
{ f: 349, d: 1, t: "To&nbsp;", p: p1 },
{ f: 330, d: 2, t: "You", p: p1 },

{ f: 262, d: .5, t: "Hap", p: p2 },
{ f: 262, d: .5, t: "py&nbsp;", p: p2 },
{ f: 294, d: 1, t: "Birth", p: p2 },
{ f: 262, d: 1, t: "day&nbsp;", p: p2 },
{ f: 392, d: 1, t: "To&nbsp;", p: p2 },
{ f: 349, d: 2, t: "You", p: p2 },

{ f: 262, d: .5, t: "Hap", p: p3 },
{ f: 262, d: .5, t: "py&nbsp;", p: p3 },
{ f: 523, d: 1, t: "Birth", p: p3 },
{ f: 440, d: 1, t: "day&nbsp;", p: p3 },
{ f: 349, d: 1, t: "Dear&nbsp;", p: p3 },
{ f: 330, d: 1, t: "Ma", p: p3 },
{ f: 294, d: 3, t: "ma", p: p3 },

{ f: 466, d: .5, t: "Hap", p: p4 },
{ f: 466, d: .5, t: "py&nbsp;", p: p4 },
{ f: 440, d: 1, t: "Birth", p: p4 },
{ f: 349, d: 1, t: "day&nbsp;", p: p4 },
{ f: 392, d: 1, t: "To&nbsp;", p: p4 },
{ f: 349, d: 2, t: "You", p: p4 }];


//DOM
notes.map(n => createSpan(n));

function createSpan(n) {
  n.sp = document.createElement("span");
  n.sp.innerHTML = n.t;
  n.p.appendChild(n.sp);
}

// SOUND
let speed = inputSpeed.value;
let flag = false;
let sounds = [];

class Sound {
  constructor(freq, dur, i) {
    this.stop = true;
    this.frequency = freq; // la frecuencia
    this.waveform = "triangle"; // la forma de onda
    this.dur = dur; // la duración en segundos
    this.speed = this.dur * speed;
    this.initialGain = .15;
    this.index = i;
    this.sp = notes[i].sp;
  }

  cease() {
    this.stop = true;
    this.sp.classList.remove("jump");
    //this.sp.style.animationDuration = `${this.speed}s`;
    if (this.index < sounds.length - 1) {sounds[this.index + 1].play();}
    if (this.index == sounds.length - 1) {flag = false;}
  }

  play() {
    // crea un nuevo oscillator
    this.oscillator = audioCtx.createOscillator();
    // crea un nuevo nodo de ganancia 
    this.gain = audioCtx.createGain();
    // establece el valor inicial del volumen del sonido 
    this.gain.gain.value = this.initialGain;
    // establece el tipo de oscillator  
    this.oscillator.type = this.waveform;
    // y el valor de la frecuencia 
    this.oscillator.frequency.value = this.frequency;
    // el volumen del sonido baja exponencialmente     
    this.gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + this.speed);
    // conecta el oscillator con el nodo de ganancia 
    this.oscillator.connect(this.gain);
    // y la ganancia con el dispositivo de destino
    this.gain.connect(audioCtx.destination);
    // inicia el oscillator 
    this.oscillator.start(audioCtx.currentTime);
    this.sp.setAttribute("class", "jump");
    this.stop = false;
    // para el oscillator después de un tiempo (this.speed) 
    this.oscillator.stop(audioCtx.currentTime + this.speed);
    this.oscillator.onended = () => {this.cease();};
  }}


for (let i = 0; i < notes.length; i++) {
  let sound = new Sound(notes[i].f, notes[i].d, i);
  sounds.push(sound);
}


// EVENTS
wishes.addEventListener("click", function (e) {
  if (e.target.id != "inputSpeed" && !flag) {
    sounds[0].play();
    flag = true;}
}, false);


inputSpeed.addEventListener("input", function (e) {
  speed = this.value;
  sounds.map(s => {
    s.speed = s.dur * speed;
  });
}, false);

// CANVAS

let requestId = null;

const colors = ["#93DFB8", "#FFC8BA", "#E3AAD6", "#B5D8EB", "#FFBDD8"];

class Particle {
  constructor() {
    this.x = Math.random() * cw;
    this.y = Math.random() * ch;
    this.r = 15 + ~~(Math.random() * 20); //radius of the circumcircle
    this.l = 3 + ~~(Math.random() * 2); //polygon sides
    this.a = 2 * Math.PI / this.l; // angle between polygon vertices
    this.rot = Math.random() * Math.PI; // polygon rotation
    this.speed = .05 + Math.random() / 2;
    this.rotSpeed = 0.005 + Math.random() * .005;
    this.color = colors[~~(Math.random() * colors.length)];
  }
  update() {
    if (this.y < -this.r) {
      this.y = ch + this.r;
      this.x = Math.random() * cw;
    }
    this.y -= this.speed;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.beginPath();
    for (let i = 0; i < this.l; i++) {
      let x = this.r * Math.cos(this.a * i);
      let y = this.r * Math.sin(this.a * i);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.color;
    ctx.stroke();

    ctx.restore();
  }}



let particles = [];
for (let i = 0; i < 20; i++) {
  let p = new Particle();
  particles.push(p);
}



function Draw() {
  requestId = window.requestAnimationFrame(Draw);
  //ctx.globalAlpha=0.65;
  ctx.clearRect(0, 0, cw, ch);
  particles.map(p => {
    p.rot += p.rotSpeed;
    p.update();
    p.draw();
  });

}


function Init() {
  if (requestId) {
    window.cancelAnimationFrame(requestId);
    requestId = null;
  }

  //particles.map((p) => p.update());
  Draw();
};

setTimeout(function () {
  Init();
  window.addEventListener('resize', Init, false);
}, 15);