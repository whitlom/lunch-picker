<template>
  <div class="history">
      <h1 class="subheading grey--text">History</h1>

    <v-layout row wrap align-center >
      <v-layout align-center justify-center v-for="user in users" :key="user.photoURL">
              <v-avatar size="36px">
                <img :src="user.photoURL">
              </v-avatar>
              <div>{{ user.count }}</div>
      </v-layout>
    </v-layout>

    <v-container class="my-1" >  
        <v-layout row wrap align-center justify-center >
            <v-flex xs6>
                <div class="caption grey--text">Place</div>
            </v-flex>
            <v-flex xs6>
                <div class="caption grey--text">Date</div>
            </v-flex>
        </v-layout>

      <v-card flat v-for="pick in picks" :key="pick.id">
        <v-layout row wrap align-center justify-center >
          <v-flex xs6>
            <div>{{ pick.place }}</div>
          </v-flex>
          <v-flex xs6>
            <div>{{ pick.timestamp }}</div>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>

    </v-container>          
  </div>
</template>

<script>
import firebase from '@/fb'
const usersRef = firebase.firestore().collection("users");
const historyRef = firebase.firestore().collection("history")

export default {
  data() {
    return {
      history: null,
      picks: [],
      users: [],

    }
  },
  methods: {
    deleteHistory() {
        historyRef.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        })
    }
  },
  created: function() {
    var self = this;

    usersRef.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var users = doc.data();

        historyRef.where("user", "==", doc.id).get().then(function(querySnapshot) {
          users.count = querySnapshot.size;
          self.users.push(users);
        });
      });
    });

    historyRef.orderBy("timestamp", "desc").limit(20).onSnapshot(function(querySnapshot) {
          self.picks = [];
          querySnapshot.forEach(function(doc) {
            var date = new Date(doc.data().timestamp);
            self.picks.push({"id": doc.id, "place": doc.data().place, "timestamp": date.toUTCString()})
          });
    }); 
  },
}
</script>
