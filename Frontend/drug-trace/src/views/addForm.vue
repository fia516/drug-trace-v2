<template>
  <div class="addForm">
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


    <v-row justify="center" class="pa-6">
    <v-col
      cols="12"
      sm="10"
    >
      <v-card ref="form" class="pa-6">
        <v-card-text>
          <h2>
          Please fill up the form.</h2>
          <v-text-field
            ref="manufacturer"
            v-model="manufacturer"
            :rules="[() => !!manufacturer || 'This field is required']"
            label="Manufacturer Name"
            required
          ></v-text-field>
          <v-text-field
            ref="address"
            v-model="address"
            :rules="[
              () => !!address || 'This field is required',
              () => !!address && address.length <= 25 || 'Address must be less than 25 characters',
              addressCheck
            ]"
            label=" Manufacturer Address Line"
            placeholder="Unit No., Building, Street Name"
            counter="25"
            required
          ></v-text-field>
          <v-row>
             <v-col
         cols="12"
          sm="6"
          md="4"
      >
          <v-text-field
            ref="city"
            v-model="city"
            :rules="[() => !!city || 'This field is required', addressCheck]"
            label="City"
            required
          ></v-text-field>
             </v-col>
              <v-col
         cols="12"
          sm="6"
          md="4"
      >
          <v-text-field
            ref="province"
            v-model="province"
            :rules="[() => !!province || 'This field is required']"
            label="Province/Region"
            required
          ></v-text-field>
             </v-col>
              <v-col
         cols="12"
          sm="6"
          md="4"
      >
          <v-text-field
            ref="zip"
            type="number"
            v-model="zip"
            :rules="[() => !!zip || 'This field is required']"
            label="ZIP / Postal Code"
            required
          ></v-text-field>
              </v-col>
          </v-row>
          
          <v-row>
           <v-col
         cols="12"
          sm="6"
      >

          <v-text-field
            ref="distributor"
            v-model="distributor"
            :rules="[() => !!distributor || 'This field is required']"
            label="Distributor Name"
            required
          ></v-text-field>
           </v-col>
         

           <v-col
         cols="12"
          sm="6"
      >
          <v-text-field
            ref="drug"
            v-model="drug"
            :rules="[() => !!drug || 'This field is required']"
            label="Drug Name"
            required
          ></v-text-field>
           </v-col>
          </v-row>
          

          <v-textarea
          ref="description"
          v-model="description"
          :rules="[() => !!description || 'This field is required']"
          label="Drug Description"
          hint="Enter drug description."
        ></v-textarea>
        <v-row>
           <v-col
         cols="12"
          sm="6"
      >
        <v-text-field
            ref="quantity"
            type="number"
            v-model="quantity"
            :rules="[() => !!quantity || 'This field is required']"
            label="Quantity"
            required
          ></v-text-field>
           </v-col>
            <v-col
         cols="12"
          sm="6"
      >
          <v-text-field
            ref="batchno"
            type="number"
            v-model="batchno"
            :rules="[() => !!batchno || 'This field is required']"
            label="Batch Number"
            required
          ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
          <v-col
         cols="12"
          sm="6"
      >
      <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFormatted"
              ref="date"
              label="Expiry Date"
              :rules="[() => !!date || 'This field is required']"
              persistent-hint
              v-bind="attrs"
              @blur="date = parseDate(dateFormatted)"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            @input="menu1 = false"
          ></v-date-picker>
        </v-menu>
          </v-col>
          <v-col
         cols="12"
          sm="6"
      >
      <v-text-field
            ref="price"
            type="number"
            v-model="price"
            :rules="[() => !!price || 'This field is required']"
            label="Unit Price"
            prefix="₱"
            required
          ></v-text-field>
            </v-col>
        </v-row>

        </v-card-text>
        <v-divider class="mt-12"></v-divider>
        <v-card-actions>
          <v-btn text  @click="resetForm">
            Clear
          </v-btn>
          <v-spacer></v-spacer>
          <v-slide-x-reverse-transition>
            <v-tooltip
              v-if="formHasErrors"
              left
            >
              
            </v-tooltip>
          </v-slide-x-reverse-transition>
          <v-btn
            color="teal darken-2"
            text
            @click="submit"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
    
  
  </div>
</template>

<script>
  export default {
    data: vm => ({
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
      menu1: false,
      errorMessages: '',
      manufacturer: null,
      address: null,
      city: null,
      province: null,
      zip: null,
      distributor: null,
      description: null,
      quantity: null,
      batchno: null,
      date: null,
      price: null,
      formHasErrors: false,
    }),

    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
      form () {
        return {
          manufacturer: this.manufacturer,
          address: this.address,
          city: this.city,
          province: this.province,
          zip: this.zip,
          distributor: this.distributor,
          drug: this.drug,
          description: this.description,
          quantity: this.quantity,
          batchno: this.batchno,
          date: this.date,
          price: this.price,
        }
      },
    },

    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
      },
      name () {
        this.errorMessages = ''
      },
    },

    methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      addressCheck () {
        this.errorMessages = this.address && !this.name
          ? `Hey! I'm required`
          : ''

        return true
      },
      resetForm () {
        this.errorMessages = []
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
          this.$refs[f].reset()
        })
      },
      submit () {
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
          if (!this.form[f]) this.formHasErrors = true

          this.$refs[f].validate(true)
        })
      },
    },
  }
</script>
