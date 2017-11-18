<template>
  <li :class="{'list-item':defaultClass, 'list-selected':isSelected}" @click.stop="select">{{ title }}</li>
</template>

<script>
  export default {
    name: 'list-item',
    props: ['info', 'selected'],
    data(){
      return {
        id: this.info.id,
        title: this.info.title,
        defaultClass: 'list-item'
      }
    },
    computed: {
      isSelected(){
        return this.id === this.selected;
      }
    },
    methods: {
      select() {
        this.$emit("select", this.id);
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

  .list-selected{
    background-color: #5e677c;
  }
</style>


