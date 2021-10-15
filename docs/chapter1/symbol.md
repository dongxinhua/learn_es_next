## Symbol 和 Symbol 属性

​		在 ES5 早期版本，包含5种原始类型：字符串string、数字number、布尔boolean、null、undefined； ES6 引入了第 6 种原始类型：Symbol。

### 1. 创建 Symbol

​		可以通过全局的 Symbol 函数创建一个 Symbol，当要访问这个属性时，一定要用到最初定义的Symbol。

```js
let firstName = Symbol();
let person = {};

person[firstName] = 'dong';
console.log(person[firstName]);  // 'dong'
```

​		由于Symbol是原始值，因此调用 new Symbol() 会导致程序抛出错误。

​		Symbol 函数接受一个可选参数，可以添加一段文本描述即将创建的Symbol。这段描述不可用于属性访问，但是建议在每次创建 Symbol 时都添加这样一段描述，以便于阅读代码和调试 Symbol 程序。

```js
let firstName = Symbol('first name');
let person = {};

person[firstName] = 'dong';

console.log('first name' in person);  // false
console.log(person[firstName]);  // 'dong'
console.log(firstName);  // Symbol(first name)
```

​		Symbol 的描述被存储在内部的[[Description]]属性中，只有当调用Symbol的toStrung方法时才可以读取这个属性。在执行 console.log 时隐式调用了 firstName 的 toString 方法，所以它的描述会被打印到日志中，但不能直接在代码里访问[[Description]]。

​		推荐：通过其它间接方式也可以检测变量是否为 Symbol 类型，但是 typeof 操作符是最准确也是最应首选的检测方式。

​		所有使用可计算属性名的地方，都可以使用 Symbol。

### 2. Symbol共享体系

​		如果想创建一个可共享的Symbol，要使用Symbol.for方法。它只接受一个参数，也就是即将创建的Symbol的字符串标识符：

```js
let uid = Symbol.for('uid');
let object = {};

object[uid] = '12345';

console.log(object[uid]);  // '12345'
console.log(uid);  // 'Symbol(uid)'
```

​		Symbol.for 方法首先在全局Symbol注册表中搜索键为'uid'的Symbol是否存在，如果存在，直接返回已有的Symbol；否则，创建一个新的Symbol，并使用这个键在Symbol全局注册表中注册，随即返回新创建的Symbol。

```js
let uid = Symbol.for('uid');
let obj = {
  [uid]: '12345'
};

console.log(object[uid]);  // '12345'
console.log(uid);  // Symbol(uid)

let uid2 = Symbol.for('uid');

console.log(uid === uid2);  // true
console.log(object[uid2]);  // '12345'
console.log(uid2);  // Symbol(uid)
```

### 3. Symbol 属性检索

​		Object.keys 方法和 Object.getOwnPropertyNames 方法可以检索对象中所有的属性名：前一个方法返回所有可枚举的属性名；后一个方法不考虑属性的可枚举性一律返回，但是它们都不支持Symbol属性。

​		ES6中，Object.getOwnPropertySymbols 方法来检测对象中的Symbol属性，返回值是一个包含所有Symbol自有属性的数组。

```js
let uid = Symbol.for('uid');
let person = {
    [uid]: 120899
};
person.name = 'coderdxh';

console.log(Object.getOwnPropertySymbols(person));  // [Symbol(uid)]
```

### 4. 通过well-known Symbol 暴露内部操作

​		ES6开放了以前JavaScript中常见的内部操作，并通过预定义一些 well-know Symbol 来表示。每一个这类 Symbol 都是 Symbol 对象的一个属性。

+ Symbol.hasInstance 一个在执行 instanceof 时调用的内部方法，用于检测对象的继承信息。
+ Symbol.isConcatSpreadable 一个布尔值，用于表示当传递一个集合作为 Array.prototype.concat 方法的参数时，是否应该将集合内的元素规整到同一层级。
+ Symbol.iterator 一个返回迭代器的方法
+ Symbol.speices 用于创建派生对象的构造函数。
+ Symbol.split 一个在调用 String.prototype.split 方法时调用的方法，用于分割字符串。
+ Symbol.toPrimitive 一个返回对象原始值的方法。
+ Symbol.toStringTag 一个在调用 Object.prototype.toString 方法时使用的字符串，用于创建对象描述
+ Symbol.unscopables 一个定义了一些不可被 with 语句引用的对象属性名称的集合

#### 4.1 Symbol.hasInstance

​		每一个函数中都有一个Symbol.hasInstance方法，用于确定对象是否为函数实例。该方法在 Function.prototype 中定义，所以所有函数都继承了 instanceof 属性的默认行为，该方法被定义为**不可写，不可配置并且不可枚举**。本质上，ES6 只是将 instanceof操作符重新定义为此方法的简写语法。

