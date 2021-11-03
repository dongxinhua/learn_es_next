# 迭代器与生成器

迭代器是一种特殊对象，它具有一些专门为迭代过程设计的专有接口，所有的迭代器对象都有一个 next() 方法，每次调用都返回一个结果对象。结果对象有两个属性，value，表示下一个要返回的值；done， 是一个布尔类型的值，当没有更多可返回的数据时，返回true。

```js
function createIterator(items) {
  let i = 0;
  return {
    next: function() {
      let done = (i >= items.length);
      let value = !done ? items[i++] : undefined;
      
      return {
        done,
        value
      };
    }
  };
}

let iterator = new createIterator([1, 2, 3]);

console.log(iterator.next());  // {done: false, value: 1}
console.log(iterator.next());  // {done: false, value: 2}
console.log(iterator.next());  // {done: false, value: 3}
console.log(iterator.next());  // {done: true, value: undefined}

// 之后的调用都会返回相同的内容
console.log(iterator.next());  // {done: true, value: undefined}
```

生成器是一种返回迭代器的函数，通过 function 关键字后的星号(*)来表示，函数中会用到新的关键字 yield。

::: warning 注意
yield 关键字只可在生成器内部使用，在其他地方使用会导致程序抛出语法错误，即便是在生成器内部函数里使用也是如此。
:::

## 1. 可迭代对象和 for-of循环

​		可迭代对象具有 Symbol.iterator属性，是一种与迭代器密切相关的对象。Symbol.iterator 通过指定的函数可以返回一个作用于附属对象的迭代器。所有集合对象(数组，Set集合、Map集合)和字符串都是可迭代对象，这些对象有**默认的迭代器**。

​		for-of循环每执行一次都会调用可迭代对象的next()方法，并将迭代器返回的结果对象的value属性存储在一个变量中，循环将持续执行这一过程直到返回对象的done属性的值为true。

```js
let values = [1, 2, 3];

for (let num of values) {
  console.log(num);  // 1 2 3
}
```

​		这段for-of循环的代码通过调用values数组的 Symbol.iterator 方法来获取迭代器。

:::warning 注意
如果将 for-of语句用于不可迭代对象、null或undefined将会导致程序抛出错误。
:::

## 2. 内建迭代器

### 2.1 集合对象迭代器

​		集合对象内置了三种迭代器：

+ entries() 返回一个迭代器，其值为多个键值对；
+ values() 返回一个迭代器，其值为集合的值；
+ keys() 返回一个迭代器，其值为集合的所有键名。

**enteries() 迭代器**

```js
let friends = ['xly', 'lwq', 'gpp', 'mfh', 'nxj', 'gcp'];
let numbers = new Set([1, 2, 3]);
let loves = new Map();

loves.set('lover', 'fdd');
loves.set('me', 'xhua');

for (let friend of friends.entries()) {
  console.log(friend);
}

for (let num of numbers.entries()) {
  console.log(num);
}

for (let love of loves.entries()) {
  console.log(love);
}

[0, 'xly']
[1, 'lwq']
[2, 'gpp']
[3, 'mfh']
[4, 'nxj']
[5, 'gcp']
[1, 1]
[2, 2]
[3, 3]
['lover', 'fdd']
```

 **values() 迭代器**

```js
let friends = ['xly', 'lwq', 'gpp', 'mfh', 'nxj', 'gcp'];
let numbers = new Set([1, 2, 3]);
let loves = new Map();

loves.set('lover', 'fdd');
loves.set('me', 'xhua');

for (let friend of friends.values()) {
  console.log(friend);
}

for (let num of numbers.values()) {
  console.log(num);
}

for (let love of loves.values()) {
  console.log(love);
}


xly
lwq
gpp
mfh
nxj
gcp
1
2
3
fdd
xhua
```

**keys() 迭代器**

​		Set集合，键值相同，返回相同的迭代器。	

```js
let friends = ['xly', 'lwq', 'gpp', 'mfh', 'nxj', 'gcp'];
let numbers = new Set([1, 2, 3]);
let loves = new Map();

loves.set('lover', 'fdd');
loves.set('me', 'xhua');

for (let friend of friends.keys()) {
  console.log(friend);
}

for (let num of numbers.keys()) {
  console.log(num);
}

for (let love of loves.keys()) {
  console.log(love);
}

0
1
2
3
4
5
1
2
3
lover
me
```

 **不同集合类型的默认迭代器**

​		数组和Set集合默认迭代器是values(); Map集合的默认迭代器是 entries();

### 2.2 字符串迭代器

```js
let msg = 'A C B';

for (let m of msg) {
  console.log(m);
}
// A (空) C (空) B
```

### 2.3 NodeList 迭代器

```js
let divs = document.getElementsByTagName('div');

for (let div of divs) {
  console.log(div);
}
```


