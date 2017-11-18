<template>
  <div class="editor-wrap" @click="clearSelected">
    <Row class="editor-content" type="flex">
      <Col span="6" class="editor-nav">
      <div class="editor-title">Electron-vue Editor</div>
      <post-list :items="posts" @select="selectPost"></post-list>
      </Col>
      <Col span="18">
      <div class="editor-post-header">
        <input @click.stop @keyup="changeTitle" v-if="selected >= 0" type="text" :value="postTitle" placeholder="input tilte">
        <p v-else>{{postTitle}}</p>
      </div>
      <div class="editor-post-content">
        <textarea v-if="selected >= 0" @keyup="changeValue" name="editorPostInput" id="editorPostInput" class="editor-post-input"
          :value="getPostContent" @click.stop placeholder="input value"></textarea>
        <Button v-else-if="!posts.length" type="ghost" @click.stop="addPost">Add post</Button>
        <div v-else>
          <p>Select a Post. or</p>
          <Button type="ghost" @click.stop="addPost">Add post</Button>
        </div>
      </div>

      <post-action v-if="selected >= 0" :postId="selected" @actionSubmit="submit"></post-action>
      </Col>
    </Row>
  </div>
</template>

<script>
import { ipcRenderer, remote } from "electron";
import fs from "fs";
import path from "path";

import PostAction from "./postAction";
import PostList from "./PostList";

function save() {
  let posts = JSON.stringify(this.posts);
  let filePath = path.join(remote.app.getPath("userData"), "posts.txt");

  fs.writeFile(filePath, posts, err => {
    if (err) {
      console.error(err);
    }
  });
}

const Editor = {
  name: "editor",
  components: {
    PostAction,
    PostList
  },
  data() {
    return {
      posts: [],
      selected: undefined,
      tempPost: {}
    };
  },
  computed: {
    postTitle() {
      let title = "Empty, please create your first post.";

      if (this.posts.length) {
        title = "No post selected.";
      }

      if (this.selected >= 0) {
        title = this.posts.filter(post => {
          return post.id === this.selected;
        })[0].title;
      }

      return title;
    },
    getPostContent() {
      return this.posts[this.selected].value;
    }
  },
  methods: {
    selectPost(id) {
      this.selected = id;

      this.tempPost = this.posts[id];
    },
    addPost() {
      const id = this.posts.length;

      this.posts.push({
        id,
        title: "",
        value: ""
      });

      this.selected = id;
    },
    clearSelected() {
      this.posts.forEach((post, index) => {
        if (!post.title && !post.value) {
          this.posts.splice(index, 1);
        }
      });

      this.selected = undefined;
    },
    submit(type) {
      if (type === "save") {
        const oldPosts = [].concat(this.posts);

        oldPosts[this.selected] = Object.assign(
          {},
          oldPosts[this.selected],
          this.tempPost
        );

        this.posts = [].concat(oldPosts);
      
        save.call(this);
      }


      this.selected = undefined;
    },
    changeTitle(e) {
      let title = e.target.value;

      this.tempPost = Object.assign({}, this.tempPost, {
        title
      });
    },
    changeValue(e) {
      let value = e.target.value;

      this.tempPost = Object.assign({}, this.tempPost, {
        value
      });
    }
  },
  mounted() {
    ipcRenderer.on("initList", (event, data) => {
      this.posts = JSON.parse(data);
    });
  }
};

export default Editor;
</script>

<style>
html,
body,
#app {
  height: 100%;
}
</style>

<style scoped>
/*
  core style
 */

.editor-wrap {
  height: 100%;
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
}

.editor-content {
  height: 100%;
}
/*
    nav style
   */

.editor-nav {
  background: #464c5b;
}

.editor-title {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  background: #5b6270;
  font-size: 18px;
}
/*
    post style
   */

.editor-post-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  font-size: 24px;
}

.editor-post-header input {
  border: 1px solid transparent;
  transition: border-color 200ms;
}

.editor-post-header input:hover {
  border-color: #dddddd;
  transition: border-color 200ms;
}

.editor-post-header input:focus {
  outline: none;
  border-color: #d7dde4;
  transition: border-color 200ms;
}

.editor-post-content {
  margin: 15px;
  padding: 12px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
}

.editor-post-input {
  padding: 10px;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  border: 1px solid transparent;
  resize: none;
}

.editor-post-input:focus {
  outline: none;
  border-color: lightblue;
}
/*
    editor post actions
   */

.editor-post-action {
  position: fixed;
  right: 10px;
  bottom: 10px;
}
</style>