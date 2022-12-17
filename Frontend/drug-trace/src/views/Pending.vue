<template>
  <div class="pending">
   <v-app-bar app color="#FFFFFF" outlined prominent dark>
       

      <v-img
      max-height="120"
      max-width="200"
      src="../logo.jpg"
    ></v-img>

      <v-spacer></v-spacer>

      <v-btn
        class="ma-2"
        color="teal darken-2"
        plain
        to="/distributor"
      >
        <v-icon
          dark
          left
        >
          mdi-chevron-left
        </v-icon>Go Back
      </v-btn>

      <v-menu
       open-on-hover
       top
       offset
      >

      <template v-slot:activator="{ on, attrs }">
        <v-btn icon
         v-bind="attrs"
         v-on="on">

          <v-icon color="teal light-2" dense class="pr-3 pt-1"> mdi-account-outline </v-icon>

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
              <v-list-item-subtitle>Distributor ID#</v-list-item-subtitle>
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


     <v-simple-table height="500px" class="pa-3" :footer-props="{
      showFirstLastPage: true,
      firstIcon: 'mdi-arrow-collapse-left',
      lastIcon: 'mdi-arrow-collapse-right',
      prevIcon: 'mdi-minus',
      nextIcon: 'mdi-plus'
    }">
    
    <template v-slot:default>
      
      <thead>

        
       
        <tr>
          <th class="text-center">
            Retailer
          </th>
          <th class="text-center">
            Drug Name
          </th>
          <th class="text-center">
            Drug Description
          </th>
          <th class="text-center">
            Quantity
          </th>
           <th class="text-center">
            Purchase Date
          </th>
           <th class="text-center">
            Purchase Time
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in orders"
          :key="item.retailer"
        >
          <td class="text-center">{{ item.retailer }}</td>
          <td class="text-center">{{ item.drug }}</td>
          <td class="text-center">{{ item.description }}</td>
          <td class="text-center">{{ item.quantity }}</td>
          <td class="text-center">{{ item.date }}</td>
          <td class="text-center">{{ item.time }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
    
  
  </div>
</template>

<script>
  export default {
    data () {
      return {
        orders: [
          {
            retailer: 'Watsons Pharmacy',
            drug: 'Gaviscon',
            description: '500 mg',
            quantity: 12345,
            date: '07/28/22',
            time: '7:00AM'
          },
          {
            retailer: 'Mercury Drug',
            drug: 'Biogesic',
            description: '1000 mg',
            quantity: 500,
            date: '07/15/22',
            time: '8:00AM'
          },
        ],
      }
    },
  }
</script>