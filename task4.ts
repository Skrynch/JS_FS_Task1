// 1) Аналоги Utility Types и собственный тип

// Partial<T> - делает все поля необязательными
type MyPartial<T> = {
    [K in keyof T]?: T[K];
};

// Required<T> - делает все поля обязательными
type MyRequired<T> = {
    [K in keyof T]-?: T[K];
};

// Readonly<T> - делает все поля только для чтения
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};

// Pick<T, K> - выбирает только указанные поля
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// Omit<T, K> - убирает указанные поля
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Собственный тип: Создаем тип, который делает все строки в объекте верхним регистром
type UppercaseStrings<T> = {
    [K in keyof T]: T[K] extends string ? Uppercase<T[K]> : T[K];
};

// Пример использования
interface Person {
    name: string;
    age: number;
}

const upperPerson: UppercaseStrings<Person> = {
    name: "JOHN",
    age: 30,
};

// 2) Типизация задач из JS домашки (строгий TypeScript)

// Двусвязный список
class ListNode<T> {
    value: T;
    next: ListNode<T> | null = null;
    prev: ListNode<T> | null = null;

    constructor(value: T) {
        this.value = value;
    }
}

class DoublyLinkedList<T> {
    private head: ListNode<T> | null = null;
    private tail: ListNode<T> | null = null;
    private size: number = 0;

    append(value: T): void {
        const newNode = new ListNode(value);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            this.tail!.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.size++;
    }

    prepend(value: T): void {
        const newNode = new ListNode(value);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.size++;
    }

    find(value: T): ListNode<T> | null {
        let current = this.head;
        while (current) {
            if (current.value === value) return current;
            current = current.next;
        }
        return null;
    }

    delete(value: T): boolean {
        const node = this.find(value);
        if (!node) return false;
        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;
        if (node === this.head) this.head = node.next;
        if (node === this.tail) this.tail = node.prev;
        this.size--;
        return true;
    }

    length(): number {
        return this.size;
    }
}

// Взвешенный граф с алгоритмом Дейкстры
class WeightedGraph<T> {
    private graph: Map<T, Map<T, number>> = new Map();

    constructor() {
        this.graph = new Map();
    }

    addEdge(u: T, v: T, weight: number): void {
        if (!this.graph.has(u)) this.graph.set(u, new Map());
        if (!this.graph.has(v)) this.graph.set(v, new Map());
        this.graph.get(u)!.set(v, weight);
        this.graph.get(v)!.set(u, weight);
    }

    removeEdge(u: T, v: T): void {
        this.graph.get(u)?.delete(v);
        this.graph.get(v)?.delete(u);
    }

    shortestPath(start: T, end: T): number | "undefined" {
        const pq: [T, number][] = [[start, 0]];
        const distances: Map<T, number> = new Map();

        for (const node of this.graph.keys()) {
            distances.set(node, Infinity);
        }
        distances.set(start, 0);

        while (pq.length > 0) {
            pq.sort((a, b) => a[1] - b[1]);
            const [currentNode, currentDistance] = pq.shift()!;

            if (currentDistance > distances.get(currentNode)!) continue;

            for (const [neighbor, weight] of this.graph.get(currentNode) || []) {
                const distance = currentDistance + weight;
                if (distance < distances.get(neighbor)!) {
                    distances.set(neighbor, distance);
                    pq.push([neighbor, distance]);
                }
            }
        }

        return distances.get(end) === Infinity ? "undefined" : distances.get(end)!;
    }
}