<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-searchbar :debounce="200" color="primary" placeholder="Search drugs.." showCancelButton="focus"
          @ion-change="filterDrugs($event)" :animated="true"></ion-searchbar>
      </ion-toolbar>

    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        <ion-item button :detail="true" v-for="v in danhSachThuoc_filter" :key="v.index" @click="navToCalculate(v.index)">
          <ion-label>
            <h2>{{ v.GENERIC_NAME }}</h2>
            <p>{{ "1 " + v.DOSE_FORM + " contain " + v.AMOUNT + v.AMOUNT_UNIT + '/' + v.SOLVENT + v.SOLVENT_UNIT }}</p>
          </ion-label>
        </ion-item>

      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonLabel, IonItem } from '@ionic/vue';

import mydate from "@/services/thuocServices";

export default defineComponent({
  name: 'DrugsView',
  inject: ['axios'],
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSearchbar, IonList, IonLabel, IonItem },
  async mounted() {
    await mydate.start()
    this.danhSachThuoc_filter = mydate.finalDanhSachThuoc
  },
  data() {
    return {
      danhSachThuoc_filter: mydate.finalDanhSachThuoc,
    }
  },
  methods: {
    navToCalculate(ind) {
      this.$router.push(
        {
          name: 'drugsCalculateDose',
          params: {id: ind}
        })
    },
    filterDrugs(event) {
      let searchFilter = event.target.value.toLowerCase()
      if (searchFilter.length >= 1) {
        this.danhSachThuoc_filter = mydate.finalDanhSachThuoc.filter(
          (drug) => drug.GENERIC_NAME.toLowerCase().indexOf(searchFilter) > -1
        )
      }
      else {
        this.danhSachThuoc_filter = mydate.finalDanhSachThuoc
      }
    }
  }

});
</script>
