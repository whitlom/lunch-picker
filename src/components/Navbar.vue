<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-side-icon aria-label="Navigation" @click="drawer = !drawer" ></v-toolbar-side-icon>
      <v-toolbar-title>
        <span>Lunch Roulette</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer" class="primary">
      <v-layout column align-center>
        <v-flex class="mt-5" v-if="user">
          <v-avatar size="100">
            <img class="text-lg-center" :src="user.photoURL">
          </v-avatar>
          <p class="white--text subheading mt-1"> {{ user.displayName }}</p>
        </v-flex>
      </v-layout>
      <v-list>
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-tile-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text">{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

  </nav>
</template>

<script>

import firebase from '@/fb'

export default {
  data() {
    return {
      user: null,
      drawer: false,
      links: [
        { icon: 'dashboard', text: 'Picker', route: '/home' },
        { icon: 'place', text: 'My Places', route: '/user' },
        { icon: 'history', text: 'History', route: '/history' },
        { icon: 'person', text: 'Sign Out', route: '/signout' },
        { icon: 'call', text: 'About', route: '/about' },
      ],
    }
  },
  created() {
    this.user = firebase.auth().currentUser;
  }
}
</script>