function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else { obj[key] = value; } return obj;
} const getNumberInRange = (upper, lower = 0, negate = false) => {
  let result = Math.floor(Math.random() * upper + lower);
  if (negate) {
    return result *= Math.random() > 0.5 ? 1 : -1;
  } else {
    return result;
  }
};

class Star {
  constructor(options) {
    _defineProperty(this, "DEFAULTS", { fillColor: '#663399' }); _defineProperty(this, "STATE", { active: false, life: 0, velocityX: getNumberInRange(3, 1, true), velocityY: getNumberInRange(3, 1, true) }); _defineProperty(this, "initCanvas",
      () => {
        const { fillColor, size, rotation } = this.OPTIONS;
        const { canvas, context, opacity } = this.STATE;
        canvas.width = size;
        canvas.height = size;
        context.save();
        // Change to add some opacity 👍
        context.globalAlpha = 1;
        context.fillStyle = fillColor;
        context.translate(size / 2, size / 2);
        context.rotate(rotation * (Math.PI / 180));
        context.translate(size / -2, size / -2);
        context.beginPath();
        let p = 0;
        while (p <= 10) {
          let rotation = p * Math.PI / 5;
          let radius = p % 2 === 0 ? size / 2 : size / 4;
          context.lineTo(
            size / 2 + radius * Math.cos(rotation),
            size / 2 + radius * Math.sin(rotation));

          p++;
        }
        context.fill();
      }); _defineProperty(this, "activate",
        () => {
          this.STATE = Object.assign({}, this.STATE, {
            active: true
          });

        }); _defineProperty(this, "reset",
          () => {
            this.STATE = Object.assign({}, this.STATE, {
              active: false,
              life: 0,
              x: Math.floor(getNumberInRange(window.innerWidth, 1)),
              y: Math.floor(getNumberInRange(window.innerHeight, 1)),
              velocityX: getNumberInRange(3, 1, true),
              velocityY: getNumberInRange(3, 1, true),
              rotation: Math.floor(getNumberInRange(360))
            });

          }); _defineProperty(this, "update",
            () => {
              let { OPTIONS, STATE } = this;
              const { death } = OPTIONS;
              const { life, opacity, scale, velocityX, velocityY, x, y } = STATE;

              const ENTRY_STAGE = death * 0.25;
              const EXIT_STAGE = death * 0.75;

              let newOpacity = opacity;
              let newScale = scale;
              let newVelocityX = velocityX;
              let newVelocityY = velocityY;

              if (life >= EXIT_STAGE) {
                newVelocityX *= 1.075;
                newVelocityY *= 1.075;
              }

              this.STATE = Object.assign({}, STATE, {
                x: x + velocityX,
                y: y + velocityY,
                life: life + 1,
                velocityX: newVelocityX,
                velocityY: newVelocityY
              });

            }); _defineProperty(this, "render",

              parent => {
                const { STATE } = this;
                const { x, y, canvas } = STATE;
                parent.drawImage(canvas, x, y);
              }); const { x: _x, y: _y } = options; let { STATE: _STATE } = this; const _canvas = document.createElement('canvas'); const _context = _canvas.getContext('2d'); this.OPTIONS = Object.assign({}, this.DEFAULTS, options); this.STATE = Object.assign({}, this.STATE, { x: _x, y: _y, canvas: _canvas, context: _context }); this.initCanvas();
  }
}


class ShootingStars {
  constructor(config) {
    _defineProperty(this, "DEFAULTS", { particleLife: 300, particleRenderProbability: 0.5, amount: 5, trippy: false }); _defineProperty(this, "PARTICLES", []); _defineProperty(this, "reset",
      () => {
        this.PARTICLES = [];
        this.CANVAS.width = window.innerWidth;
        this.CANVAS.height = window.innerHeight;
        this.flush();
      }); _defineProperty(this, "flush",
        () => {
          const { PARTICLES, OPTIONS } = this;
          const { particleLife } = OPTIONS;
          for (let i = 0; i < OPTIONS.amount; i++) {
            const size = getNumberInRange(30, 10);
            const rotation = getNumberInRange(360);
            const x = getNumberInRange(window.innerWidth);
            const y = getNumberInRange(window.innerHeight);
            const death = getNumberInRange(particleLife, particleLife / 2);
            const colors = ['#e74c3c', '#22a7f0', '#663399', '#2eec71', '#f39c12', '#4ecdc4', '#1f3a93', '#9a12b3', '#f62459'];
            PARTICLES.push(
              new Star({
                size,
                rotation,
                x,
                y,
                death,
                fillColor: colors[Math.floor(Math.random() * colors.length)]
              }));


          }
        }); _defineProperty(this, "render",
          () => {
            const { CANVAS, CONTEXT, PARTICLES, OPTIONS } = this;
            CONTEXT.save();
            CONTEXT.clearRect(0, 0, window.innerWidth, window.innerHeight);
            const activeParticles = PARTICLES.filter(p => p.STATE.active);
            const inactiveParticles = PARTICLES.filter(p => !p.STATE.active);
            if (
              Math.random() > OPTIONS.particleRenderProbability &&
              activeParticles.length < OPTIONS.amount) {
              inactiveParticles[0].activate();
            }

            CONTEXT.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (let p = 0; p < PARTICLES.length; p++) {
              const PARTICLE = PARTICLES[p];
              if (PARTICLE) {
                if (
                  PARTICLE.STATE.life === PARTICLE.OPTIONS.death ||
                  PARTICLE.STATE.x > window.innerWidth ||
                  PARTICLE.STATE.x < -PARTICLE.OPTIONS.size ||
                  PARTICLE.STATE.y > window.innerHeight ||
                  PARTICLE.STATE.y < -PARTICLE.OPTIONS.size) {
                  PARTICLE.reset();
                } else if (PARTICLE.STATE.active) {
                  PARTICLE.update();
                  PARTICLE.render(CONTEXT);
                }
              }
            }
            CONTEXT.restore();
            // Uncomment to see those FPS stats 👍
            // console.log(new Date().toUTCString())
            requestAnimationFrame(() => this.render());
          }); this.ID = config.id; this.OPTIONS = Object.assign({}, this.DEFAULTS, config); this.CANVAS = document.getElementById(this.ID); this.CANVAS.width = window.innerWidth; this.CANVAS.height = window.innerHeight; this.CONTEXT = this.CANVAS.getContext('2d'); this.flush(); this.render();
  }
}

const myStars = new ShootingStars({ id: 'app', amount: 20 });
window.addEventListener(
  'resize',
  _.debounce(() => {
    myStars.reset();
  }, 250));