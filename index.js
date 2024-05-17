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
