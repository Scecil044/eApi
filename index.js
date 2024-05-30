// class node {
//   constructor(value) {
//     this.value = value;
//     this.next = null;
//   }
// }

// class LinkedList {
//   constructor() {
//     this.head = null;
//     this.size = 0;
//   }

//   isEmpty() {
//     return this.size === 0;
//   }
//   prepend(value) {
//     const node = new Node();
//     if (this.isEmpty()) {
//       this.head = node;
//     } else {
//       node.next = this.head;
//       this.head = node;
//     }
//     size++;
//   }
//   print() {
//     if (this.isEmpty()) {
//       console.log("list is empty");
//     } else {
//       let listValues = "";
//       let current = this.head;
//       while (current) {
//         listValues += `${current.value}`;
//         current = current.next;
//       }
//       console.log(listValues);
//     }
//   }

//   insert(value, index) {
//     if (index < 0 || index < this.size) {
//       return;
//     }
//     if (index === 0) {
//       this.prepend(value);
//     } else {
//       const node = new Node(value);
//       let prev = this.head;
//       for (let i = 0; i < index; i++) {
//         prev = prev.next;
//       }
//       node.next = prev.next;
//       prev.next = node;
//       this.size++;
//     }
//   }
// }

// // is power of two
// // powers of two must me positive numbers greater than 1
// function isPowerOfTwo(n) {
//   if (n < 1) {
//     return false;
//   }
//   while (n > 1) {
//     if (n % 2 !== 0) {
//       return false;
//     }
//     n = n / 2;
//   }
//   return true;
// }

// console.log(isPowerOfTwo(7));

// function isPrime(n) {
//   if (n < 2) {
//     return false;
//   }
//   for (let i = 2; i < n; i++) {
//     if (n % i !== 0) {
//       return false;
//     }
//   }
//   return true;
// }

// console.log(isPrime(7));

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
  set(key, value) {
    const index = this.hash(key);
    // this.table[index] = value;
    let bucket = this.table[index];
    if (!bucket) {
      this.table[index] = [[key, value]];
    } else {
      const similarKey = bucket.find((item) => item[0] === key);
      if (similarKey) {
        similarKey[1] = value;
      } else {
        bucket.push([key, value]);
      }
    }
  }
  get(key) {
    const index = this.hash(key);
    // return this.table[index];
    let bucket = this.table[index];
    if (bucket) {
      const similarKey = bucket.find((item) => item[0] === key);
      return similarKey ? similarKey[1] : undefined;
    } else {
      return undefined;
    }
  }
  remopve(key) {
    const index = this.hash(key);
    const bucket = this.table[index];
  }
  display() {
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        console.log(i, this.table[i]);
      }
    }
  }
}

const table = new HashTable(60);
table.set("name", "spencer");
table.set("mane", "brian");
table.set("address", "ksm");
table.display();

console.log(table.get("address"));

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  isEmpty() {
    console.log(this.size === 0 ? true : this.size);
  }
  append(value) {
    const node = new Node(value);
    if (this.isEmpty()) {
      this.head = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this.size++;
  }
  prepend(value) {
    const node = new Node(value);
    if (this.isEmpty()) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.size++;
  }
  display() {
    if (this.isEmpty()) {
      console.log("list is empty");
    } else {
      let current = this.head;
      let values = [];
      while (current) {
        values.push(current.value);
        current = current.next;
      }
      console.log(values.join(" -> "));
    }
  }
}

console.log("==========list");
const list = new LinkedList();

list.append(300);
list.append(45);
list.append(450);
list.append(777);
list.prepend(645);
list.display();
list.isEmpty();

