<template>
  <div class="history">
    <v-layout row wrap align-center>
        <h1 class="subheading grey--text">History</h1>
        <!-- <v-spacer></v-spacer>
        <v-btn large flat color="red" @click="deleteHistory()" slot="activator">Delete</v-btn> -->
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
const historyRef = firebase.firestore().collection("history")

export default {
  data() {
    return {
      history: null,
      picks: []
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
    historyRef.orderBy("timestamp", "desc").limit(5).onSnapshot(function(querySnapshot) {
          self.picks = [];
          querySnapshot.forEach(function(doc) {
            //   debugger;
            var date = new Date(doc.data().timestamp);
            self.picks.push({"id": doc.id, "place": doc.data().place, "timestamp": date.toUTCString()})
          });
    }); 
  },
}
</script>
