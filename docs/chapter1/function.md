# 函数

## 1. ES6默认参数值

```js
function foo(a, b = 12) {
  console.log(a, b);  // 10 12
}

foo(10);
```

## 2. 默认参数值对 arguments 对象的影响

​		ES5 非严格模式:

```js
function foo(a, b) {
  console.log(a === arguments[0]);  // true
  console.log(b === arguments[1]);  // true
  a = 30;
  b = 40;
  console.log(a === arguments[0]);  // true
  console.log(b === arguments[1]);  // true
}

foo(10, 20);
```

​		ES5 严格模式：

```js
function foo(a, b) {
  'use strict';
  console.log(a === arguments[0]);  // true
  console.log(b === arguments[1]);  // true
  a = 30;
  b = 40;
  console.log(a === arguments[0]);  // false
  console.log(b === arguments[1]);  // false
}

foo(10, 20);
```

​		可见，在ES5严格模式下，取消了 arguments 对象的困惑行为，无论参数如何变化，arguments对象不再随之改变。

**ES6 默认参数值：**

​		在ES6中，如果一个函数使用了默认参数值，则不误是否显式定义了严格模式，arguments对象的行为都将与 ES5 严格模式下保持一致。

```js
function foo(a, b = 20) {
  console.log(a === arguments[0]);  // true
  console.log(b === arguments[1]);  // false   arguments[1] -> undefined  b -> 20
  a = 30;
  b = 40;
  console.log(a === arguments[0]);  // false   arguments[0] -> 10  a -> 30
  console.log(b === arguments[1]);  // false   arguments[1] -> undefined  b -> 40
}

foo(10);
```

## 3. 默认参数表达式

```js
// 形参默认值可以是一个函数的调用
function getVal() {
  return 10;
}

function add(a, b = getVal()) {
  return a + b;
}

console.log(add(10));  // 20
console.log(add(10, 20));  // 30
```

```js
// 后边的参数可以访问前边的参数值
function getVal(val) {
  return val;
}

function add(a, b = getVal(a)) {
  return a + b;
}

console.log(add(20));  // 40
console.log(add(10, 20));  // 30
```

​		在引用参数默认值的时候，只允许引用前边参数的值，即先定义的参数不能访问后定义的参数。

```js
function add(a = b, b) {
  return a + b; 
}

console.log(add(1, 1));  // 2
console.log(add(undefined, 1));  // 抛出错误  Cannot access 'b' before initialization  初始化前无法访问'b'
```

​		函数参数有自己的作用域和临时死区，其与函数体的作用域是各自独立的，也就是说参数的默认值不可访问函数体内声明的变量。

## 4. 不定参数

​		在函数的命名参数前添加三个点(...)就表明这是一个不定参数，该参数为一个数组，包含着自它之后传入的所有参数，通过这个数组逐一访问里面的参数。

```js
function pick(...val) {}
```

​		每个函数最多只能声明一个不定参数，而且一定要放在所有参数的末尾。

```js
function foo(a, ...b, c) {}  // 语法错误：不定参数后不能有其他命名参数
```

## 5. 元属性 new.target

​		元属性是指非对象的属性，其可以提供非对象目标的补充信息。当调用函数的**[[Construct]]**方法时，new.target 被赋值为 new 操作符的目标，通常是新创建对象实例，也就是函数体内 this 的构造函数；如果调用**[[Call]]**方法，则 new.target 的值为 undefined。

​		在函数外使用 new.target 是一个语法错误。

## 6. 箭头函数

​		在ES6中，箭头函数是一种使用箭头(=>)定义函数的新语法，与传统的 JavaScript 函数有些许不同，主要集中在以下方面：

+ **没有this、super、arguments 和 new.target 绑定**  箭头函数中的 **this**、**super**、**arguments** 及 **new.target** 这些值由外围最近一层非箭头函数决定。
+ **不能通过 new 关键字调用**  箭头函数没有 **[[Construct]]** 方法，所以不能被用作构造函数，如果通过 **new** 关键字调用箭头函数，程序会抛出错误。
+ **没有原型**  由于不可以通过 new 关键字调用箭头函数，因而没有构建原型的需求，所以箭头函数不存在 **prototype** 这个属性。
+ **不可以绑定 this 的绑定**  函数内部的 **this** 值不可被改变，在函数的生命周期内始终保持一致。如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this；否则，this 的值会被设置为全局对象。
+ **不支持 arguments 对象**  箭头函数没有 **arguments** 绑定，所以必须通过**命名参数**和**不定参数**这两种形式访问函数的参数。 
+ **不支持重复的命名参数**  无论在严格还是非严格模式下，箭头函数都不支持重复的命名参数：在传统函数的规定中，只有在严格模式下才不能有重复的命名参数。

## 7. 尾调用

​		尾调用指的是函数作为另一个函数的最后一条语句被调用（不一定是 return）：

```js
function foo() {
  return bar();  // 尾调用
}

function foo() {
  bar();  // 尾调用
}
```

​		在ES5中，尾调用的实现与其他函数调用的实现类似：创建一个新的栈帧(stack frame)，将其推入调用栈来表示函数调用。在循环调用中，每一个未用完的栈帧都会被保存在内存中，当调用栈变得过大时会造成程序问题。

### 7.1 ES6中的尾调用优化

​		**ES6 缩减了严格模式下尾调用栈的大小(非严格模式下不受影响)，如果满足以下条件，尾调用不再创建新的栈帧，而是清除并重用当前栈帧**：

+ 尾调用不访问当前栈帧的变量(也就是说函数不是一个闭包)。
+ 在函数内部，尾调用是最后一条语句。
+ 尾调用的结果作为函数值返回。

```js
'use strict';

function foo() {
  // 优化后
  return bar();
}
```

```js
'use strict';

function foo() {
  // 无返回，无法优化
  bar();
}
```

​		同样的，如果定义了一个函数，在尾调用返回后执行其他操作，则函数也无法得到优化：

```js
'use strict';

function foo() {
  // 无法优化，必须在返回值后添加其他操作
  return 1 + bar();
}
```

​		还有一种意外情况，如果把函数调用的结果存储在一个变量里，最后再返回这个变量，则可能导致引擎无法优化：

```js
'use strict';

function foo() {
  // 无法优化，调用不在尾部
  var result = bar();
  return result;
}
```

​		最难避免的情况是闭包的使用，它可以访问作用域中所有的变量，因而导致尾调用优化失效：

```js
'use strict';

function foo() {
  var num = 1,
      func = () => num;
  
  // 无法优化，该函数是一个闭包
  return func();
}
```

### 7.2 如何利用尾调用优化

​		实际上，尾调用的优化发生在引擎背后，除非尝试优化一个函数，否则无须思考此类问题。递归函数是其最主要的应用场景，此时尾调用优化的效果最显著。

```js
function factorial(n) {
  if (n <= 1) {
      return 1;
  } else {
    // 无法优化，必须在返回后执行乘法操作  也就是说，此处进行了其他操作
    return n * factorial(n - 1);
  }
}
```

```js
function factorial(n, p = 1) {
  if (n <= 1) {
      return 1 * p;
  } else {
    let result = n * p;
    
    // 优化后
    return factorial(n-1, result);
  }
}
```