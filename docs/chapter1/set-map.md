# Set集合与Map集合

​		Set 集合是一种无重复元素的列表，Map集合经常被用于缓存频繁取用的数据。一般来说，Set集合常被用于检查对象中是否存在某个键名，而Map集合常被用于获取已存的信息。

## 1. Set集合

​		Set 集合是一种包含多个非重复数据的**有序列表**，值与值之间的等价性是通过 Object.is（Set集合中，+0和-0被认为是相等的）方法来判断的，如果相同，则会自动过滤重复的值，所以可以用Set集合来过滤数组中的重复元素。Set集合不是数组的子集，所以不能随即访问集合的值，只能通过 **has** 方法检测指定的值是否存在于 Set 集合中，或者通过 **size** 属性查看 Set 集合中值得数量。Set 类型同样支持 **forEach** 方法来处理集合中的每一个值。

​		实际上，Set构造函数可以接受所有可迭代对象作为参数。

方法：

+ 添加：add()
+ 删除：delete()
+ 存在：has()  ---> boolean
+ 遍历：forEach()
+ 清除：clear

属性：

+ 数量：size

### 1.1 Set集合的forEach方法

​		forEach 方法的第一个参数是一个回调函数，接受三个参数：Set集合中下一次索引的位置；与第一个参数一样的值；被遍历的Set集合本身。

```js
let set = new Set([1, 2]);

set.forEach((value, key, ownerSet) => {
  console.log(key + ' ' + value);
  console.log(ownerSet === set);
});

// 1 1
// true

// 2 2
// true
```

​forEach 方法的第二个参数，指定的this指向。

::: tip 注意
尽管**Set**集合更适合用来跟踪多个值，而且又可以通过**forEach**方法操作集合中的每一个元素，但是不能像访问数组元素那样直接通过索引访问集合中的元素。如果需要，最好先将Set集合转换成一个数组。
:::

### 1.2 将Set集合转换为数组

​		Array  --->   Set

```js
let set = new Set([1, 2, 3]);
```

​		Set  --->   Array

```js
let set = new Set([1, 2, 3]);
let arr = [...set];
```

​		数组去重

```js
function unique(arr) {
  return [...new Set(arr)];
}
```

## 2. Weak Set 集合

​		**Weak Set**集合是一类特殊的 Set 集合，集合只支持存放对象的**弱引用**，当该对象的其他强引用都被清除时，集合中的弱引用也会自动被垃圾回收，由于内存管理非常复杂，Weak Set 集合不可以被检查，因此追踪成组的对象是该集合最好的使用方式。

​		Weak Set集合支持三个方法：

+ 添加 add
+ 存在 has
+ 删除 delete

### 2.1 创建Weak Set集合

​		用 WeakSet 构造函数可以创建 Weak Set 集合。

```js
let set = new WeakSet(),
    key = {};

set.add(key);
console.log(set.has(key));  // true

set.delete(key);
console.log(set.has(key));  // false
```

​		注意：WeakSet 构造函数不接受任何原始值，如果数组中包含其他非对象值，程序会抛出错误。

## 3. Set与Weak Set 的主要区别

+ 在 WeakSet 的实例中，如果向 add 方法传入非对象参数会导致程序报错，而向has和delete方法传入非对象参数则会返回false
+ Weak Set集合不可迭代，所以不能被用于 for-of循环
+ Weak Set集合不暴露任何迭代器，所以无法通过程序本身来检测其中的内容
+ Weak Set集合不支持 forEach 方法
+ Weak Set集合不支持 size 属性

:::tip 推荐
如果只需要跟踪对象引用，更应该使用 Weak Set 集合而不是普通的 Set 集合。
:::

## 4. Map 集合

​		Map 是多个键值对组成的**有序集合**，键名支持任意数据类型。与Set集合相似的是，Map集合也是通过 **Object.is** 方法来过滤重复值。通过**set**方法可以将任意类型的值添加到集合中，通过**get**方法可以检索集合中所有的值，通过**size**属性可以检查集合中包含的值的数量，通过 **forEach** 方法可以遍历并操作集合中的每一个值。

```js
let map = new Map();
map.set('name', 'coderdxh');
map.set('age', 18);

console.log(map.get('name'));  // coderdxh
console.log(map.get('age'));  // 18
console.log(map.get('height'));  // undefined

let key1 = {},
    key2 = {};

map.set(key1, 11);
map.set(key2, 22);

console.log(map.get(key1));  // 11
console.log(map.get(key2));  // 22
```

方法：

+ 设置 set
+ 获取 get
+ 遍历 forEach
+ 存在 has(key)
+ 删除 delete(key)
+ 清除 clear

属性：

+ 数量 size

```js
let map = new Map();
map.set('name', 'coderdxh');
map.set('age', 18);

console.log(map.size);  // 2
console.log(map.has('name'));  // true
console.log(map.get('name'));  // 'coderdxh'
console.log(map.has('age'));  // true
console.log(map.get('age'));  // 18

map.delete('name');
console.log(map.has('name'));  // false
console.log(map.get('name'));  // undefined
console.log(map.size);  // 1

map.set('height', 1.88);
console.log(map);   // Map { 'age' => 18, 'height' => 1.88 }

map.clear();
console.log(map.has('name'));  // false
console.log(map.get('name'));  // undefined
console.log(map.has('age'));  // false
console.log(map.get('age'));  // undefined
console.log(map.has('height'));  // false
console.log(map.get('height'));  // undefined
console.log(map.size);  // 0
console.log(map);  // Map{}
```

### 4.1 初始化

```js
let map = new Map([['name', 'coderdxh'], ['age', 18], ['height', 1.88]]);

console.log(map);  // Map(3) {'name' => 'coderdxh', 'age' => 18, 'height' => 1.88}
```

### 4.2 forEach 方法

​		forEach 方法第一个参数为回调函数，接收三个参数：

+ Map 集合中下一次索引的位置
+ 值对应的键名
+ Map集合本身

```js
let map = new Map([['name', 'coderdxh'], ['age', 18], ['height', 1.88]]);

map.forEach((value, key, ownerMap) => {
  console.log(key + ' ' + value);
  console.log(map === ownerMap);
});

// name coderdxh
// true
// age 18
// true
// height 1.88
// true
```

## 5. Weak Map 集合

 		**Weak Map** 是**弱引用**的Map集合，也用于存储对象的弱引用。Weak Map集合中的**键名必须是一个对象**，如果使用非对象键名会报错；集合中保存的是这些对象的弱引用，如果在弱引用之外不存在其他的强引用，引擎的垃圾回收机制会自动回收这个对象，同时会移除Weak Map集合中的键值对。但是**只有集合的键名**遵从这个规则，键名对应的值如果是一个对象，则保存的是对象的强引用，不会触发垃圾回收机制。

​		Weak Map 集合最大的用途是保存 Web 页面中的 DOM元素，当DOM元素消失时，可以自动销毁集合中的相关对象。

​		ES6 中 Weak Map 类型是一种存储着许多键值对的无序列表，列表的**键名必选是非null类型的对象**，键名对应的值则可以是任意类型。

​		不支持size属性，不能验证集合是否为空。支持set、get、has、delete方法。

```js
let map = new WeakMap();
let key1 = {},
    key2 = {};

map.set(key1, 11);
map.set(key2, 22);

console.log(map.has(key1));  // true
console.log(map.get(key1));  // 11

map.delete(key1);
console.log(map.has(key1)); // false
console.log(map.get(key1)); // undefined
```

