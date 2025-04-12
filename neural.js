class Neuron {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.connections = [];
        this.activation = 0;
        this.pulse = 0;
    }

    connect(other) {
        this.connections.push(other);
    }

    activate() {
        this.activation = 1;
        this.pulse = 1;
    }

    update() {
        if (this.activation > 0) {
            this.activation -= 0.05;
            this.pulse = this.activation;
        }
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
        this.createConnections();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createNeurons() {
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.neurons.push(new Neuron(x, y));
        }
    }

    createConnections() {
        for (let i = 0; i < this.neurons.length; i++) {
            for (let j = i + 1; j < this.neurons.length; j++) {
                if (Math.random() < 0.3) {
                    this.neurons[i].connect(this.neurons[j]);
                    this.neurons[j].connect(this.neurons[i]);
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        this.ctx.lineWidth = 1;

        for (const neuron of this.neurons) {
            for (const connection of neuron.connections) {
                this.ctx.beginPath();
                this.ctx.moveTo(neuron.x, neuron.y);
                this.ctx.lineTo(connection.x, connection.y);
                this.ctx.stroke();
            }
        }

        for (const neuron of this.neurons) {
            this.ctx.beginPath();
            this.ctx.arc(neuron.x, neuron.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${neuron.pulse * 0.5})`;
            this.ctx.fill();
        }
    }

    animate() {
        this.draw();
        for (const neuron of this.neurons) {
            neuron.update();
        }
        if (Math.random() < 0.02) {
            const randomNeuron = this.neurons[Math.floor(Math.random() * this.neurons.length)];
            randomNeuron.activate();
        }
        requestAnimationFrame(() => this.animate());
    }
}

new NeuralNetwork(); 