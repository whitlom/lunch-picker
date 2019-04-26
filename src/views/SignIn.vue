<template lang="html">
  <div id="firebaseui-auth-container"></div>
</template>

<script>

import firebase from '@/fb';
import firebaseui from 'firebaseui'

export default {
  name: 'signin',
  mounted() {
    var uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ]
      };

    let ui = firebaseui.auth.AuthUI.getInstance()
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth())
    }
    ui.start('#firebaseui-auth-container', uiConfig)   
  },
}

</script>