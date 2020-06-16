<template>
  <div>
    <section class="section" v-for="section in history">
      <h2 class="title is-2">{{section.name}}</h2>
      <ul v-for="pkg in section.packages">
        <li>
          <a>{{pkg.name}}</a>
        </li>
        <!-- 

        <h3 class="title is-3"></h3>
        <h4 class="title is-4">Versions</h4>
        <p v-for="version in pkg.versions">{{version}}</p>-->
      </ul>
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
