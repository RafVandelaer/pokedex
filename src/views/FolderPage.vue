<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title class="caps">
          <div v-for="pok in pokeDetail" :key="pok.id">
           {{pok.name}}
          </div>  
        </ion-title>
        <ion-buttons slot="end">
            <ion-button>
              <div v-for="pok in pokeDetail" :key="pok.id">
               <!--<ion-icon class="like-icon" @click="likePokemon(pok.id)" float-right :icon="heartOutline" />-->
               <ion-icon class="like-icon" @click="likePokemon(pok.id)" :icon="isLiked ? heart : heartOutline" float-right />
               
            </div>
            </ion-button>
          </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      
    
      

      <ion-grid id="pokemonDetails">
        <ion-row>
        
        </ion-row>
        <ion-row>
          <ion-col >
            
            <div class="height" v-for="pok in pokeDetail" :key="pok.id">
           
              <img class="frontSprite height vertical-align" :alt="pok.name" :src="pok.sprites.front_default" />
            
              
            </div>
        </ion-col>
          <ion-col>
            <ion-card>
              <ion-card-header>
                <ion-card-subtitle>Stats</ion-card-subtitle>
              </ion-card-header>
             <ion-card-content>
              <span v-for="(pok, ind)  in pokeDetail" :key="ind">
              <ion-row  v-for="(stat, ind)  in pok.stats" :key="ind">
                <ion-col class="caps" size="3">{{stat.stat.name}}</ion-col>
                <ion-col size="1" class="blackColor autoMargin">{{stat.base_stat}}</ion-col>
                <ion-col size="8" class="autoMargin" ><ion-progress-bar :color="stat.base_stat <50 ?  'danger'  : 'success'"   v-bind:value="stat.base_stat/100"></ion-progress-bar></ion-col>
              </ion-row>
            </span>
                </ion-card-content>
              </ion-card>
          </ion-col>
         
          
        </ion-row>
        <ion-row>
          <ion-col size="6">
           
          <ion-card>
            <ion-card-header>
                <ion-card-subtitle>Info</ion-card-subtitle>
              </ion-card-header>
             <ion-card-content  v-for="(pok, ind)  in pokeDetail" :key="ind">
              
              <ion-row >
                <ion-col class="caps" size="6">Types</ion-col>
                <ion-col>
                    <span style="width: 100%;" v-for="(types, ind)  in pok.types" :key="ind">
                      <ion-badge :class="types.type.name" class="noMargin" >{{types.type.name}}</ion-badge>
                    </span>
                </ion-col>
              </ion-row>
              <ion-row >
                <ion-col class="caps" size="6">Nummer</ion-col>
                <ion-col class="caps">
                    {{pok.id}}
                </ion-col>
              </ion-row>
              <ion-row >
                <ion-col class="caps" size="6">Gewicht</ion-col>
                <ion-col>
                    {{pok.weight}} kg
                </ion-col>
              </ion-row>
              <ion-row >
                <ion-col class="caps" size="6">Hoogte</ion-col>
                <ion-col >
                    {{pok.height}}m
                </ion-col>
              </ion-row>
              <ion-row >
                <ion-col class="caps" size="6">Abilities</ion-col>
                <ion-col>
                    <span class="caps" style="width: 100%;" v-for="(abs, ind)  in pok.abilities" :key="ind">
                      {{abs.ability.name}}<br>
                    </span>
                </ion-col>
              </ion-row>
              </ion-card-content>
          </ion-card>
          </ion-col>
          <ion-col>
            <ion-card>
              <ion-card-header>
                <ion-card-subtitle>Moveset</ion-card-subtitle>
              </ion-card-header>
             <ion-card-content>
              <span v-for="(pok, ind)  in pokeDetail" :key="ind">
              <ion-row  v-for="(mov, ind)  in pok.moves.slice(0,5)" :key="ind">
               
                <ion-col class="caps" size="3">{{mov.move.name}}</ion-col>
                <ion-col size="1" class="autoMargin"><ion-badge class="moveset-badge">Level {{Math.ceil(Math.random()*20)}}</ion-badge></ion-col>
               
                
              </ion-row>
            </span>
                </ion-card-content>
              </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router'
import { IonButtons, IonContent, IonIcon, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { heartOutline, heartSharp,heart } from 'ionicons/icons';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useCookie } from 'vue-cookie-next'
import Vue from 'vue'

import {Pokedex } from '../ts/detailedPokemon';
import axios from 'axios';


export default defineComponent({
  name: 'FolderPage',
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar
  },
  methods: {

     randomKey() {
         return (new Date()).getTime() + Math.floor(Math.random() * 10000).toString()
    },

    //cookies with favo's
    likePokemon(id: number){
    //not liked
      if(!this.isLiked){
        var favos :number[];
        console.log(this.$cookie.isCookieAvailable('favos'))

        //if cookie exists
        if(this.$cookie.isCookieAvailable('favos')){
          
          favos = this.$cookie.getCookie('favos').split(",");

        favos.push(id);
        }else{
          favos = [id]
        }
        
      }
      //is liked, unlike
      else{
        favos = this.$cookie.getCookie('favos').split(",");
        //search ID, delete
        favos.forEach(function(number, index) {
           if(number == id){
            favos.splice(index,1)
           }
        });
        

      }
      console.log(favos.toString())
      this.$cookie.setCookie('favos', favos.toString());
      this.isLiked = !this.isLiked;
    },
  },

  setup(){
    const route = useRoute();
    const cookie = useCookie();
    const heartIcon = 'heartOutline';

    var isLiked = ref(false);

   console.log(route.params);

    const pokeDetail = ref<Pokedex[]>([]);
    
  getDetailedPokemon().then(function(res: Pokedex){
      pokeDetail.value.pop();
      pokeDetail.value.push(res);

      //check if pokemon is liked, if so heart full
      var favos :number[]= cookie.getCookie('favos').split(",");

        favos.forEach(number => {
           if(number == res.id){
            isLiked.value = true;
           }
        });

  });

  async function getDetailedPokemon() {
    // 👇️ const data: GetUsersResponse
    const { data, status } = await axios.get<Pokedex>(
      'https://pokeapi.co/api/v2/pokemon/' + route.params.name,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )

    
    if(status != 200){
      console.log(status)
    }
   
    let poke :Pokedex=  await data;
    return poke;
  
}

 
  //axiosTest().then(response => pokemon);
  
     
  return{
      pokeDetail,
      heartOutline,
      heart,
      isLiked,
      onChange: ref(false),
      heartIcon,
      }
  },
  data(){
      return{
      }
  }, 
  
  
});


</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
