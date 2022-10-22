<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title class="caps">{{ $route.params.name}}</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      
    
      

      <ion-grid id="pokemonDetails">
        <ion-row>
          <ion-col >
            
            <div class="height" v-for="pok in pokeDetail" :key="pok.id">
           
              <img class="frontSprite height vertical-align" :alt="pok.name" :src="pok.sprites.front_default" />
            
              
            </div>
        </ion-col>
          <ion-col>
            Stats
            <ion-card>
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
            Info
          <ion-card>
            
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
                    {{pok.name}}
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
                      {{abs.ability.name}}&nbsp;
                    </span>
                </ion-col>
              </ion-row>

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
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
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
  created() {
  
    this.$watch(
      () => this.$route.params,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (toParams :any) => {
      //  this.getPokemonDetails(toParams.name);
        /*if(!isNaN(toParams.name)){
        //retreivePokemon(toParams);
        this.getPokemonDetails(toParams.name);
        

        }else if (toParams.name === ""){
          // no poke served. id == 1
          this.getPokemonDetails(1);
          console.log("no name given")
          
        }
        else{
          // if name in route
          this.getPokemonDetails(toParams.name);
          
          
        }*/
      }
      
    )
    
  },
  methods: {
     randomKey() {
   return (new Date()).getTime() + Math.floor(Math.random() * 10000).toString()
    },
    
    getPokemonDetails (name: any){
      try {
            axios.get('https://pokeapi.co/api/v2/pokemon/' + name,{
              headers: {
                'Content-Type': 'application/json',
            }
            }).then(resp => {

            //console.log(resp.data);
            //const pok: Pokedex = resp.data;
           // this.pokemon = resp.data;
            
            return resp.data;

            });
             } 
              catch (err) {
                  console.error(err);
                  //todo error
                           
              }
    },
  },

  setup(){
    const route = useRoute();
    const isReady = false;
   // let pokemon = ref<Pokedex>();
   console.log(route.params);

  //let pokemon :Pokedex = {name: 'test'};
  //const pokeDetail = ref<Pokedex[]>([]);
    const pokeDetail = ref<Pokedex[]>([]);
    
  getDetailedPokemon().then(function(res: Pokedex){
      pokeDetail.value.pop();
      pokeDetail.value.push(res);
      console.log(res)
  });
  //console.log(pokemon);

  async function getDetailedPokemon() {
    // 👇️ const data: GetUsersResponse
    const { data, status } = await axios.get<Pokedex>(
      'https://pokeapi.co/api/v2/pokemon/' + route.params.name,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    let poke :Pokedex=  await data;
    return poke;
  
}

 
  //axiosTest().then(response => pokemon);
  
     
  return{
      pokeDetail,
      isReady,
      }
  },
  data(){
      return{
        pokename: "hi",
        
        //poke = new Pokedex();
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
