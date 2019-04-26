<template>
  <div class="user">
    <v-snackbar v-model="snackbar" top :timeout="0" color="error">
      <span>{{ snackbar_msg }}</span>
      <v-btn flat @click="snackbar=false">Close</v-btn>
    </v-snackbar>
    <v-container >      
        <v-layout align-center justify-center>
            <v-flex sm6 md6 lg2>
                <v-avatar size="32px">
                  <img :src="user.photoURL">
                </v-avatar>
            </v-flex>
            <v-flex sm6 md6 lg2 >
                <div class="subheading grey--text">{{ user.displayName }}</div>
            </v-flex>
        </v-layout>
        <v-switch large v-model="going" label="Going?" ></v-switch>
        <v-layout column>
            <v-text-field large flat label="Place" v-model="place_1"></v-text-field>
            <v-text-field large flat label="Place" v-model="place_2"></v-text-field>
            <v-text-field large flat label="Place" v-model="place_3"></v-text-field>
            <v-text-field large flat label="Place" v-model="place_4"></v-text-field>
            <v-text-field large flat label="Place" v-model="place_5"></v-text-field>
        </v-layout>

        <v-layout align-center justify-center>
            <v-flex xs6>
            <!--- v-flex is centered now, but we need to center button inside v-flex -->
            <div class="text-xs-center">
                <v-btn large dark color="green" @click="save()" slot="activator">Save</v-btn>
            </div>
            </v-flex>
        </v-layout>
    </v-container>          
  </div>
</template>

<script>

import {_} from 'vue-underscore';
import firebase from '@/fb'
var stringSimilarity = require('string-similarity');

const usersRef = firebase.firestore().collection("users")
const historyRef = firebase.firestore().collection("history")

function isSimilar (str1, str2) {
  var similarity = stringSimilarity.compareTwoStrings(str1.toUpperCase(), str2.toUpperCase());
  if(similarity >= 0.6666666) {
    console.log("Similarity found ( " + str1 + " , " + str2 + " ) => " + similarity);
    return true;
  }
  return false;
}

function isSimilarInArray(array) {
  var items = []
  for(var i in array)  {
    for(var j in array)  {
      if(i != j) {
        if(isSimilar(array[i], array[j])) {
          items = items.concat(array[i])
        }
      }
    }
  }
  return _.uniq(items);
}

function isSimilarInTwoArrays(array1, array2) {
  var items = []
  for(var i in array1)  {
    for(var j in array2)  {
      if(isSimilar(array1[i], array2[j])) {
        items = items.concat(array1[i])
      }
    }
  }
  return _.uniq(items);
}


export default {
  data() {
    return {
        snackbar: false,
        snackbar_msg: null,
        user: {},
        picks: [],
        going: false,
        place_1: "",
        place_2: "",
        place_3: "",
        place_4: "",
        place_5: "",
    }
  },
  methods: {
    save() {
      var self = this;
      var places = [this.place_1, this.place_2, this.place_3, this.place_4, this.place_5];
      var allDups = [];

      //Allow for nulls & "", so remove them from the similarity checks
      places = _.without(places, "", null);

      // check to see if any of your places are similar
      allDups = allDups.concat(isSimilarInArray(places));

      //Check to see if any of your places have previously been picked
      allDups = allDups.concat(isSimilarInTwoArrays(places, self.picks));

      // check to see if any of the places match already stored places for attendees
      usersRef.get().then(function(querySnapshot) {

        querySnapshot.forEach(function(doc) {

          //Only get those going and not the picker's data
          if(doc.data().going && (doc.id != self.user.uid)) {
            places.forEach(function(myPlace) {
              doc.data().places.forEach(function(place) {
                if(isSimilar(myPlace, place)) {
                  allDups = allDups.concat(place);               
                }
              });
            });
          }
        });

        allDups = _.uniq(allDups);
 
        //done looping, if no dups save and send home
        if(!allDups.length) {
          usersRef.doc(self.user.uid).set({
              "displayName": self.user.displayName,
              "photoURL": self.user.photoURL, 
              "going": self.going,
              "places": places,
          });
          self.$router.replace('home')
        }
        // else null out the dups and pop the snackbar
        else {
          allDups.forEach(function(place) {
            if(isSimilar(place, self.place_1)) {
              self.place_1 = "";
            } else if (isSimilar(place, self.place_2)) {
              self.place_2 = "";
            } else if (isSimilar(place, self.place_3)) {
              self.place_3 = "";
            } else if (isSimilar(place, self.place_4)) {
              self.place_4 = "";
            } else if (isSimilar(place, self.place_5)) {
              self.place_5 = "";
            }
          });
          self.snackbar = true;
          self.snackbar_msg = "Duplicates or previous picks: \n" + allDups;
        }
      });
    }
  },
  created() {
    var self = this;
    self.user = firebase.auth().currentUser;
    usersRef.doc(self.user.uid).get()
    .then(function(doc) {
        if (doc.exists) {
          self.displayName    = doc.data().displayName;
          self.photoURL       = doc.data().photoURL;
          self.going          = doc.data().going;
          self.place_1        = (_.isUndefined(doc.data().places[0]))  ? "" : doc.data().places[0];
          self.place_2        = (_.isUndefined(doc.data().places[1]))  ? "" : doc.data().places[1];
          self.place_3        = (_.isUndefined(doc.data().places[2]))  ? "" : doc.data().places[2];
          self.place_4        = (_.isUndefined(doc.data().places[3]))  ? "" : doc.data().places[3];
          self.place_5        = (_.isUndefined(doc.data().places[4]))  ? "" : doc.data().places[4];
        }
    }).catch(function(error) {
      console.log(error);
    });

    var twoWeeksAgo = Date.now() - 1209600000;
    historyRef.where("timestamp", ">", twoWeeksAgo).onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          self.picks.push(doc.data().place)
        });
    });
  }
}
</script>
