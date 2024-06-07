class HashTable {
  constructor(size) {
    this.size = size;
    this.table = new Array(size);
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
    let bucket = [];
    bucket = this.table[index];
    if (!bucket) {
      this.table[index] = [[key, value]];
    } else {
      const sameIndex = bucket.find((item) => item[0] === key);
      if (sameIndex) {
        sameIndex[1] = value;
      } else {
        bucket.push([key, value]);
      }
    }
  }

  get(key) {
    const index = this.hash(key);
    const bucket = this.table[index];
    if (bucket) {
      const itemToShow = bucket.find((item) => item[0] === key);
      if (itemToShow) {
        return itemToShow;
      }
      return undefined;
    }
    return undefined;
  }
  remove(key) {
    const index = this.hash(key);
    const bucket = this.table[index];
    const isItem = bucket.find((item) => item[0] === key);
    if (isItem) {
      bucket.splice(isItem, 1);
      console.log("item removed");
    }
    return undefined;
  }
  display() {
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        console.log(i, this.table[i]);
      }
    }
  }
}

const table = new HashTable(34);
table.set("name", "amani");
table.set("mane", "Andy");
console.log(table.get("john"));
table.remove("name");
table.display();

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

  insert(value) {
    const node = new Node(value);
    if (this.isEmpty()) {
      this.head = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this.size++;
  }

  isEmpty() {
    return this.size === 0;
  }
  display() {
    let current = this.head;
    let itemList = [];
    if (this.isEmpty()) {
      console.log("node is empty");
    } else {
      while (current) {
        itemList.push(current.value);
        current = current.next;
      }
    }
    console.log(itemList.join("->"));
  }
}

const linkedListTest = new LinkedList();
linkedListTest.insert(40);
linkedListTest.insert(43);
linkedListTest.display();

function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

console.log(linearSearch([10, 33, 57, 78, 90], 7890));

function binarySearch(arr, target) {
  let leftIndex = 0;
  let rightIndex = arr.length - 1;

  while (leftIndex <= rightIndex) {
    const middleIndex = Math.floor((leftIndex + rightIndex) / 2);
    for (let i = 0; i < arr.length; i++) {
      if (target === arr[middleIndex]) {
        return middleIndex;
      }
      if (target < arr[middleIndex]) {
        rightIndex = middleIndex - 1;
      } else {
        leftIndex = middleIndex + 1;
      }
    }
  }
  return -1;
}

console.log("binary search", binarySearch([10, 20, 30, 40, 50, 60, 70], 7000));

function bubbleSort(arr) {
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > arr[i + 1]) {
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
  }
}

let arr = [1, 34, 56, 55, 22, 12, 3, 4, 67];
bubbleSort(arr);
console.log(arr);

let myStr = "spencer";

const revString = (myStr) => {
  return myStr.split("").reverse().join("");
};

console.log(revString(myStr));

function checkOverFlow(newStr) {
  let uniqueChars = [];
  let overflowChars = [];

  let arr = newStr.split("");
  for (let i = 0; i < arr.length; i++) {
    if (uniqueChars.includes(arr[i])) {
      overflowChars.push(arr[i]);
    } else {
      uniqueChars.push(arr[i]);
    }
  }
  return { uniqueChars, overflowChars };
}
let newStr = "abbccddeeffgg";
let result = checkOverFlow(newStr);
console.log("Unique Characters:", result.uniqueChars.join(""));
console.log("Overflow Characters:", result.overflowChars.join(""));
