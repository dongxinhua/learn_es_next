module.exports = {
    base: '/learn_es_next/', /* 基础虚拟路径 */
    dest: 'docs/dist', /* 打包文件基础路径, 在命令所在目录下 */
    title: 'Learn-ES-Next', // 标题
    description: '学习ES6笔记  ---  coderdxh', // 标题下的描述
    
    themeConfig: { // 主题配置
      sidebar: [ // 左侧导航
        {
          title: '基本', // 标题
          collapsable: false, // 下级列表不可折叠
          children: [ // 下级列表
            'chapter1/scoped',
            'chapter1/string',
            'chapter1/function',
            'chapter1/object',
            'chapter1/symbol',
            'chapter1/set-map',
          ],
        },
        {
          title: '提升', // 标题
          collapsable: false, // 下级列表不可折叠
          children: [ // 下级列表
            'chapter2/iterator',
          ],
        },
      ],
      sidebarDepth: 5 // 左侧导航的深度默认是2级
    },
  
    head: [ // 指定网页head图标
      ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `/favicon.ico` }]
    ]
  }