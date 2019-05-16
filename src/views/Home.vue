<template>
  <div class="picker">
    <v-snackbar v-model="snackbar" top :timeout="0" color="error">
      <span>{{ snackbar_msg }}</span>
      <v-btn flat @click="snackbar=false">Close</v-btn>
    </v-snackbar>

    <h1 class="subheading grey--text">Attendees</h1>
    <v-container class="my-1" >      
        <v-layout pb-1 row wrap align-center v-for="user in users" :key="user.photoURL">
            <v-flex sm6 md6 lg2 >
                <v-avatar size="36px">
                  <img :src="user.photoURL">
                </v-avatar>
            </v-flex>
            <v-flex sm6 md6 lg2>
                <div class="subheading grey--text">{{ user.displayName }}</div>
            </v-flex>
        </v-layout>
        <v-layout pa-5 align-center justify-center>
                <v-btn round large color="teal" class="white--text headline" @click="pick()" slot="activator">Pick</v-btn>
        </v-layout>

        <v-layout v-if="chosenPickUser" pa-1 row wrap  align-center justify-center>
            <v-avatar  size="36px">
              <img :src="chosenPickUser.photoURL">
            </v-avatar>
            <v-layout ml-2>
              <v-text-field large flat readonly label="Chosen Pick" v-model="chosenPick"></v-text-field>
            </v-layout>
            
        </v-layout>

    </v-container>          
  </div>
</template>

<script>
import {_} from 'vue-underscore';
import firebase from '@/fb'
const usersRef = firebase.firestore().collection("users");
const historyRef = firebase.firestore().collection("history");
const oneDay = 60 * 60 * 20 * 1000;

export default {
  data() {
    return {
      snackbar: false,
      snackbar_msg: null,
      users: [],
      places: [],
      chosenPick: null,
      chosenPickUser: null,
      lastPickTime: null
    }
  },
  created: function() {
    var self = this;
    usersRef.onSnapshot(function(querySnapshot) {
          self.users = [];
          querySnapshot.forEach(function(doc) {
            if(doc.data().going) {
              self.users.push(doc.data())
            }
          });
    });

    historyRef.orderBy("timestamp", "desc").limit(1).onSnapshot(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        self.lastPickTime = doc.data().timestamp;
      });
    }); 
  },
  methods: {
    pick() {
      var self = this;
      var testMode = false;
      var user = null;

      if(localStorage.testMode && localStorage.testMode == "true") {
        testMode = true;
      }

      if(testMode == false) {
        // Can we pick
        var d = new Date();
        var h = d.getHours();
        var isLunchTime = ( ( h  >= 11 ) && ( h <= 13 )) ? true : false;
        var isDayOld = (d - self.lastPickTime) > oneDay;

        if(!isLunchTime) {
          self.snackbar = true;
          self.snackbar_msg = "Not Lunch Time";
          return;
        }
        if(!isDayOld) {
          self.snackbar = true;
          self.snackbar_msg = "Last pick less than a day old";
          return;
        }
      }

      self.places = [];
      usersRef.where("going", "==", true).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            self.places = self.places.concat( _.without(doc.data().places, "", null)  )
        });

        if(self.places.length == 0) {
          self.snackbar = true;
          self.snackbar_msg = "No places found to pick from.";
          return;
        } 
        self.chosenPick = self.places[Math.floor(Math.random() * self.places.length)];
 
        if(testMode == false) {
          querySnapshot.forEach(function(doc) {
            var updatedPlaces = doc.data().places;
            updatedPlaces[updatedPlaces.findIndex(el => el == self.chosenPick)] = "";
            if(!_.isEqual(updatedPlaces, doc.data().places)) {
              user = doc.ref.id;
              usersRef.doc(user).get().then(function(doc) {
                if (doc.exists) {
                    self.chosenPickUser = doc.data();
                }
              });
             doc.ref.update({"places": updatedPlaces});
            }
          });

          historyRef.add({
              "place": self.chosenPick,
              "timestamp": Date.now(),
              "user": user 
          });
        }
      });
    }
  }
}
</script>
