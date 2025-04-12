class Neuron {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.connections = [];
        this.pulse = 0;
    }

    connect(neuron) {
        this.connections.push(neuron);
    }

    update() {
        this.pulse = Math.max(0, this.pulse - 0.05);
    }

    activate() {
        this.pulse = 1;
        this.connections.forEach(neuron => {
            if (Math.random() < 0.3) {
                neuron.activate();
            }
        });
    }
}

class NeuralNetwork {
    constructor() {
        this.neurons = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.className = 'neural-network';
        document.querySelector('.parallax-bg').appendChild(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.createNeurons();
        this.connectNeurons();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createNeurons() {
        const numNeurons = 20;
        for (let i = 0; i < numNeurons; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.neurons.push(new Neuron(x, y));
        }
    }

    connectNeurons() {
        this.neurons.forEach(neuron => {
            const numConnections = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < numConnections; i++) {
                const randomNeuron = this.neurons[Math.floor(Math.random() * this.neurons.length)];
                if (randomNeuron !== neuron) {
                    neuron.connect(randomNeuron);
                }
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = 'rgba(100, 255, 218, 0.1)';
        this.ctx.lineWidth = 1;

        this.neurons.forEach(neuron => {
            neuron.connections.forEach(target => {
                this.ctx.beginPath();
                this.ctx.moveTo(neuron.x, neuron.y);
                this.ctx.lineTo(target.x, target.y);
                this.ctx.stroke();
            });
        });

        this.neurons.forEach(neuron => {
            this.ctx.beginPath();
            this.ctx.arc(neuron.x, neuron.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(100, 255, 218, ${neuron.pulse})`;
            this.ctx.fill();
        });
    }

    animate() {
        this.neurons.forEach(neuron => neuron.update());
        

        if (Math.random() < 0.02) {
            const randomNeuron = this.neurons[Math.floor(Math.random() * this.neurons.length)];
            randomNeuron.activate();
        }

        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NeuralNetwork();
}); 