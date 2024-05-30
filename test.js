class Node {
  constructor() {}
}

class LinkedList {
  constructor() {}
}

class HashTable {
  constructor(size) {
    this.table = new Array(size);
    this.size = size;
  }

  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) {
      total += key.charCodeAt(i);
    }
    return total % this.size;
  }

  set(value, key) {
    const index = this.hash(key);
    this.table[index] = value;
  }
  isEmpty() {}
  get() {}
  remove() {}
  display() {}
}

const table = new HashTable(40);


function solution(P, Q) {
  const numberSet = new Set();
  for (let i = 0; i < P.length; i++) {
    numberSet.add(P[i]);
  }
  for (let i = 0; i < Q.length; i++) {
    numberSet.add(Q[i]);
  }
  return numberSet.size;
}
let P = "ab";
let Q = "cb";
console.log(solution(P, Q));
