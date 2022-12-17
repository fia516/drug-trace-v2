<template>
  <v-app id="inspire"
   :style="{ background: '#ECEFF1' }">
   <v-divider></v-divider>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    
  }),
};

</script>
