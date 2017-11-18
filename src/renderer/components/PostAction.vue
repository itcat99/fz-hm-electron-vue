<template>
  <div class="actions">
    <Button type="primary" @click.stop="submit('save')">save</Button>
    <Button type="ghost" @click.stop="submit('cancel')">cancel</Button>
  </div>
</template>

<script>
  export default {
    name: "post-action",
    methods: {
      submit(type) {
        this.$emit('actionSubmit', type)
      }
    }
  };
</script>

<style scoped>
  .actions {
    position: fixed;
    right: 10px;
    bottom: 10px;
  }
</style>