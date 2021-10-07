<template>
  <div id="gitalk-container"></div>
</template>

<script>
  export default {
    name: "blog-comments",
    mounted() {
      const commentConfig = {
        // 是否开启
        enable: true,
        // clientID
        clientID: "f9ec9d628144bf9c9507",
        // clientSecret
        clientSecret: "557e9a333c6dfd8a0563e04875504bfd055cf391",
        // 评论项目名
        repo: 'blog-comments',
        owner: 'JexLau',
        admin: ['JexLau'],
        githubID:'JexLau',
        id: decodeURI(window.location.pathname),
        language:'zh-CN',
        distractionFreeMode: true
      };
      const gitalk = new Gitalk(commentConfig);
      gitalk.render("gitalk-container");
    },
  };
</script>