<template>
  <li :id="todo.id">
    {{todo.value}}
    <span v-on:click='remove'>X</span>  
  </li>
</template>

<script>
export default {
  name: "todo-item",
  props: ["todo"],
  methods: {
    remove() {
      this.$emit('removeItem', this.todo.id);
    }
  }
};
</script>

