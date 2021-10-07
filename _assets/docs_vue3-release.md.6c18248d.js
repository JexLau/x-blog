import{g as n,j as s,l as a,f as t,q as e}from"./common-bec3f312.js";const o='{"title":"纪年 |【第三期】Vue3 Release 源码解读记录","frontmatter":{"date":"2021-08-25","title":"纪年 |【第三期】Vue3 Release 源码解读记录","tags":["源码","vue3"],"describe":"Vue3 Release 源码解读"},"headers":[{"level":2,"title":"1. 学习目标和资源准备","slug":"_1-学习目标和资源准备"},{"level":2,"title":"2. Yarn Workspace","slug":"_2-yarn-workspace"},{"level":2,"title":"3. release.js 文件解读","slug":"_3-release-js-文件解读"},{"level":3,"title":"main 函数","slug":"main-函数"},{"level":2,"title":"4. 感想","slug":"_4-感想"},{"level":2,"title":"5. 实践","slug":"_5-实践"}],"relativePath":"docs/vue3-release.md","lastUpdated":1633572524715.8357}';var c={};const p=s("blockquote",null,[s("p",null,[a("【若川】Vue3 Release 源码解读："),s("a",{href:"https://juejin.cn/post/6997943192851054606",target:"_blank",rel:"noopener noreferrer"},"https://juejin.cn/post/6997943192851054606")])],-1),l=s("h2",{id:"_1-学习目标和资源准备"},[s("a",{class:"header-anchor",href:"#_1-学习目标和资源准备","aria-hidden":"true"},"#"),a(" 1. 学习目标和资源准备")],-1),u=s("p",null,[a("这一期阅读的是 Vue3 源码中的 script/release.js 代码，也就是 Vue.js 的发布流程。在上一期源码阅读中从 "),s("a",{href:"https://github.com/vuejs/vue-next/blob/master/.github/contributing.md",target:"_blank",rel:"noopener noreferrer"},".github/contributing.md"),a(" 了解到 Vue.js 采用的是 monorepo 的方式进行代码的管理。")],-1),i=s("p",null,"monorepo 是管理项目代码的一个方式，指在一个项目仓库 (repo) 中管理多个模块/包 (package)，不同于常见的每个 package 都建一个 repo。",-1),r=s("p",null,"刚好我最近搭建组件库也是使用 monorepo 的方式去管理包。 monorepo 有个缺点，因为每个包都维护着自己的 dependencies，那么在 install 的时候会导致 node_modules 的体积非常大。目前最常见的 monorepo 解决方案是使用 lerna 和 yarn 的 workspaces 特性去处理仓库的依赖，我搭建的组件库也是使用了 lerna 和 yarn。但 Vue3 的包管理没有使用 lerna，它是怎么管理依赖包的版本号呢？让我们跟着源码一探究竟。",-1),k=s("blockquote",null,[s("p",null,[s("a",{href:"https://www.lernajs.cn/",target:"_blank",rel:"noopener noreferrer"},"Lerna"),a(" 是一个管理工具，用于管理包含多个软件包（package）的 JavaScript 项目，针对使用 git 和 npm 管理多软件包代码仓库的工作流程进行优化。")])],-1),g=s("p",null,[s("strong",null,"学习目标：")],-1),d=s("p",null,"1）学习 release.js 源码，输出记录文档。",-1),m=s("p",null,[s("strong",null,"资源准备：")],-1),f=s("p",null,[a("Vue3 源码地址："),s("code",null,"https://github.com/vuejs/vue-next")],-1),h=s("h2",{id:"_2-yarn-workspace"},[s("a",{class:"header-anchor",href:"#_2-yarn-workspace","aria-hidden":"true"},"#"),a(" 2. Yarn Workspace")],-1),y=s("div",{class:"language-typescript"},[s("pre",null,[s("code",null,[s("span",{class:"token comment"},"// vue-next/package.json （多余的代码已省略）"),a("\n"),s("span",{class:"token punctuation"},"{"),a("\n    "),s("span",{class:"token string"},'"private"'),s("span",{class:"token operator"},":"),a(),s("span",{class:"token boolean"},"true"),s("span",{class:"token punctuation"},","),a("\n    "),s("span",{class:"token string"},'"version"'),s("span",{class:"token operator"},":"),a(),s("span",{class:"token string"},'"3.2.2"'),s("span",{class:"token punctuation"},","),a("\n    "),s("span",{class:"token string"},'"workspaces"'),s("span",{class:"token operator"},":"),a(),s("span",{class:"token punctuation"},"["),a("\n        "),s("span",{class:"token string"},'"packages/*"'),a("\n    "),s("span",{class:"token punctuation"},"]"),s("span",{class:"token punctuation"},","),a("\n    "),s("span",{class:"token string"},'"scripts"'),s("span",{class:"token operator"},":"),a(),s("span",{class:"token punctuation"},"{"),a("\n        "),s("span",{class:"token string"},'"release"'),s("span",{class:"token operator"},":"),a(),s("span",{class:"token string"},'"node scripts/release.js"'),a("\n    "),s("span",{class:"token punctuation"},"}"),a("\n"),s("span",{class:"token punctuation"},"}"),a("\n")])])],-1),v=s("p",null,"Yarn 从 1.0 版开始支持 Workspace （工作区），Workspace 可以更好的统一管理有多个项目的仓库。",-1),b=s("ul",null,[s("li",null,"管理依赖关系便捷：每个项目使用独立的 package.json 管理依赖，可以使用 yarn 命令一次性安装或者升级所有依赖，无需在每个目录下分别安装依赖"),s("li",null,"降低磁盘空间占用：可以使多个项目共享同一个 node_modules 目录")],-1),j=s("h2",{id:"_3-release-js-文件解读"},[s("a",{class:"header-anchor",href:"#_3-release-js-文件解读","aria-hidden":"true"},"#"),a(" 3. release.js 文件解读")],-1),w=s("p",null,[a("先手动跑一遍 "),s("code",null,"yarn run release --dry"),a("，控制台会输出以下信息（多余信息已省略），从控制台日志看出来，发布 Vue.js 会经历以下几个步骤：")],-1),_=s("div",{class:"language-"},[s("pre",null,[s("code",null,"// 确认发布版本号\n? Select release type ... \n> patch (3.2.3)\n  minor (3.3.0)\n  major (4.0.0)\n  custom\n// 执行测试用例\nRunning tests...\n// 更新依赖版本\nUpdating cross dependencies...\n// 打包编译所有包\nBuilding all packages...\n// 生成 changelog\nconventional-changelog -p angular -i CHANGELOG.md -s\n// 提交代码\nCommitting changes...\n// 发布包\nPublishing packages...\n// 推送代码到 GitHub\nPushing to GitHub...\n")])],-1),x=s("p",null,"初步了解发布流程后，来看看 release.js 源码做了什么，先看入口函数 main()",-1),V=s("h3",{id:"main-函数"},[s("a",{class:"header-anchor",href:"#main-函数","aria-hidden":"true"},"#"),a(" main 函数")],-1),G=s("p",null,"代码太多就不贴代码了，记录一下思路和思考",-1),C=s("ol",null,[s("li",null,"确认要发布的版本：")],-1),L=s("ul",null,[s("li",null,[s("ul",null,[s("li",null,"如果从命令行获取到了版本号，先验证版本号规范，再次确认版本号"),s("li",null,"如果命令行没有输入版本号，会让用户选择一个版本发布")])])],-1),P=s("p",null,[a("确认版本号使用了一个库叫 "),s("strong",null,"semver"),a("，它的作用是用于版本校验比较。")],-1),R=s("div",{class:"language-js"},[s("pre",null,[s("code",null,[s("span",{class:"token comment"},"// 目的是获取命令行参数（也就是允许用户自定义输入版本号，比如 yarn release v3.5.0）"),a("\n"),s("span",{class:"token keyword"},"const"),a(" args "),s("span",{class:"token operator"},"="),a(),s("span",{class:"token function"},"require"),s("span",{class:"token punctuation"},"("),s("span",{class:"token string"},"'minimist'"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},"("),a("process"),s("span",{class:"token punctuation"},"."),a("argv"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"slice"),s("span",{class:"token punctuation"},"("),s("span",{class:"token number"},"2"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},")"),a("\n"),s("span",{class:"token keyword"},"let"),a(" targetVersion "),s("span",{class:"token operator"},"="),a(" args"),s("span",{class:"token punctuation"},"."),a("_"),s("span",{class:"token punctuation"},"["),s("span",{class:"token number"},"0"),s("span",{class:"token punctuation"},"]"),a("\n")])])],-1),H=s("ol",{start:"2"},[s("li",null,"执行测试用例")],-1),q=s("div",{class:"language-js"},[s("pre",null,[s("code",null,[s("span",{class:"token keyword"},"const"),a(" execa "),s("span",{class:"token operator"},"="),a(),s("span",{class:"token function"},"require"),s("span",{class:"token punctuation"},"("),s("span",{class:"token string"},"'execa'"),s("span",{class:"token punctuation"},")"),a("\n"),s("span",{class:"token keyword"},"const"),a(),s("span",{class:"token function-variable function"},"run"),a(),s("span",{class:"token operator"},"="),a(),s("span",{class:"token punctuation"},"("),s("span",{class:"token parameter"},[a("bin"),s("span",{class:"token punctuation"},","),a(" args"),s("span",{class:"token punctuation"},","),a(" opts "),s("span",{class:"token operator"},"="),a(),s("span",{class:"token punctuation"},"{"),s("span",{class:"token punctuation"},"}")]),s("span",{class:"token punctuation"},")"),a(),s("span",{class:"token operator"},"=>"),a(),s("span",{class:"token function"},"execa"),s("span",{class:"token punctuation"},"("),a("bin"),s("span",{class:"token punctuation"},","),a(" args"),s("span",{class:"token punctuation"},","),a(),s("span",{class:"token punctuation"},"{"),a(" stdio"),s("span",{class:"token operator"},":"),a(),s("span",{class:"token string"},"'inherit'"),s("span",{class:"token punctuation"},","),a(),s("span",{class:"token operator"},"..."),a("opts "),s("span",{class:"token punctuation"},"}"),s("span",{class:"token punctuation"},")"),a("\n"),s("span",{class:"token keyword"},"const"),a(),s("span",{class:"token function-variable function"},"bin"),a(),s("span",{class:"token operator"},"="),a(),s("span",{class:"token parameter"},"name"),a(),s("span",{class:"token operator"},"=>"),a(" path"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"resolve"),s("span",{class:"token punctuation"},"("),a("__dirname"),s("span",{class:"token punctuation"},","),a(),s("span",{class:"token string"},"'../node_modules/.bin/'"),a(),s("span",{class:"token operator"},"+"),a(" name"),s("span",{class:"token punctuation"},")"),a("\n\n"),s("span",{class:"token keyword"},"if"),a(),s("span",{class:"token punctuation"},"("),s("span",{class:"token operator"},"!"),a("skipTests "),s("span",{class:"token operator"},"&&"),a(),s("span",{class:"token operator"},"!"),a("isDryRun"),s("span",{class:"token punctuation"},")"),a(),s("span",{class:"token punctuation"},"{"),a("\n  "),s("span",{class:"token comment"},'// bin("jest") 先获取 node_modules/.bin/jest 的目录，run 的本质就是执行命令行'),a("\n  "),s("span",{class:"token comment"},"// 这行代码的意思就相当于在命令终端，项目根目录运行 ./node_modules/.bin/jest 命令。"),a("\n  "),s("span",{class:"token keyword"},"await"),a(),s("span",{class:"token function"},"run"),s("span",{class:"token punctuation"},"("),s("span",{class:"token function"},"bin"),s("span",{class:"token punctuation"},"("),s("span",{class:"token string"},"'jest'"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},","),a(),s("span",{class:"token punctuation"},"["),s("span",{class:"token string"},"'--clearCache'"),s("span",{class:"token punctuation"},"]"),s("span",{class:"token punctuation"},")"),a("\n  "),s("span",{class:"token keyword"},"await"),a(),s("span",{class:"token function"},"run"),s("span",{class:"token punctuation"},"("),s("span",{class:"token string"},"'yarn'"),s("span",{class:"token punctuation"},","),a(),s("span",{class:"token punctuation"},"["),s("span",{class:"token string"},"'test'"),s("span",{class:"token punctuation"},","),a(),s("span",{class:"token string"},"'--bail'"),s("span",{class:"token punctuation"},"]"),s("span",{class:"token punctuation"},")"),a("\n"),s("span",{class:"token punctuation"},"}"),a(),s("span",{class:"token keyword"},"else"),a(),s("span",{class:"token punctuation"},"{"),a("\n  console"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"log"),s("span",{class:"token punctuation"},"("),s("span",{class:"token template-string"},[s("span",{class:"token template-punctuation string"},"`"),s("span",{class:"token string"},"(skipped)"),s("span",{class:"token template-punctuation string"},"`")]),s("span",{class:"token punctuation"},")"),a("\n"),s("span",{class:"token punctuation"},"}"),a("\n")])])],-1),O=s("ol",{start:"3"},[s("li",null,"更新依赖版本")],-1),T=s("div",{class:"language-js"},[s("pre",null,[s("code",null,[s("span",{class:"token comment"},"// 1）获取 packages 目录下的所有包"),a("\n"),s("span",{class:"token keyword"},"const"),a(" packages "),s("span",{class:"token operator"},"="),a(" fs\n  "),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"readdirSync"),s("span",{class:"token punctuation"},"("),a("path"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"resolve"),s("span",{class:"token punctuation"},"("),a("__dirname"),s("span",{class:"token punctuation"},","),a(),s("span",{class:"token string"},"'../packages'"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},")"),a("\n  "),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"filter"),s("span",{class:"token punctuation"},"("),s("span",{class:"token parameter"},"p"),a(),s("span",{class:"token operator"},"=>"),a(),s("span",{class:"token operator"},"!"),a("p"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"endsWith"),s("span",{class:"token punctuation"},"("),s("span",{class:"token string"},"'.ts'"),s("span",{class:"token punctuation"},")"),a(),s("span",{class:"token operator"},"&&"),a(),s("span",{class:"token operator"},"!"),a("p"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"startsWith"),s("span",{class:"token punctuation"},"("),s("span",{class:"token string"},"'.'"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},")"),a("\n"),s("span",{class:"token comment"},"// 1）获取包的根目录路径"),a("\n"),s("span",{class:"token keyword"},"const"),a(),s("span",{class:"token function-variable function"},"getPkgRoot"),a(),s("span",{class:"token operator"},"="),a(),s("span",{class:"token parameter"},"pkg"),a(),s("span",{class:"token operator"},"=>"),a(" path"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"resolve"),s("span",{class:"token punctuation"},"("),a("__dirname"),s("span",{class:"token punctuation"},","),a(),s("span",{class:"token string"},"'../packages/'"),a(),s("span",{class:"token operator"},"+"),a(" pkg"),s("span",{class:"token punctuation"},")"),a("\n"),s("span",{class:"token comment"},"// 2）更新根目录和 packages 目录下每个包的 package.json 的版本号"),a("\n"),s("span",{class:"token keyword"},"function"),a(),s("span",{class:"token function"},"updateVersions"),s("span",{class:"token punctuation"},"("),s("span",{class:"token parameter"},"version"),s("span",{class:"token punctuation"},")"),a(),s("span",{class:"token punctuation"},"{"),s("span",{class:"token punctuation"},"}"),a("\n"),s("span",{class:"token comment"},"// 3）实现更新 package.json 版本号的，以及更新依赖包的版本号"),a("\n"),s("span",{class:"token keyword"},"function"),a(),s("span",{class:"token function"},"updatePackage"),s("span",{class:"token punctuation"},"("),s("span",{class:"token parameter"},[a("pkgRoot"),s("span",{class:"token punctuation"},","),a(" version")]),s("span",{class:"token punctuation"},")"),a(),s("span",{class:"token punctuation"},"{"),s("span",{class:"token punctuation"},"}"),a("\n"),s("span",{class:"token comment"},"// 4）实现更新与 vue 相关依赖包的版本号"),a("\n"),s("span",{class:"token keyword"},"function"),a(),s("span",{class:"token function"},"updateDeps"),s("span",{class:"token punctuation"},"("),s("span",{class:"token parameter"},[a("pkg"),s("span",{class:"token punctuation"},","),a(" depType"),s("span",{class:"token punctuation"},","),a(" version")]),s("span",{class:"token punctuation"},")"),a(),s("span",{class:"token punctuation"},"{"),s("span",{class:"token punctuation"},"}"),a("\n")])])],-1),W=s("ol",{start:"4"},[s("li",null,"打包编译所有包")],-1),A=s("p",null,[a("这部分涉及另外一个文件 script/build.js，这个文件主要是将各个包打包在对应的目录下，比如打包一个依赖就运行一次"),s("code",null,"yarn build"),a("，如果有多个包，就异步循环调用打包命令。核心代码如下：")],-1),E=s("div",{class:"language-javascript"},[s("pre",null,[s("code",null,[s("span",{class:"token comment"},"/**\n * 迭代打包\n * @param {*} maxConcurrency 最大并发\n * @param {*} source 目录\n * @param {*} iteratorFn 构建函数（核心就是运行 build 命令）\n * @returns\n */"),a("\n"),s("span",{class:"token keyword"},"async"),a(),s("span",{class:"token keyword"},"function"),a(),s("span",{class:"token function"},"runParallel"),s("span",{class:"token punctuation"},"("),s("span",{class:"token parameter"},[a("maxConcurrency"),s("span",{class:"token punctuation"},","),a(" source"),s("span",{class:"token punctuation"},","),a(" iteratorFn")]),s("span",{class:"token punctuation"},")"),a(),s("span",{class:"token punctuation"},"{"),a("\n  "),s("span",{class:"token keyword"},"const"),a(" ret "),s("span",{class:"token operator"},"="),a(),s("span",{class:"token punctuation"},"["),s("span",{class:"token punctuation"},"]"),s("span",{class:"token punctuation"},";"),a("\n  "),s("span",{class:"token keyword"},"const"),a(" executing "),s("span",{class:"token operator"},"="),a(),s("span",{class:"token punctuation"},"["),s("span",{class:"token punctuation"},"]"),s("span",{class:"token punctuation"},";"),a("\n  "),s("span",{class:"token keyword"},"for"),a(),s("span",{class:"token punctuation"},"("),s("span",{class:"token keyword"},"const"),a(" item "),s("span",{class:"token keyword"},"of"),a(" source"),s("span",{class:"token punctuation"},")"),a(),s("span",{class:"token punctuation"},"{"),a("\n    "),s("span",{class:"token keyword"},"const"),a(" p "),s("span",{class:"token operator"},"="),a(" Promise"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"resolve"),s("span",{class:"token punctuation"},"("),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"then"),s("span",{class:"token punctuation"},"("),s("span",{class:"token punctuation"},"("),s("span",{class:"token punctuation"},")"),a(),s("span",{class:"token operator"},"=>"),a(),s("span",{class:"token function"},"iteratorFn"),s("span",{class:"token punctuation"},"("),a("item"),s("span",{class:"token punctuation"},","),a(" source"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},";"),a("\n    ret"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"push"),s("span",{class:"token punctuation"},"("),a("p"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},";"),a("\n\n    "),s("span",{class:"token keyword"},"if"),a(),s("span",{class:"token punctuation"},"("),a("maxConcurrency "),s("span",{class:"token operator"},"<="),a(" source"),s("span",{class:"token punctuation"},"."),a("length"),s("span",{class:"token punctuation"},")"),a(),s("span",{class:"token punctuation"},"{"),a("\n      "),s("span",{class:"token keyword"},"const"),a(" e "),s("span",{class:"token operator"},"="),a(" p"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"then"),s("span",{class:"token punctuation"},"("),s("span",{class:"token punctuation"},"("),s("span",{class:"token punctuation"},")"),a(),s("span",{class:"token operator"},"=>"),a(" executing"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"splice"),s("span",{class:"token punctuation"},"("),a("executing"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"indexOf"),s("span",{class:"token punctuation"},"("),a("e"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},","),a(),s("span",{class:"token number"},"1"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},";"),a("\n      executing"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"push"),s("span",{class:"token punctuation"},"("),a("e"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},";"),a("\n      "),s("span",{class:"token keyword"},"if"),a(),s("span",{class:"token punctuation"},"("),a("executing"),s("span",{class:"token punctuation"},"."),a("length "),s("span",{class:"token operator"},">="),a(" maxConcurrency"),s("span",{class:"token punctuation"},")"),a(),s("span",{class:"token punctuation"},"{"),a("\n        "),s("span",{class:"token keyword"},"await"),a(" Promise"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"race"),s("span",{class:"token punctuation"},"("),a("executing"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},";"),a("\n      "),s("span",{class:"token punctuation"},"}"),a("\n    "),s("span",{class:"token punctuation"},"}"),a("\n  "),s("span",{class:"token punctuation"},"}"),a("\n  "),s("span",{class:"token keyword"},"return"),a(" Promise"),s("span",{class:"token punctuation"},"."),s("span",{class:"token function"},"all"),s("span",{class:"token punctuation"},"("),a("ret"),s("span",{class:"token punctuation"},")"),s("span",{class:"token punctuation"},";"),a("\n"),s("span",{class:"token punctuation"},"}"),a("\n")])])],-1),N=s("ol",{start:"5"},[s("li",null,"生成 CHANGELOG 文件")],-1),F=s("p",null,[a("主要运行的是这行命令：conventional-changelog -p angular -i "),s("a",{href:"http://CHANGELOG.md",target:"_blank",rel:"noopener noreferrer"},"CHANGELOG.md"),a(" -s")],-1),S=s("ol",{start:"6"},[s("li",null,"提交代码")],-1),Y=s("p",null,"先执行 git diff 命令，检查文件是否有修改，如果有，执行 git add 和 git commit 命令",-1),D=s("ol",{start:"7"},[s("li",null,"发布包")],-1),U=s("p",null,"最后执行的命令是，yarn publish，发布新版本和打 Tag",-1),$=s("ol",{start:"8"},[s("li",null,"推送到 GitHub")],-1),B=s("p",null,"主要运行的命令：",-1),J=s("ul",null,[s("li",null,[s("ul",null,[s("li",null,"打 tag：git tag ${version}"),s("li",null,"推送 tag：git push origin refs/tags/${version}")])]),s("li",null,[s("ul",null,[s("li",null,"提交代码到远程仓库：git push")])])],-1),z=s("p",null,"至此，release 发布流程已经分析完了。",-1),I=s("p",null,[s("img",{src:"https://cdn.nlark.com/yuque/0/2021/jpeg/1105483/1629654601778-17189d93-a9ad-447f-9ea0-70499c538a0e.jpeg",alt:"release 发布流程"})],-1),K=s("h2",{id:"_4-感想"},[s("a",{class:"header-anchor",href:"#_4-感想","aria-hidden":"true"},"#"),a(" 4. 感想")],-1),M=s("p",null,[a("回答一下开篇的问题，Vue 是如何管理版本号呢？阅读完源码我们会分现，在发版的时候会"),s("strong",null,"统一更新所有包的 package.json 的版本号"),a("。对比我在搭建组件库过程中使用的 lerna，其实 lerna 是把 release 这一套流程封装成了一个包，它里面处理发包的流程跟 Vue Release 流程基本是一致的。")],-1),Q=s("p",null,"这次的源码解读解答了我的一些疑惑。在我搭建组件库的过程中，我一开始了解到的是一个组件一个目录，单包推送到 npm 私库。这样做的缺点很明显，需要在每个目录安装一遍依赖，单独处理版本号。后来了解到了 yarn workspace，知道它可以处理依赖安装的问题，但版本号的处理还是没有解决方案。于是我去寻找业内比较流行的解决办法，发现大部分是使用了 lerna。",-1),X=s("p",null,"于是我向我的 TL 沟通询问，可否采用 yarn + lerna 的方式来搭建组件库。我记得特别清楚他反问我，问我 lerna 解决了什么问题，我支支吾吾回答了官网上的介绍，因为我当时对 lerna 的了解仅停留在官网以及它的常用命令，实际上我不知道它解决了什么问题。TL 见我答不上来，回复了我一句【如无必要，勿增实体】。",-1),Z=s("p",null,"通过这次的源码阅读，我可以回答 TL 反问我的那个问题了，lerna 解决的是发包流程中版本号处理，自动生成 CHANGELOG 文件，提交代码，发布包，推送到仓库这几个问题，它把这几个流程封装成命令供用户使用。它不是搭建组件库非必要引入的工具，虽然引用了 lerna 会增加了新的复杂度，但在不了解发包流程的前期使用 lerna 可以使组件库开发者更专注于组件开发的工作上，而不需要过度关注如何发包。",-1),nn=s("h2",{id:"_5-实践"},[s("a",{class:"header-anchor",href:"#_5-实践","aria-hidden":"true"},"#"),a(" 5. 实践")],-1),sn=s("p",null,"经过一番思考，我认为引入 lerna 确实给系统增加了一些复杂度，因为它要求开发人员额外学习 lerna 的一些知识和命令，增加了学习成本以及系统复杂度。我觉得可以参考 Vue 的 release.js，写一个适用于项目的构建发版脚本用来发包，降低系统复杂度。",-1),an=s("p",null,"逻辑代码基本与 Vue3 的 release.js 和 build.js 一致，去掉了一些没必要的代码，比如单元测试和一些环境判断。还修改了一下 rollup.config.js 的配置，感觉用起来确实比 lerna 好用一些。最终效果如下：",-1),tn=s("p",null,[s("img",{src:"/blog/_assets/vue3-release0.f3d9178b.png",alt:""})],-1);c.render=function(a,o,c,en,on,cn){const pn=e("Comment");return t(),n("div",null,[p,l,u,i,r,k,g,d,m,f,h,y,v,b,j,w,_,x,V,G,C,L,P,R,H,q,O,T,W,A,E,N,F,S,Y,D,U,$,B,J,z,I,K,M,Q,X,Z,nn,sn,an,tn,s(pn)])};export default c;export{o as __pageData};
