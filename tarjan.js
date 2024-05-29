const fs = require('fs');

// Function to read JSON from file
function readGraphFromFile(filePath) {
    const jsonString = fs.readFileSync(filePath);
    return JSON.parse(jsonString);
}

// Class to represent a Graph
class Graph {
    constructor(vertices) {
        this.vertices = vertices;  // Number of vertices
        this.adjList = new Map();  // Adjacency list
        // Initialize all vertices in the adjacency list
        for (let i = 1; i <= vertices; i++) {
            this.addVertex(i);
        }
    }

    addVertex(v) {
        if (!this.adjList.has(v)) {
            this.adjList.set(v, []);
        }
    }

    addEdge(v, w) {
        if (this.adjList.has(v)) {
            this.adjList.get(v).push(w);
        } else {
            console.error(`Vertex ${v} does not exist.`);
        }
    }

    // Function to perform Tarjan's algorithm
    tarjan() {
        const index = { value: 0 };
        const stack = [];
        const indices = new Map();
        const lowLinks = new Map();
        const onStack = new Map();
        const sccs = [];

        for (let v of this.adjList.keys()) {
            if (!indices.has(v)) {
                this.strongConnect(v, index, stack, indices, lowLinks, onStack, sccs);
            }
        }
        return sccs;
    }

    strongConnect(v, index, stack, indices, lowLinks, onStack, sccs) {
        indices.set(v, index.value);
        lowLinks.set(v, index.value);
        index.value++;
        stack.push(v);
        onStack.set(v, true);

        for (let w of this.adjList.get(v)) {
            if (!indices.has(w)) {
                this.strongConnect(w, index, stack, indices, lowLinks, onStack, sccs);
                lowLinks.set(v, Math.min(lowLinks.get(v), lowLinks.get(w)));
            } else if (onStack.get(w)) {
                lowLinks.set(v, Math.min(lowLinks.get(v), indices.get(w)));
            }
        }

        // If v is a root node, pop the stack and generate an SCC
        if (lowLinks.get(v) === indices.get(v)) {
            const scc = [];
            let w;
            do {
                w = stack.pop();
                onStack.set(w, false);
                scc.push(w);
            } while (w !== v);
            if (scc.length > 1) {
                sccs.push(scc);
            }
        }
    }
}

// Example to load graph data from file and detect cycles
const graphData = readGraphFromFile('graph.json');
const graph = new Graph(graphData.vertices);

graphData.edges.forEach(edge => {
    graph.addEdge(edge.from, edge.to);
});

const sccs = graph.tarjan();
console.log('cycles detected:', sccs);
