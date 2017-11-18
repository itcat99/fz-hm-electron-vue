<template>
  <ul>
    <li v-for="item in items" :key="item.id" :class="{'list-item':defaultClass, 'selected':item.selected}" @click.stop="select(item.id)">{{ item.title }}</li>
  </ul>
</template>

<script>
  export default {
    name: "post-list",
    props: ['items'],
    data(){
      return {
        defaultClass: 'list-item'
      }
    },
    computed: {
    },
    methods: {
      select(id) {
        this.$emit("select", id);
      }
    }
  }
</script>

<style scoped>
  .list-item{
    color: #fff;
    font-size: 14px;
    height: 48px;
    padding: 10px 8px;
    border-bottom: 1px solid #fff;
    transition: background-color 300ms;
  }

  .list-item:hover{
    cursor: pointer;
    background-color: #5e677c;
    transition: background-color 300ms;
  }

  .selected{
    background-color: #5e677c;
  }
</style>