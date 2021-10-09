# 字符串

## 1. 字符串中的子串识别

+ includes：如果在字符串中检测到指定文本则返回 true，否则返回 false。
+ startsWith：如果在字符串的起始部分检测到指定文本则返回 true，否则返回 false。
+ endsWidth：如果在字符串的结束部分检测到指定文本则返回 true，否则返回 false。
+ ES6 之前使用 indexOf

```js
let msg = 'Hello World!';

console.log(msg.startsWith('Hello'));  // true
console.log(msg.endsWith('!'));  // true
console.log(msg.includes('o'));  // true

console.log(msg.startsWith('o'));  // false
console.log(msg.endsWith('World!'));  // true
console.log(msg.includes('x'));  // false

console.log(msg.startsWith('o', 4));  // true
console.log(msg.endsWith('o', 8));  // true
console.log(msg.includes('o', 8));  // false
```

## 2. repeat 方法

```js
console.log('x'.repeat(3));  // 'xxx'
```