<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ currentDrug.GENERIC_NAME }}</ion-title>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Patient informations</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-item>
                  <ion-label position="stacked">Weight (kg)</ion-label>
                  <ion-input placeholder="Weight" v-model="weight" @ion-change="calculateDrug('weight')"></ion-input>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ currentDrug.GENERIC_NAME }}</ion-card-title>
          <ion-card-subtitle>
            {{ `1 ${currentDrug.DOSE_FORM} contain
                        ${currentDrug.AMOUNT}${currentDrug.AMOUNT_UNIT}/${currentDrug.SOLVENT}${currentDrug.SOLVENT_UNIT}; Dose
                        range: ${currentDrug.MIN_DOSE}-${currentDrug.MAX_DOSE} ${currentDrug.DOSE_UNIT}/${currentDrug.PER_TIME}`
            }}
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <h2>
            What do you wanna calculate?
          </h2>
          <ion-segment v-model="toCalWhat" mode="ios" @ion-change="changeToCalWhat()">
            <ion-segment-button value="toCalInfusionRate">
              <ion-label>Infusion Rate?</ion-label>
            </ion-segment-button>
            <ion-segment-button value="toCalDose" v-show="toCalWhatCanCalDose">
              <ion-label>Dose?</ion-label>
            </ion-segment-button>
            <ion-segment-button value="toCalMgInAmpules">
              <ion-label>mg in Ampules?</ion-label>
            </ion-segment-button>
          </ion-segment>

          <ion-grid>
            <!-- <ion-row>
              <ion-col>
                <h2>
                  Fill the form:
                </h2>
              </ion-col>
            </ion-row> -->
            <ion-row>
              <ion-col>
                <!-- <ion-toggle></ion-toggle> -->
                <ion-item>
                  <ion-label position="stacked">Dose ({{ (currentDrug.DOSE_UNIT + "/" + currentDrug.PER_TIME)
                  }})</ion-label>
                  <ion-input placeholder="Dose" type="number" v-model="calDose" @ion-change="calculateDrug('calDose')"
                    :disabled="toCalWhat == 'toCalDose'"></ion-input>
                </ion-item>
              </ion-col>
              <ion-col>
                <ion-item>
                  <ion-label position="stacked">Ampules {{ currentDrug.AMOUNT + currentDrug.AMOUNT_UNIT + '/' +
                      currentDrug.SOLVENT + currentDrug.SOLVENT_UNIT
                  }}
                  </ion-label>
                  <ion-input placeholder="Ampules" type="number" v-model="calAmpule"
                    @ion-change="calculateDrug('calAmpule')" :disabled="toCalWhat == 'toCalMgInAmpules'"></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="1">
                <!-- <ion-button> <ion-icon slot="start" :icon="calculatorOutline"></ion-icon></ion-button> -->
              </ion-col>
              <ion-col>
                <ion-item>
                  <ion-label position="stacked">Dilution (mililiters)</ion-label>
                  <ion-input placeholder="Dilution in mililiters" v-model="calDilution"
                    @ion-change="calculateDrug('calDilution')" type="number"></ion-input>
                </ion-item>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                <ion-item>
                  <ion-label position="stacked">Infusion Rate (mL/h)</ion-label>
                  <ion-input placeholder="Infusion Rate" v-model="calInfusionRate"
                    @ion-change="calculateDrug('infusionRate')"
                    :disabled="toCalWhat == 'toCalInfusionRate' || toCalWhat == 'toCalMgInAmpules'"
                    type="number"></ion-input>
                </ion-item>
              </ion-col>
              <ion-col v-show="calDuration > 0">
                <ion-item>
                  <ion-label position="stacked">Duration (hour)</ion-label>
                  <ion-input placeholder="Duration" v-model="calDuration" @ion-change="calculateDrug('calDuration')"
                    type="number"></ion-input>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-grid>
            <ion-row>
              <ion-col>
                <span v-html="information"></span>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { calculatorOutline } from "ionicons/icons";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonCol, IonGrid, IonRow,
  IonInput, IonItem, IonLabel,
  // IonButton,IonIcon,
  // IonToggle,
  IonSegment, IonSegmentButton
} from '@ionic/vue';
import mydate from "@/services/thuocServices";

