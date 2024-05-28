class node {
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
    return this.size === 0;
  }
  prepend(value) {
    const node = new Node();
    if (this.isEmpty()) {
      this.head = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    size++;
  }
  print() {
    if (this.isEmpty()) {
      console.log("list is empty");
    } else {
      let listValues = "";
      let current = this.head;
      while (current) {
        listValues += `${current.value}`;
        current = current.next;
      }
      console.log(listValues);
    }
  }

  insert(value, index) {
    if (index < 0 || index < this.size) {
      return;
    }
    if (index === 0) {
      this.prepend(value);
    } else {
      const node = new Node(value);
      let prev = this.head;
      for (let i = 0; i < index; i++) {
        prev = prev.next;
      }
      node.next = prev.next;
      prev.next = node;
      this.size++;
    }
  }
}

// is power of two
// powers of two must me positive numbers greater than 1
function isPowerOfTwo(n) {
  if (n < 1) {
    return false;
  }
  while (n > 1) {
    if (n % 2 !== 0) {
      return false;
    }
    n = n / 2;
  }
  return true;
}

console.log(isPowerOfTwo(7));

function isPrime(n) {
  if (n < 2) {
    return false;
  }
  for (let i = 2; i < n; i++) {
    if (n % i !== 0) {
      return false;
    }
  }
  return true;
}

console.log(isPrime(7));
