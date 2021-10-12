## 对象

### 1 对象方法的简写语法

```js
let person = {
  name: 'coderdxh',
  sayName() {
    console.log(this.name);
  }
}
```

​		简写方法可以使用 super 关键字， 非简写方法不可以。

### 2 可计算属性名

​		在ES6中，可在对象字面量中使用可计算属性名称。

```js
let lastName = 'last name';

let person = {
	'first name': 'dong',
  [lastName]: 'xinhua'
};

console.log(person['first name']);  // dong
console.log(person['last name']);  // xinhua
console.log(person[lastName]);  // xinhua
```

​		在对象字面量中使用方括号表示的该属性名称是可计算的，它的内容将被求值并被最终转化为一个字符串，因而同样可以使用表达式作为属性的可计算名称：

```js
let suffix = ' name';

let person = {
	['first' + suffix ]: 'dong',
  ['last' + suffix]: 'xinhua'
};

console.log(person['first name']);  // dong
console.log(person['last name']);  // xinhua
```

​		任何可用于对象实例括号记法的属性名，也可以作为字面量中的计算属性名。

### 3 新增方法

#### 3.1 Object.is 方法

​		开发中，当比较两个值时，我们喜欢使用 === ，避免在比较时触发强制类型转换。但是，对于：NaN === NaN 的返回值是 false，需要使用 isNaN 才可以正确检测 NaN，对于 +0 和 -0 二者竟然会是相等，但我们知道其实这是两个不同的实体！

​		ES6引入了 Object.is 方法，接受两个参数，如果这两个参数类型相同且具有相同的值，则返回true。

```js
console.log(+0 == -0);  // true
console.log(+0 === -0);  // true
console.log(Object.is(+0, -0));  // false

console.log(NaN == NaN);  // false
console.log(NaN === NaN);  // false
console.log(Object.is(NaN, NaN));  // true

console.log(5 == 5);  // true
console.log(5 == '5');  // true
console.log(5 === 5);  // true
console.log(5 === '5');  // false
console.log(Object.is(5, 5));  // true
console.log(Object.is(5, '5'));  // false
```

#### 3.2 Object.assign 方法

::: tip 方法
Object.assign 方法接受一个接收对象和任意数量的源对象，最终返回接收对象。
:::

​		Object.assign 方法可以接受任意数量的源对象，并按指定顺序将属性复制到接收对象中。所以如果多个源对象具有同名属性，则排位靠后的源对象会覆盖排位靠前的：

```js
let receiver = {};

Object.assign(receiver,
	{
  	type: 'js',
  	name: 'file'
	},
  {
  	type: 'css'
	}
);

console.log(receiver.type);  // css
console.log(receiver.name);	 // file
```

### 4 自有属性枚举顺序

​		ES6严格规定了对象的自有属性被枚举时返回顺序，这会影响到 Object.getOwnPropertyNames()方法及Reflect.ownKeys返回属性的方式，Object.assign 方法处理的顺序也将随之改变。

​		自有属性枚举顺序的基本规则是：

::: tip 规则
1.	所有数字键按升序排序；
2.	所有字符串键按照它们被加入对象的顺序排序；
3.	所有symbol键按照它们被加入对象的顺序排序。
:::

```js
let obj = {
  a: 1,
  0: 1,
  c: 1,
  2: 1,
  b: 1,
  1: 1
};

obj.d = 1;

console.log(Object.getOwnPropertyNames(obj).join(''));  // '012acbd'
```

### 5. 增强对象原型

#### 5.1 改变对象的原型

​		ES5中，Object.getPrototypeOf 方法可以返回任意对象的原型。

​		ES6添加了 Object.setPrototypeOf 方法来改变任意指定对象的原型。

::: tip 参数列表
接受两个参数：被改变原型的对象、替代第一个参数原型的对象。
:::

```js
let person = {
  say() {
    console.log('Hello');
  }
}

let dog = {
  say() {
    console.log('Woof');
  }
}

let friend = Object.create(person);
friend.say();  // Hello
console.log(Object.getPrototypeOf(friend) === person);  // true

// 将原型改为 dog
Object.setPrototypeOf(friend, dog);
friend.say();  // Woof
console.log(Object.getPrototypeOf(friend) === dog);  // true
```

#### 5.2 简化原型访问的Super引用

​		Super 引用相当于指向对象原型的指针，必须要在使用简写方法的对象中使用，但如果在其他方法声明中使用会导致语法报错：

```js
let foo = {
  say() {
    super.say();
  }
}

let bar = {
  say: function() {
    super.say();  // 报错
  }
}
```

::: tip 注意
Super 引用不是动态变化的，它总是指向正确的对象。Super 的所有引用都通过 [[HomeObject]] 属性来确定后续的运行过程。
:::



