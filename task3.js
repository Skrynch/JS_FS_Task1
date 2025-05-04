// Двусвязный список
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    append(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.size++;
    }

    prepend(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.size++;
    }

    find(value) {
        let current = this.head;
        while (current) {
            if (current.value === value) return current;
            current = current.next;
        }
        return null;
    }

    delete(value) {
        let node = this.find(value);
        if (!node) return false;
        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;
        if (node === this.head) this.head = node.next;
        if (node === this.tail) this.tail = node.prev;
        this.size--;
        return true;
    }

    update(oldValue, newValue) {
        let node = this.find(oldValue);
        if (node) {
            node.value = newValue;
            return true;
        }
        return false;
    }

    length() {
        return this.size;
    }
}

// Взвешенный граф с алгоритмом Дейкстры
class WeightedGraph {
    constructor() {
        this.graph = {};
    }

    addEdge(u, v, weight) {
        if (!this.graph[u]) this.graph[u] = [];
        if (!this.graph[v]) this.graph[v] = [];
        this.graph[u].push({ node: v, weight });
        this.graph[v].push({ node: u, weight });
    }

    removeEdge(u, v) {
        if (this.graph[u]) this.graph[u] = this.graph[u].filter(edge => edge.node !== v);
        if (this.graph[v]) this.graph[v] = this.graph[v].filter(edge => edge.node !== u);
    }

    updateEdge(u, v, newWeight) {
        this.removeEdge(u, v);
        this.addEdge(u, v, newWeight);
    }

    size() {
        return Object.keys(this.graph).length;
    }

    shortestPath(start, end) {
        let distances = {};
        let pq = new MinHeap();
        Object.keys(this.graph).forEach(node => distances[node] = Infinity);
        distances[start] = 0;
        pq.insert([start, 0]);

        while (!pq.isEmpty()) {
            let [currentNode, currentDistance] = pq.extractMin();
            if (currentDistance > distances[currentNode]) continue;
            for (let neighbor of this.graph[currentNode]) {
                let distance = currentDistance + neighbor.weight;
                if (distance < distances[neighbor.node]) {
                    distances[neighbor.node] = distance;
                    pq.insert([neighbor.node, distance]);
                }
            }
        }
        return distances[end] !== Infinity ? distances[end] : 'undefined';
    }
}

// Вспомогательный класс MinHeap для приоритетной очереди в алгоритме Дейкстры
class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert([node, priority]) {
        this.heap.push([node, priority]);
        this.heap.sort((a, b) => a[1] - b[1]);
    }

    extractMin() {
        return this.heap.shift();
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}