```js
obj instanceof Array;

Array[Symbol.hasInstance](obj);
```

只有通过 Object.defineProperty 方法才能够改写一个不可写属性。

```js
// 假设想定义一个无实例的函数，就可以将Symbol.hansInstance 返回值硬编码为 false.
function MyObject() {
  // 空函数
}

Object.defineProperty(MyObject, Symbol.hasInstance, {
  value: function(v) {
    return false;
  }
});

let obj = new MyObject();

console.log(obj instanceof MyObject);  // false
```

```js
function SpecialNumber() {
  // 空函数
}

Object.defineProperty(SpecialNumber, Symbol.hasInstance, {
  value: function(v) {
    return (v instanceof Number) && (v >= 1 && v <= 100);
  }
});

let two = new Number(2),
    zero = new Number(0);

console.log(two instanceof SpecialNumber);  // true
console.log(zero instanceof SpecialNumber);  // false
```

​		注意，如果要触发Symbol.hasInstance调用，instanceof 的左操作数必须是一个对象，如果左操作数为非对象会导致 instanceof总是返回 false。

#### 4.2 Symbol.isConcatSpreadable 属性

​		JavaScript中数组的 concat 方法被设计用于拼接两个数组，使用方法:

```js
let colors1 = ['red', 'green'],
    colors2 = colors1.concat(['blue', 'pink']);

console.log(colors2.length);  // 4
console.log(colors2);  // ['red', 'green', 'blue', 'pink']

let colors3 = colors2.concat(['black'], 'white');
console.log(colors3);  // ['red', 'green', 'blue', 'pink', 'black', 'white']
```

​		Symbol.isConcatSpreadable 属性是一个布尔值，如果该属性值为true，则表示对象有 length 属性和数字键，故它的数值属性应该被独立添加到concat调用的结果中。这个Symbol属性默认情况下不会出现在标准对象，它只是一个可选属性。

```js
let collection = {
  0: 'Hello',
  1: 'World',
  length: 2,
  [Symbol.isConcatSpreadable]: true
}

let msg = ['Hello JavaScript'].concat(collection);

console.log(msg.length);  // 3
console.log(msg);  // ['Hello JavaScript', 'Hello', 'World']
```

```js
// 无 Symbol.isConcatSpreadable
let collection = {
  0: 'Hello',
  1: 'World',
}

let msg = ['Hello JavaScript'].concat(collection);

console.log(msg.length);  // 2
console.log(msg);  // ['Hello JavaScript', {...collection}]
```

### 4.3 Symbol.toPrimitive 方法

​		Symbol.toPrimitive 方法被定义在每一个标准类型的原型上，并且规定了当对象被转换为原始值时应当执行的操作。当执行原始值转换时，总会调用 Symbol.toPrimitive 方法并传入一个值作为参数，这个值在规范中被称为类型提示(hint)。类型提示参数的值只有三种选择：number  string  default；传递这些参数时，Symbol.toPrimitive 返回的分别是 数字 字符串或无类型偏好的值。

​		对于大多数标准对象，**数字模式**有以下特性，根据优先级的顺序排列如下：

1. 调用 valueOf 方法，如果结果为初始值，则返回。

2. 否则调用 toString 方法，如果结果为初始值，则返回。

3. 如果再无可选值，则抛出错误。

   对于大多数标准对象，**字符串模式**有以下优先级排序：

4. 调用 toString 方法，如果结果为原始值，则返回

5. 否则调用 valueOf 方法，如果结果为原始值，则返回

6. 如果再无可选值，则抛出错误

​        大多数情况下，标准对象会将**默认模式**按数字模式处理(除了Date对象，在这种情况下，会将默认模式按字符串模式处理)。

​		如果想要覆写默认的转换特性，可以自定义 Symbol.toPrimitive 方法。

```js
// 普通情况
function Temperature(degrees) {
  this.degrees = degrees;
}

let freezing = new Temperature(32);

console.log(freezing + '!');  // '[object Object]!'
console.log(freezing / 2);  // NaN
console.log(String(freezing)); // '[object Object]'
```

```js
function Temperature(degrees) {
  this.degrees = degrees;
}

Temperature.prototype[Symbol.toPrimitive] = function(hint) {
  switch(hint) {
    case 'string':
      return this.degrees + '\u00b0';  // degrees symbol
    case 'number':
      return this.degrees;
    case 'default':
      return this.degrees + 'degrees';
  }
}

let freezing = new Temperature(32);

console.log(freezing + '!');  // '32degress!'
console.log(freezing / 2);  // 16
console.log(String(freezing)); // '32°'
```

​		+ 运算符触发默认模式，hint被设置为"default"；/ 运算符触发数字模式，hint 被设置为 "number"；String() 函数触发字符串模式，hint被设置为 "string"