import nerdamer from "nerdamer/all";
import DrugCalculationUltils from "@/services/DrugCalculationUltils";
import { tsImportEqualsDeclaration } from '@babel/types';
export default defineComponent({
  name: 'drugsCalculateDose',
  components: {
    IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonBackButton,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonCol, IonGrid, IonRow,
    IonInput, IonItem, IonLabel,
    // IonButton, IonIcon,
    // IonToggle,
    IonSegment, IonSegmentButton
  },
  data() {
    return {
      currentDrug: mydate.finalDanhSachThuoc[Number(this.$route.params.id)],
      calAmpule: 1,
      calDilution: 25,
      calDose: 0,
      calInfusionRate: 0,
      calDuration: 0,
      weight: 50,
      toCalWhat: "toCalInfusionRate",
      toCalWhatCanCalDose: true,
      unitConverted: {
        dose: 0,
        concentration: 0
      },
      information: ''
    }
  },
  methods: {
    convertCorrectedUnitDose() {
      // DOSE mcg/kg
      let correctedDose = this.calDose
      if (this.currentDrug.DOSE_UNIT == "mg/kg") {
        correctedDose = correctedDose * 1000 // -> mcg/kg
      } else if (this.currentDrug.DOSE_UNIT == "gram/kg") {
        correctedDose = correctedDose * 1000000 // -> mcg/kg
      }
      // Dose (-> mcg/kg    /min), chuyển trên Giờ thành trên Phút
      if (this.currentDrug.PER_TIME == "hour") {
        correctedDose = correctedDose / 60
      }
      // console.log("correctedDose: " + correctedDose)
      this.unitConverted.dose = correctedDose
    },
    convertCorrectedUnitConcentration() {
      // Nồng độ = -> mcg/mL
      let correctedConcentrat = this.currentDrug.AMOUNT * this.calAmpule / this.calDilution
      if (this.currentDrug.AMOUNT_UNIT == "mg") {
        correctedConcentrat = correctedConcentrat * 1000
      } else if (this.currentDrug.AMOUNT_UNIT == "gram") {
        correctedConcentrat = correctedConcentrat * 1000000
      }
      // console.info("convertCorrectedUnitConcentration ", correctedConcentrat)
      this.unitConverted.concentration = correctedConcentrat
    },
    convertToShowDose(calculatedDose) {
      let correctedDose = calculatedDose
      if (this.currentDrug.DOSE_UNIT == "mg/kg") {
        correctedDose = correctedDose / 1000 // -> mcg/kg
      } else if (this.currentDrug.DOSE_UNIT == "gram/kg") {
        correctedDose = correctedDose / 1000000 // -> mcg/kg
      }
      if (this.currentDrug.PER_TIME == "hour") {
        correctedDose = correctedDose * 60
      }
      this.calDose = correctedDose
    },
    changeToCalWhat() {
      this.information = ''
      if (this.toCalWhat != "toCalMgInAmpules") {
        this.calDuration = 0
      }
      if (this.currentDrug.PER_TIME == "single" || this.currentDrug.PER_TIME == "dose") {
        this.calDuration = 1
      }

      this.calculateDrug('')

    },
    calculateDrug(whoChanged) {
      if (this.toCalWhat == "toCalInfusionRate") {
        if (whoChanged == "infusionRate") {
          return false;
        }
        /* Nếu không phải infusionRate thì tính infusionRate */
        // if (this.currentDrug.PER_TIME == "min" || this.currentDrug.PER_TIME == "hour") {
        //   /*
        //     Infusion rate (mL/h) = Dose (mcg/kg/min) * Weight (kg) / Concentration (mcg/mL) * 60
        //     r = d * w / c * 60
        //   */


        // }

        this.convertCorrectedUnitDose()
        this.convertCorrectedUnitConcentration()
        if (this.currentDrug.PER_TIME == "min" || this.currentDrug.PER_TIME == "hour") {
          this.calInfusionRate = nerdamer("r = d * w / c * 60", { d: this.unitConverted.dose, w: this.weight, c: this.unitConverted.concentration }).solveFor("r").toDecimal()

          this.information = `Dilute <b>${this.calAmpule} ${this.currentDrug.DOSE_FORM}</b> of <b>${this.currentDrug.GENERIC_NAME}</b> up to <b>${this.calDilution} mL</b> of dilution.<br/>
          Final concentration: ${this.unitConverted.concentration} mcg/mL.<br/>
          Infusion rate is: <b>${this.calInfusionRate} mL/hour</b> <br/>
          Dose is: <b>${this.calDose} ${this.currentDrug.DOSE_UNIT}/${this.currentDrug.PER_TIME}</b> <br/>
          Estimation time is: ${this.calDilution / this.calInfusionRate} hours.<br/>
          `
        } else if (this.currentDrug.PER_TIME == "single" || this.currentDrug.PER_TIME == "dose") {
          this.calInfusionRate = this.calDilution / this.calDuration

        }
      }
      else if (this.toCalWhat == "toCalDose") {
        /* Nếu  infusionRate thì tính infusionRate: calDose hoặc số mg ml trong ampulse
        1. Hiện cái lock khóa cho 2 cái calDose và calAmpulse
        2. Khóa thằng nào thì tính thằng còn lại
        */
        // Dose (-> mcg/kg    /min)
        this.convertCorrectedUnitConcentration()
        let cal = nerdamer("r = d * w / c * 60", { r: this.calInfusionRate, w: this.weight, c: this.unitConverted.concentration }).solveFor("d")
        this.convertToShowDose(nerdamer(cal.toString()).toDecimal())
        // console.log(nerdamer("r = d * w / c * 60", { r: this.calInfusionRate, w: this.weight, c: this.unitConverted.concentration }).solveFor("d").toString())

        this.information = `Dilute <b>${this.calAmpule} ${this.currentDrug.DOSE_FORM}</b> of <b>${this.currentDrug.GENERIC_NAME}</b> up to <b>${this.calDilution} mL</b> of dilution.<br/>
          Final concentration: ${this.unitConverted.concentration} mcg/mL.<br/>
          Infusion rate is: <b>${this.calInfusionRate} mL/hour</b> <br/>
          Dose is: <b>${this.calDose} ${this.currentDrug.DOSE_UNIT}/${this.currentDrug.PER_TIME}</b> <br/>
          Estimation time is: ${this.calDilution / this.calInfusionRate} hours.<br/>`
      }
      else if (this.toCalWhat == "toCalMgInAmpules") {
        /* Nếu  infusionRate thì tính infusionRate: calDose hoặc số mg ml trong ampulse
        1. Tính số mg trong ống theo liều định trước (dose, single)
        */
        this.calDuration = 25

        this.convertCorrectedUnitConcentration()
        let cal = nerdamer("r = d * w / c * 60", { r: this.calInfusionRate, w: this.weight, c: this.unitConverted.concentration }).solveFor("d")
        this.convertToShowDose(nerdamer(cal.toString()).toDecimal())
        // console.log(nerdamer("r = d * w / c * 60", { r: this.calInfusionRate, w: this.weight, c: this.unitConverted.concentration }).solveFor("d").toString())

        this.information = `Dilute <b>${this.calAmpule} ${this.currentDrug.DOSE_FORM}</b> of <b>${this.currentDrug.GENERIC_NAME}</b> up to <b>${this.calDilution} mL</b> of dilution.<br/>
          Final concentration: ${this.unitConverted.concentration} mcg/mL.<br/>
          Infusion rate is: <b>${this.calInfusionRate} mL/hour</b> <br/>
          Dose is: <b>${this.calDose} ${this.currentDrug.DOSE_UNIT}/${this.currentDrug.PER_TIME}</b> <br/>
          Estimation time is: ${this.calDilution / this.calInfusionRate} hours.<br/>`
      }
    }
  },
  created() {
    try {
      this.calDose = this.currentDrug.MIN_DOSE
      if (this.currentDrug.PER_TIME == "single" || this.currentDrug.PER_TIME == "dose") {
        this.toCalWhatCanCalDose = false
      } else {
        this.toCalWhatCanCalDose = true
      }
      this.calculateDrug("")
    } catch (error) {
      this.$router.push({
        name: "drugs"
      })
    }
  },
  setup() {
    return { calculatorOutline }
  },
});
</script>
<style>
ion-item.item-interactive-disabled {
  --background: #ffe7dd;
  --color: rgb(0, 0, 0);
  --border-color: #848484;
  --border-style: dashed;
  --border-width: 2px;
  font-size: larger;
}
</style>
<!-- 
  r ml/h -> infusion rate
  d mcg/kg | mg/kg /h|/min -> Dose    DOSE_UNIT/PER_TIME queque FREQ
  w kg -> weight
  c mcg/ml | mg/ml-> concentration AMOUNT_UNIT	AMOUNT
 
  1. concentration = AMOUNT -> mcg -> mcg/mL
  if mg/ml 
    DrugCalculationUltils.convert.mgPerMlToMcgPerMl
  if PER_TIME là hour -> min; if min thì thôi
  đưa về chuẩn

  Infusion rate (mL/h) = Dose (mcg/kg/min) * Weight (kg) / Concentration (mcg/mL) / 60
  r = d * w / c / 60
  nerdamer("r = d * w / c / 60", {d: 2, w: 3, c: 5}).solveFor("r").toDecimal()

 -->
