<template>
  <div class="retailer">
    <v-app-bar app color="#FFFFFF" outlined prominent dark>
       

      <v-img
      max-height="120"
      max-width="200"
      src="../logo.jpg"
    ></v-img>

      <v-spacer></v-spacer>

      <v-menu
       open-on-hover
       top
       offset
      >

      <template v-slot:activator="{ on, attrs }">
        <v-btn icon
         v-bind="attrs"
         v-on="on">

          <v-icon color="teal accent-4" dense class="pr-3 pt-1"> mdi-account-outline </v-icon>

        </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-avatar color="blue-grey darken-1">
            <v-icon dark>
              mdi-account
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
              <v-list-item-title>Sofia Beltran</v-list-item-title>
              <v-list-item-subtitle>Retailer ID#</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list>
        <v-list-item>
          <v-btn
          color="teal accent-4"
           plain
           to="/"
           >
           Logout</v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
      
    </v-app-bar>

    
    <v-container class="py-16 my-15">
      <v-row justify="space-around"
      >
        <v-col
        >
        <v-hover v-slot="{ hover }">
          <v-card 
           :to="'/queryformr'"
           :elevation= " hover ? 12: 6"
           :class="['pa-6', { 'on-hover': hover }]"
           rounded
          >

          <v-card-title style="word-break: break-word">
           Query Drug Information
          </v-card-title>

          <v-card-subtitle>
            .
          </v-card-subtitle>

          <v-card-actions>
            <v-spacer></v-spacer>
              
                <v-icon> mdi-database-search </v-icon> 
             
          </v-card-actions>
        
        </v-card>
        </v-hover>
      </v-col>
      <v-col
        >
        <v-hover v-slot="{ hover }">
          <v-card
           :to="'/buyform'"
           :elevation= " hover ? 12: 6"
           :class="['pa-6', { 'on-hover': hover }]"
           rounded
          >

          <v-card-title style="word-break: break-word">
           Buy Drug Batch
          </v-card-title>

          <v-card-subtitle>
            0 Batches of Drugs
          </v-card-subtitle>

          <v-card-actions>
            <v-spacer></v-spacer>
              
                <v-icon> mdi-package-variant-closed-plus </v-icon> 
              
          </v-card-actions>
        
        </v-card>
        </v-hover>
      </v-col>
      <v-col
        >
        <v-hover v-slot="{ hover }">
          <v-card
           :to="'/pending'"
           :elevation= " hover ? 12: 6"
           :class="['pa-6', { 'on-hover': hover }]"
           rounded
          >

          <v-card-title style="word-break: break-word">
           Drug Batch Orders
          </v-card-title>

          <v-card-subtitle>
            0 Total Orders
          </v-card-subtitle>

          <v-card-actions>
            <v-spacer></v-spacer>
              
                <v-icon> mdi-pill </v-icon> 
              
          </v-card-actions>
        
        </v-card>
        </v-hover>
      </v-col>
      <v-col
        >
        <v-hover v-slot="{ hover }">
          <v-card 
           :to="''"
           :elevation= " hover ? 12: 6"
           :class="['pa-6', { 'on-hover': hover }]"
           rounded
          >

          <v-card-title style="word-break: break-word">
           Recall Requests
          </v-card-title>

          <v-card-subtitle>
            .
          </v-card-subtitle>

          <v-card-actions>
            <v-spacer></v-spacer>
              
                <v-icon> mdi-archive-clock-outline </v-icon> 
              
          </v-card-actions>
        
        </v-card>
        </v-hover>
      </v-col>
       <v-col
        >
        <v-hover v-slot="{ hover }">
          <v-card 
           :to="''"
           :elevation= " hover ? 12: 6"
           :class="['pa-6', { 'on-hover': hover }]"
           rounded
          >

          <v-card-title style="word-break: break-word">
           Delete Drug Batch
          </v-card-title>

          <v-card-subtitle>
            .
          </v-card-subtitle>

          <v-card-actions>
            <v-spacer></v-spacer>
              
                <v-icon> mdi-package-variant-closed-minus </v-icon> 
              
          </v-card-actions>
        
        </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
  
  </div>
</template>


<style scoped>
.v-card:on-hover {
  opacity: 0.6;
 }

</style>
