<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">       
        <ion-content class="ios content-ltr hydrated">
          <ion-list id="inbox-list">
        
            <ion-list-header>Pokedex</ion-list-header>
            <form >
               <ion-searchbar animated="true"  ref="searchbar" type="text" v-debounce:1000ms="searchbarPokemon" @keyup.enter.prevent @keydown.enter.prevent placeholder="Pokémon zoeken" ></ion-searchbar>
            </form>
          </ion-list>
          <ion-row>
            <ion-col>
              <ion-card color="tertiary" @click="updatePokemonList('all')">
                <ion-card-header>
                  <ion-card-title>All</ion-card-title>
                  <ion-card-subtitle>150 Pokemon</ion-card-subtitle>
                </ion-card-header>         
              </ion-card>
            </ion-col>
            <ion-col> 
              <ion-card @click="updatePokemonList('favorites')" color="success">
                <ion-card-header>
                  <ion-card-title>Favorieten</ion-card-title>
                  <ion-card-subtitle>{{aantalFavo}} Pokemon</ion-card-subtitle>
                </ion-card-header>         
              </ion-card>
            </ion-col>
        </ion-row>
         
  
          <ion-list inset mode="ios">
            <!--v-on:click="getPokemon(pok.id)"-->
          <ion-item  :router-link="pok.name" v-for="pok in items" :key="pok.id">
            <ion-thumbnail slot="start">
              <img :alt="pok.name" :src="pok.sprites.front_default" />
            </ion-thumbnail>
            <ion-label>
              <h1 class=" caps sc-ion-label-ios-h sc-ion-label-ios-s ios"><strong>{{ pok.name }}</strong></h1>
              <p>nr. {{ pok.id }}</p>
              </ion-label>
              <template v-for="(type , index) in pok.types" :key="index">
                <ion-badge :class="type.type.name" class="noMargin" slot="end">{{type.type.name}}</ion-badge>
              </template>
              
          </ion-item>

        </ion-list>
          
            <ion-infinite-scroll
              @ionInfinite="loadData($event)" 
              threshold="100px" 
              id="infinite-scroll"
              :disabled="isDisabled"
            >
              <ion-infinite-scroll-content
                loading-spinner="bubbles"
                loading-text="Loading more data...">
              </ion-infinite-scroll-content>
            </ion-infinite-scroll>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonContent, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonRouterOutlet, IonSplitPane, IonSearchbar,  InfiniteScrollCustomEvent } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { archiveOutline, archiveSharp, bookmarkOutline, bookmarkSharp,  heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import {basicPokemon } from './ts/basicPokemon';
//import {Pokedex } from './ts/detailedPokemon';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { heart } from 'ionicons/icons';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { vue3Debounce } from 'vue-debounce'
import { useCookie } from 'vue-cookie-next'
import axios from 'axios';

export default defineComponent({
  name: 'App',
  components: {
    IonSearchbar,
    IonApp, 
    IonContent,  
    IonItem, 
    IonLabel, 
    IonList, 
    IonListHeader, 
    IonMenu, 
    IonRouterOutlet, 
    IonSplitPane,
  },

  directives: {
    debounce: vue3Debounce({ lock: true })
  },
  setup() {
    const cookie = useCookie();
    const selectedIndex = ref(0);
    var favos, aantalFavo
    if(cookie.isCookieAvailable('favos')){
      favos = cookie.getCookie('favos').split(",");
       aantalFavo = favos.length;
    } 
    // if no favos
    else{
     favos = [];
     aantalFavo = favos.length;
    }
    const route = useRoute();

    //infinit scroll
    const isDisabled = ref(false);
    const toggleInfiniteScroll = () => {
      isDisabled.value = !isDisabled.value;
    }
    
    

    //alert(favos.length)

    const items = ref<basicPokemon[]>([]);
  
    
    async function getAllPokemon()
    {
          //let response = await axios.get<basicPokemon[]>('https://stoplight.io/mocks/appwise-be/pokemon/57519009/pokemon');
              
                let response = await axios({
                  url: 'https://stoplight.io/mocks/appwise-be/pokemon/57519009/pokemon',
                  method: 'get',
                  timeout: 8000,
                  })
                let data = await response
            return data;
            

          
        }
    getAllPokemon()
          .then(data => data.data.forEach(function(pok: basicPokemon){
            try{
            items.value.push(pok);
          
            }
            catch(err){
              //todo error handling
                  console.log(err)
            }
          }));
    
  
 

   

    //TODO  infinite scroll
    const loadData = (ev: InfiniteScrollCustomEvent) => {
      setTimeout(() => {
        //Todo
        //pushData();
        
        ev.target.complete();
  
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (items.value.length === 1000) {
          ev.target.disabled = true;
        }
      }, 500);
    }

 
   


    
    return { 
      selectedIndex,
      archiveOutline, 
      archiveSharp, 
      bookmarkOutline, 
      bookmarkSharp, 
      heartOutline, 
      heartSharp, 
      mailOutline, 
      mailSharp, 
      paperPlaneOutline, 
      paperPlaneSharp, 
      trashOutline, 
      trashSharp, 
      warningOutline, 
      warningSharp,
      isDisabled,
      toggleInfiniteScroll,
      loadData,
      aantalFavo,
      items,
      heart,
      isSelected: (url: string) => url === route.path ? 'selected' : ''
    }
  },

  
 methods: {

  updatePokemonList(whichList : string){
    let favos :number[]= this.$cookie.getCookie('favos').split(",");
      let list = ref<basicPokemon[]>(this.items)
      //Empty array
        while (list.value.length) { 
          list.value.pop();
        }
              
               axios({
                  url: 'https://stoplight.io/mocks/appwise-be/pokemon/57519009/pokemon',
                  method: 'get',
                  timeout: 8000,
                 })
                  .then(data => data.data.forEach(function(pok: basicPokemon){
                      try{
                        //check if list is favorites
                        if(whichList === "favorites"){
                          favos.forEach(number  => {
                                if(number == pok.id){
                                  list.value.push(pok);
                                }
                              } 
                          )}
                          //if list is all, fill all pokémon
                          else if (whichList === 'all'){
                              list.value.push(pok);                        
                            }
                      }
                      catch(err){
                        //todo error handling
                        alert("Oeps, er ging iets fout...")
                            console.log(err)
                      }
                    }))

        
  },

  
  searchbarPokemon(val: any, e:any){
    this.$router.push(e.target.value);
  },
 

  setPokemon(){
    console.log(".")
  
  },
    
  }

})

</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
