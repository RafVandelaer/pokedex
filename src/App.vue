<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">       
        <ion-content class="ios content-ltr hydrated">
          <ion-list id="inbox-list">
        
            <ion-list-header>Pokedex</ion-list-header>
            
            <ion-searchbar animated="true" placeholder="Pokémon zoeken"></ion-searchbar>


            <ion-menu-toggle auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item @click="selectedIndex = i" router-direction="root" :router-link="p.url" lines="none" detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
                <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
  
          <ion-list inset mode="ios">
          <ion-item v-on:click="getPokemon(pok.id)" v-for="pok in items" :key="pok.id">
            <ion-thumbnail slot="start">
              <img :alt="pok.name" :src="pok.sprites.front_default" />
            </ion-thumbnail>
            <ion-label>
              <h1 class=" caps sc-ion-label-ios-h sc-ion-label-ios-s ios"><strong>{{ pok.name }}</strong></h1>
              <p>nr. {{ pok.id }}</p>
              </ion-label>
              <template v-for="(type , index) in pok.types" :key="index">
                <ion-badge class="noMargin" slot="end">{{type.type.name}}</ion-badge>
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
import { IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonRouterOutlet, IonSplitPane, IonSearchbar, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { archiveOutline, archiveSharp, bookmarkOutline, bookmarkSharp, funnelOutline, funnelSharp, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import {basicPokemon } from './ts/basicPokemon';
import {Pokedex } from './ts/detailedPokemon';

import axios from 'axios';

export default defineComponent({
  name: 'App',
  components: {
    IonSearchbar,

    IonApp, 
    IonContent, 
    IonIcon, 
    IonItem, 
    IonLabel, 
    IonList, 

    IonListHeader, 
    IonMenu, 
    IonMenuToggle,  
    IonRouterOutlet, 
    IonSplitPane,
  },
  setup() {

    //infinit scroll
    const isDisabled = ref(false);
    const toggleInfiniteScroll = () => {
      isDisabled.value = !isDisabled.value;
    }

    const items = ref<basicPokemon[]>([]);
    
    async function getAllPokemon()
    {
          //let response = await axios.get<basicPokemon[]>('https://stoplight.io/mocks/appwise-be/pokemon/57519009/pokemon');
              try {
                let response = await axios({
                  url: 'https://stoplight.io/mocks/appwise-be/pokemon/57519009/pokemon',
                  method: 'get',
                  timeout: 8000,
                  headers: {
                      'Content-Type': 'application/json',
                  }})
                let data = await response
            return data;
            } catch(error ){
               console.log(error)
          }

          
        }
    getAllPokemon()
          //.then(data => console.log(data.data[0]));
          //.then(data => items.value.push(data.data[0]));
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
        console.log('Loaded data');
        ev.target.complete();
  
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (items.value.length === 1000) {
          ev.target.disabled = true;
        }
      }, 500);
    }
    
    //pushData();
    

    const selectedIndex = ref(0);
    const appPages = [
      {
        title: 'Inbox',
        url: '/folder/Inbox',
        iosIcon: mailOutline,
        mdIcon: mailSharp
      },
      {
        title: 'Outbox',
        url: '/folder/Outbox',
        iosIcon: paperPlaneOutline,
        mdIcon: paperPlaneSharp
      },
      {
        title: 'Favorites',
        url: '/folder/Favorites',
        iosIcon: heartOutline,
        mdIcon: heartSharp
      },
      {
        title: 'Archived',
        url: '/folder/Archived',
        iosIcon: archiveOutline,
        mdIcon: archiveSharp
      },
      {
        title: 'Trash',
        url: '/folder/Trash',
        iosIcon: trashOutline,
        mdIcon: trashSharp
      },
      {
        title: 'Spam',
        url: '/folder/Spam',
        iosIcon: warningOutline,
        mdIcon: warningSharp
      }
    ];
    const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
    
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      selectedIndex.value = appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    
    const route = useRoute();
   


    
    return { 
      selectedIndex,
      appPages, 
      labels,
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
      items,
      isSelected: (url: string) => url === route.path ? 'selected' : ''
    }
  },
  methods: {
    getPokemon(id: number){
      this.retreivePokemon(id).then(res => console.log(res))
    },

    async retreivePokemon(id: number) {
          try {
            let res = await axios({
            url: 'https://pokeapi.co/api/v2/pokemon/' + id,
            method: 'get',
            timeout: 8000,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if(res.status == 200){
            // test for status you want, etc
            //console.log(res.status)
        }      
        
        return res.data
    }
    catch (err) {
        console.error(err);
    }
          
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
