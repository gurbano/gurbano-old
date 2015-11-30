'use strict';

(function() {
    var Boid = window.Boid,
        canvas = document.querySelector('canvas'),
        context = canvas.getContext('2d'),
        canvasTrails, contextTrails,
        options = {
          mass: 1,
          maxSpeed: 5,
          maxForce: 1,
          edgeBehavior: 'bounce',
          inSightDistance: 400,
          tooCloseDistance: 20,
          count: 40,
          randomColors: false,
          clear: true,
          size: 6,
          trails: false
        };

    var flockers = [];
    while (flockers.length < options.count) {
        flockers.push(createFlocker());
    }

    function randomColor() {
      var rnd = 0xFFFFFF * Math.random();
      return '#' + Math.floor(rnd).toString(16);
    }

    function createFlocker() {
      var flocker = new Boid();
      flocker.position.x = canvas.width * Math.random();
      flocker.position.y = canvas.height * Math.random();
      flocker.velocity.x = 20 * Math.random() - 10;
      flocker.velocity.y = 20 * Math.random() - 10;
      flocker.userData.color = randomColor();
      return flocker;
    }

    function update() {
        for (var i = 0; i < flockers.length; i++) {
            flockers[i].flock(flockers).update();
        }
    }

    function render() {
        if (options.trails) {
            if (!contextTrails) {
                canvasTrails = document.createElement('canvas');
                canvasTrails.width = canvas.width;
                canvasTrails.height = canvas.height;
                contextTrails = canvasTrails.getContext('2d');
            }
            contextTrails.clearRect(0, 0, canvas.width, canvas.height);
            contextTrails.globalAlpha = 0.95;
            contextTrails.drawImage(canvas, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(canvasTrails, 0, 0);
        } else if (options.clear) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        context.fillStyle = 'black';

        for (var i = 0; i < flockers.length; i++) {
            var point = flockers[i].position;
            if (options.randomColors) {
                context.fillStyle = flockers[i].userData.color;
            }
            context.beginPath();
            context.arc(point.x, point.y, options.size / 2, 0, Math.PI * 2);
            context.fill();
        }
    }

    function loop() {
        window.requestAnimationFrame(loop);
        update();
        render();
    }
    loop();

    (function() {
        var gui = new window.dat.GUI();
        gui.add(options, 'mass', 0, 10).onChange(function(value) {
          flockers.forEach(function(flocker) {
            flocker.mass = value;
          });
        });
        gui.add(options, 'maxSpeed', 0, 100).onChange(function(value) {
          flockers.forEach(function(flocker) {
            flocker.maxSpeed = value;
          });
        });
        gui.add(options, 'maxForce', 0, 10).onChange(function(value) {
          flockers.forEach(function(flocker) {
            flocker.maxForce = value;
          });
        });
        gui.add(options, 'edgeBehavior', [
          'none',
          'wrap',
          'bounce'
        ]).onChange(function(value) {
          flockers.forEach(function(flocker) {
            flocker.edgeBehavior = value;
          });
        });
        gui.add(options, 'inSightDistance', 0, 500).onChange(function(value) {
          flockers.forEach(function(flocker) {
            flocker.inSightDistance = value;
          });
        });
        gui.add(options, 'tooCloseDistance', 0, 100).onChange(function(value) {
          flockers.forEach(function(flocker) {
            flocker.tooCloseDistance = value;
          });
        });
        gui.add(options, 'count', 1, 200).onChange(function(value) {
          while (flockers.length < value) {
              flockers.push(createFlocker());
          }
          while (flockers.length > value) {
              flockers.pop();
          }
        });
        gui.add(options, 'randomColors').name('random colors');
        gui.add(options, 'clear').name('clear canvas');
        gui.add(options, 'size', 1, 100);
        gui.add(options, 'trails');
    }());
}());
