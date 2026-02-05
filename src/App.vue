<template>
  <v-app>
    <v-main>
      <v-app-bar>
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-app-bar-title> Mensa {{ mensa }} </v-app-bar-title>
        <v-btn @click="toggleLanguage()" :icon="mdiTranslate"></v-btn>
        <v-btn @click="theme.toggle()" :icon="mdiThemeLightDark"></v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" temporary>
        <v-list :items="locations" v-model:selected="location"></v-list>
      </v-navigation-drawer>

      <v-container>
        <div class="d-flex">
          <v-btn
            :icon="mdiChevronLeft"
            size="large"
            @click="increaseDate(-1)"
          />
          <v-date-input
            class="mr-2 ml-2"
            v-model="date"
            prepend-icon=""
            variant="solo-inverted"
            input-format="dd.mm.yyyy"
            :prefix="dayofWeek"
          />
          <v-btn
            :icon="mdiChevronRight"
            size="large"
            @click="increaseDate(1)"
          />
        </div>

        <v-list item-props :items="mealList" lines="two">
          <template #title="{ title }">
            <div v-html="title" style="white-space: normal" />
          </template>

          <template #subtitle="{ subtitle }">
            <div v-html="subtitle" />
          </template>

          <template #append="{ item }">
            <v-btn
              color="grey-lighten-1"
              :icon="mdiInformation"
              variant="text"
              @click="showMealDetails((item as any).meal)"
            ></v-btn>
          </template>
        </v-list>

        <v-alert
          v-if="error"
          title="Error"
          :text="error"
          type="error"
        ></v-alert>
      </v-container>

      <v-dialog
        v-model="dialogShown"
        transition="dialog-bottom-transition"
        fullscreen
        scrollable
      >
        <v-card>
          <v-toolbar>
            <v-btn :icon="mdiClose" @click="dialogMeal = undefined"></v-btn>

            <v-toolbar-title
              >{{ dayofWeek }},
              {{ date.toLocaleDateString(locale) }}</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text class="pa-0 pt-1" v-if="dialogMeal">
            <v-card class="ma-2">
              <v-card-text>
                <p class="text-h6 font-weight-black mb-2">
                  {{ dialogMeal?.name }}
                </p>

                <v-chip
                  class="mr-2 mb-2"
                  color="primary"
                  v-for="feature in dialogMeal?.features"
                >
                  <template v-slot:prepend>
                    <strong class="mr-1">{{
                      feature.abbreviation
                    }}</strong></template
                  >
                  {{ feature.name }}
                </v-chip>
              </v-card-text>
            </v-card>

            <v-card class="ma-2">
              <v-card-text class="pb-1">
                <v-row no-gutters>
                  <v-col cols="4" sm="4">
                    <v-sheet class="ma-2 pa-2 text-center text-primary">
                      <span class="text-h5 font-weight-black">
                        {{ dialogMeal.studentPrice?.toFixed(2) }}€</span
                      ><br />
                      {{ translations.students }}
                    </v-sheet>
                  </v-col>
                  <v-col cols="4" sm="4">
                    <v-sheet class="ma-2 pa-2 text-center">
                      <span class="text-h5 font-weight-black"
                        >{{ dialogMeal.employeePrice?.toFixed(2) }}€</span
                      ><br />
                      {{ translations.employees }}
                    </v-sheet>
                  </v-col>
                  <v-col cols="4" sm="4">
                    <v-sheet class="ma-2 pa-2 text-center">
                      <span class="text-h5 font-weight-black"
                        >{{ dialogMeal.guestPrice?.toFixed(2) }}€</span
                      ><br />
                      {{ translations.guests }}
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card class="ma-2">
              <v-card-title> {{ translations.allergens }} </v-card-title>
              <v-card-text class="pb-1">
                <v-chip
                  class="mr-2 mb-2"
                  color="primary"
                  v-for="allergen in dialogMeal?.allergens"
                >
                  <template v-slot:prepend>
                    <strong class="mr-1">{{
                      allergen.abbreviation
                    }}</strong></template
                  >
                  {{ allergen.name }}
                </v-chip>
              </v-card-text>
            </v-card>

            <v-card class="ma-2">
              <v-card-title> {{ translations.additives }} </v-card-title>
              <v-card-text class="pb-1">
                <v-chip
                  class="mr-2 mb-2"
                  color="primary"
                  v-for="additive in dialogMeal?.additives"
                >
                  <template v-slot:prepend>
                    <strong class="mr-1">{{
                      additive.abbreviation
                    }}</strong></template
                  >
                  {{ additive.name }}
                </v-chip>
              </v-card-text>
            </v-card>

            <v-card class="ma-2">
              <v-card-title> {{ translations.nutritionFacts }} </v-card-title>
              <v-card-text>
                <table>
                  <tbody>
                    <tr>
                      <td class="pr-2">
                        <strong>{{ translations.energy }}</strong>
                      </td>
                      <td>{{ dialogMeal?.nutritionInformation.kj }} kJ</td>
                    </tr>
                    <tr>
                      <td class="pr-2"><strong></strong></td>
                      <td>{{ dialogMeal?.nutritionInformation.kcal }} kcal</td>
                    </tr>
                    <tr>
                      <td class="pr-2">
                        <strong>{{ translations.fat }}</strong>
                      </td>
                      <td>{{ dialogMeal?.nutritionInformation.fat }} g</td>
                    </tr>
                    <tr>
                      <td class="pr-2">
                        <strong>{{ translations.saturatedFats }}</strong>
                      </td>
                      <td>
                        {{ dialogMeal?.nutritionInformation.saturatedFat }} g
                      </td>
                    </tr>
                    <tr>
                      <td class="pr-2">
                        <strong>{{ translations.carbohydrates }}</strong>
                      </td>
                      <td>
                        {{ dialogMeal?.nutritionInformation.carbohydrates }} g
                      </td>
                    </tr>
                    <tr>
                      <td class="pr-2">
                        <strong>{{ translations.sugar }}</strong>
                      </td>
                      <td>{{ dialogMeal?.nutritionInformation.sugar }} g</td>
                    </tr>
                    <tr>
                      <td class="pr-2">
                        <strong>{{ translations.protein }}</strong>
                      </td>
                      <td>{{ dialogMeal?.nutritionInformation.protein }} g</td>
                    </tr>
                    <tr>
                      <td class="pr-2">
                        <strong>{{ translations.salt }}</strong>
                      </td>
                      <td>{{ dialogMeal?.nutritionInformation.salt }} g</td>
                    </tr>
                  </tbody>
                </table>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { Api, type Meal } from "@/api/Api";

