<template>
  <div class="home">
    
    <v-app-bar app color="#FFFFFF" outlined prominent dark>
       

    <v-img
      max-height="120"
      max-width="200"
      src="../logo.jpg"
    ></v-img>
      
    </v-app-bar>

    <v-row class="pa-6">
      <v-col order="last">

<center>
        <v-card
        elevation="15"
          class="pa-6"
          outlined
          rounded
          max-width="500"
          height="450"
        >
        
          <v-tabs
          fixed-tabs
          color="blue-grey darken-2"
          v-model="tab"

        >
          <v-tabs-slider color="teal accent-4"></v-tabs-slider>

          <v-tab
            v-for="list in lists"
            :key="list"
          >
            {{ list }}
          </v-tab>

        <v-tab-item>
         
         <v-form class="pt-4">
    <v-container>
      <v-row class="pt-10">
        <v-col
          cols="12"
          sm="12"
          class="pb-1 mb-1"
        >

      <v-text-field
            v-model="email"
            label="Email"
            outlined
            shaped
          ></v-text-field>

        </v-col>

      <v-col
          cols="12"
          sm="12"
          class="pb-1 mb-1"
        >

      <v-text-field
            outlined
            shaped
            :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show3 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            hint="At least 8 characters"
            counter
            @click:append="show3 = !show3"
          ></v-text-field>

        </v-col>

        <v-col
    align="center"
    justify="space-around"
  >
        <v-btn
        color="teal darken-2"
        plain
        class="pb-4"
      >
        LOGIN
      </v-btn>
       </v-col>

      </v-row>
    </v-container>
         </v-form>

      </v-tab-item>

      <v-tab-item>
         <v-form class="pt-4">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          class="pb-1 mb-1"
        >
          <v-text-field
            v-model="first"
            label="First Name"
            outlined
            shaped
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="last"
            label="Last Name"
            outlined
            filled
            shaped
          ></v-text-field>
        </v-col>
     
         <v-col cols="12" sm="12" class="pb-1 mb-1">
      <v-text-field
            v-model="email"
            label="Email"
            outlined
            shaped
          ></v-text-field>
         </v-col>
         

      <v-col cols="12" sm="6" class="pb-1 mb-1">
         <v-text-field
            outlined
            shaped
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
         <v-autocomplete
            v-model="value"
            :items="items"
            outlined
            shaped
            label="Account Type"
          ></v-autocomplete>
        </v-col>


       <v-row
    align="center"
    justify="space-around"
  >
        <v-btn
        color="teal darken-2"
        plain
        class="pb-4"
      >
        SIGN UP
      </v-btn>
       </v-row>
      </v-row>
    </v-container>
  </v-form>
      </v-tab-item>

        </v-tabs>

        

        </v-card>
</center>
      </v-col>

      <v-col order="first">
        <v-card
    elevation="10"
    max-width="630"
    class="mx-auto"
    height="450"
  >
    <v-carousel
      :continuous="true"
      cycle
      :show-arrows="false"
      hide-delimiter-background
      delimiter-icon="mdi-minus"
      height="300"
    >
      <v-carousel-item
         v-for="(pic,i) in pics"
      :key="i"
      :src="pic.src"
      >
        
      </v-carousel-item>
    </v-carousel>
    
          <center>
          <h2 class="pt-3">Why Drug Trace?</h2>
          <p class="pt-2 px-1">Lorem ipsum dolor sit amet. Est distinctio voluptas quo quia aliquid qui unde laborum et explicabo voluptas quo enim veniam ea quasi dolores est quia molestiae. Ea dolorem voluptas qui nesciunt repellendus et omnis fugiat vel alias voluptatem.</p>
          </center>
        
  </v-card>
      </v-col>
    </v-row>

    
  
  </div>
</template>

<script>
  export default {
    data () {
      return {
        pics: [
          {
            src: 'https://cdn.pixabay.com/photo/2016/11/23/15/03/medications-1853400_960_720.jpg',
          },
          {
            src: 'https://cdn.pixabay.com/photo/2017/10/14/11/30/blockchain-2850276_960_720.jpg',
          },
          {
            src: 'https://media.istockphoto.com/photos/science-technology-concept-laboratory-examination-research-picture-id1180547358?k=20&m=1180547358&s=612x612&w=0&h=PeAmfbc6gLae6mbiR_PYhWefHitNIQ6srvsSXSiJAhM=',
          },
          {
            src: 'https://media.istockphoto.com/photos/portrait-of-a-handsome-pharmacist-working-in-a-pharmacy-picture-id1355434702?k=20&m=1355434702&s=612x612&w=0&h=UUrMqh-AvG1S6hhqcsSmrZi0pFqvSxdqF4Cht-BXqEY=',
          },
        ],
        items: ['Distributor', 'Retailer'],
        values: ['distributor', 'retailer'],
        value: null,
        cycle: false,
        tab: null,
        lists: [
          'LOGIN', 'SIGN UP',
        ],
       show1: false,
       show2: false,
       show3: false,
        message1: 'Hey!',
        message2: 'Hey!',
        message3: 'Hey!',
        message4: 'Hey!',
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          passwordMatch: () => (`The password you entered don't match`),
        },
      }
    },
  }
</script>


