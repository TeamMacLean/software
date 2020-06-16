<template>
  <div>
    <section class="section" v-for="section in history">
      <h2 class="title is-2">{{section.name}}</h2>
      <div v-for="pkg in section.packages">
        <h3 class="title is-3">{{pkg.name}} - {{pkg.path}}</h3>
        <h4 class="title is-4">Versions</h4>
        <p v-for="version in pkg.versions">{{version}}</p>
        <hr />
      </div>
    </section>
  </div>
</template>

<script>
const history = require("~/history/output.json");

export default {
  name: "HomePage",
  data() {
    return {
      history: history
    };
  }
};
</script>
