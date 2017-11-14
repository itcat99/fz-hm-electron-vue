<template>
  <div class="todo">
    <ol>
      <!-- <todo-item v-for="item in items" v-bind:todo='item' v-bind:key='item.id'></todo-item> -->
      <todo-item v-for="item in items" v-bind:todo='item' v-bind:key='item.id' @removeItem="removeItem"></todo-item>
    </ol>
    <todo-add @addItem="updateItemList"></todo-add>
  </div>
</template>

<script>
import fs from "fs";
import path from "path";
import TodoAdd from "./TodoAdd";
import TodoItem from "./TodoItem";
import { ipcRenderer } from "electron";

function save() {
  let items = JSON.stringify(this.items);
  fs.writeFile(path.join(__static, "/list.txt"), items, err => {
    if (err) {
      console.error(err);
    }
  });
}

let todo = {
  name: "todo",
  components: { TodoAdd, TodoItem },
  data() {
    return {
      items: []
    };
  },
  methods: {
    updateItemList(value) {
      let index = this.items.length;

      this.items.push({
        id: index,
        value
      });

      save.call(this);
    },
    removeItem(id) {
      this.items.forEach((v, i) => {
        if (v.id === id) {
          this.items.splice(i, 1);
        }
      });

      save.call(this);
    }
  },
  mounted() {
    ipcRenderer.on("initList", (event, data) => {
      this.items = JSON.parse(data);
    });
  }
};

export default todo;
</script>
