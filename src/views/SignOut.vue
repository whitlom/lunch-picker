<template>
  <div class="signout">
  </div>
</template>

<script>
import firebase from '@/fb';
export default {
    name: 'signout',
    mounted() {
        firebase.auth().signOut().then(() => {
            console.log("Current User signed out")
            this.$router.replace('signin')
        })
    }
}
</script>