import { useTheme } from "vuetify";
import { de, en } from "@/lib/translations";
import type { Configuration } from "@/lib/config";

import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiThemeLightDark,
  mdiInformation,
  mdiClose,
  mdiMoonWaxingCrescent,
  mdiWhiteBalanceSunny,
  mdiTranslate,
} from "@mdi/js";

declare global {
  // Note the capital "W"
  interface Window {
    config: Configuration;
  }
}

const theme = useTheme();

const location = ref<string[]>(["Griebnitzsee"]);
const mensa = computed(() => location.value[0]);
const locations = ref<any[]>([]);
const drawer = ref<boolean>(false);
const config = window.config;

const api = new Api({
  baseUrl: config.apiServer,
});

const locale = navigator.language;
const normalizedLanguage = ref(new Intl.Locale(locale).language);
const translations = computed(() =>
  normalizedLanguage.value == "de" ? de : en,
);

const loadedMeals = ref<Meal[]>([]);
const todaysDate = new Date();
todaysDate.setHours(12);
const date = ref(todaysDate);

const error = ref("");

const dialogMeal = ref<Meal | undefined>(undefined);
const dialogShown = computed(() => !!dialogMeal.value);

enum State {
  LOADING,
  LOADED,
  ERROR,
  EMPTY,
}

const state = ref<State>(State.LOADING);

function toggleLanguage() {
  if (normalizedLanguage.value === "de") {
    normalizedLanguage.value = "en";
  } else {
    normalizedLanguage.value = "de";
  }
}

function increaseDate(inc: number) {
  const newDate = new Date(date.value);
  newDate.setDate(date.value.getDate() + inc);
  date.value = newDate;
}

const dayofWeek = computed(() => {
  return date.value.toLocaleDateString(locale, { weekday: "long" });
});

async function loadMeals(date: Date) {
  try {
    state.value = State.LOADING;
    loadedMeals.value = [];
    if (!mensa.value) return;
    const response = await api.meals.getMeals(mensa.value, {
      date: date.toISOString().split("T")[0],
      lang: normalizedLanguage.value == "de" ? "de" : "en",
    });

    if (response.error) {
      throw Error(response.error);
    }

    loadedMeals.value = response.data
      .filter((meal) => meal.features.length)
      .sort((a, b) => {
        if (!a.isEveningMeal && b.isEveningMeal) return -1;
        if (a.isEveningMeal == b.isEveningMeal) return 0;
        return 1;
      });

    if (loadedMeals.value.length == 0) {
      state.value = State.EMPTY;
      return;
    }

    state.value = State.LOADED;
    error.value = "";
  } catch (e) {
    if (e instanceof Error) {
      state.value = State.ERROR;
      error.value = e.message;
      return;
    }
    error.value = "Failed to load Data: " + JSON.stringify(e);
  }
}

async function loadLocations() {
  const response = await api.locations.getLocations();
  locations.value = response.data.map((location) => {
    return {
      title: location.name,
      value: location.name,
    };
  });
}
loadLocations();
loadMeals(date.value);

const mealList = computed(() => {
  if (!loadedMeals.value.length) {
    if (state.value == State.EMPTY) {
      return [{ type: "subheader", title: translations.value.nomeals }];
    }
    if (state.value == State.LOADING) {
      return [{ type: "subheader", title: translations.value.loading }];
    }
  }

  const list = [];
  for (const meal of loadedMeals.value) {
    const shortAllergenString = meal.allergens
      .map((allergen) => allergen.abbreviation)
      .join(", ");
    const shortFeatureString = meal.features
      .map((feature) => feature.abbreviation)
      .join(", ");
    const shortAdditivesString = meal.additives
      .map((additive) => additive.abbreviation)
      .join(", ");
    const listitem = {
      prependIcon: meal.isEveningMeal
        ? mdiMoonWaxingCrescent
        : mdiWhiteBalanceSunny,
      title: meal.name,
      subtitle: `<strong class="text-primary">${meal.studentPrice.toFixed(
        2,
      )}€</strong> &bull; ${shortFeatureString} &bull; ${shortAllergenString} &bull; ${shortAdditivesString}`,
      meal: meal,
    };
    list.push(listitem);
    list.push({ type: "divider", inset: false });
  }
  list.pop();
  return list;
});

function showMealDetails(meal: Meal) {
  dialogMeal.value = meal;
}

watch(date, async (newDate, oldDate) => {
  if (newDate.toDateString() == oldDate.toDateString()) {
    return;
  }
  newDate.setHours(12);
  await loadMeals(newDate);
});
watch(location, async (newLocation, oldLocation) => {
  date.value.setHours(12);
  await loadMeals(date.value);
});
watch(normalizedLanguage, async (newLanguage, oldLanguage) => {
  date.value.setHours(12);
  await loadMeals(date.value);
});
</script>
