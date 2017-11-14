<template>
  <div class="add">
    <form @submit.prevent="addItem">
      <input type="text" placeholder="please input todo...">
      <input type="submit" value="Add">
    </form>
  </div>
</template>

<script>
export default {
  name: "add-item",
  methods: {
    addItem(e) {
      const form = e.target;
      const input = form[0];
      const value = input.value;

      this.$emit("addItem", value);
      input.value = "";
    }
  }
};
</script>

