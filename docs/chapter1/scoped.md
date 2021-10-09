# 块级作用域绑定

## 1. 变量提升(Hoisting)

​		在函数作用域或全局作用域中通过关键字 var 声明的变量，无论实际上是在哪里声明的，都会被当成在当前作用域顶部声明的变量，这就是提升(Hoisting)机制。在预编译阶段，变量的声明会被提升至顶部，而初始化的操作依旧留在原处执行。

​		ECMAScript 6 引入块级作用域来强化对变量生命周期的控制。

## 2. 块级声明

​		块级声明用于声明在指定块的作用域之外无法访问的变量。块级作用域存在于：函数内部、块中({ ... })。

### 2.1 let 声明

​		用 let 声明变量，可以把变量的作用域限制在当前代码块中。

​		用 let 声明变量，不会进行变量提升，禁止重声明。

### 2.2 const 声明

​		用 const 声明的是常量，其值一旦被设定后不可更改，因此每个通过 const 声明的常量都必须进行初始化。

​		const声明不允许修改绑定，但允许修改值。const 声明对象时，意味着可以修改对象的属性值：

```js
const person = {
  name: 'coderdxh',
  age: 18
};

person.age = 22;  // 22

person = {
  name: 'Xhua',
  age: 22
};  // 报错
```

### 2.3 临时死区(Temporal Dead Zone)

​		对于我来说，这个概念属于新的，之前没接触到的，通过例子来解释一下：

```js
// foo 没有定义
typeof foo;  // 'undefined'
```

​		可见，正常情况下当变量没有定义时，使用 typeof 操作时，会返回 undefined，但是：

```js
if (condition) {
    console.log(typeof foo);  // 引用错误
  	let foo = 'blue';
}
```

​		可见，当处于由 let (const) 所在的块中，在声明变量之前进行 typeof 操作会抛出错误，因此 let foo = 'blue'; 并不会执行。

​		其实，当处于由 let (const) 所在的块中时，foo未声明，就会放在"临时死区"(TDZ)中，而访问 TDZ 中的变量就会触发运行时的错误。

```js
console.log(typeof foo);  // 'undefined'

if (condition) {
   let foo = 'blue'; 
}
```

​		JavaScript 引擎在扫描代码发现变量声明时，要么将它们提升至作用域顶部(遇到 var 声明)，要么将声明放到 TDZ 中(遇到 let 和 const 声明)。访问 TDZ 中的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从 TDZ 中移出，然后方可正常运行。

### 2.4 全局块作用域绑定

​		当 var 被用于全局作用域时，它会创建一个新的全局变量作为全局对象(浏览器环境中的 window 对象) 的属性。这意味着用 var 可能会无意的覆盖一个已经存在的全局属性。

```js
var name = 'coderdxh';

console.log(window.name);  // 'coderdxh'
```

​		当在全局作用域中使用 let 或 const，会在全局作用域下创建一个新的绑定，但该绑定不会添加为全局对象的属性。

```js
let name = 'coderdxh';

console.log(window.name);  // ''