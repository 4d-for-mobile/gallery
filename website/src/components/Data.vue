<template>
  <div class="col-sm-12 d-md-flex flex-wrap gutter flex-auto ml-1">
    <Item v-for="item in filtered" v-bind:key="item.html_url" :passed-item="item" :type="type" :picker="picker" :target="target"/>
    <GalleryItem v-if="picker" :type="type"/>
    <ShareItem v-else :type="type" />
  </div>
</template>

<script>
import Item from "./Item.vue";
import ShareItem from "./ShareItem.vue";
import GalleryItem from "./GalleryItem.vue";
import api from "@4d-for-mobile/gallery_api";

import { serverBus } from '../main.js';

export default {
  data() {
    return {
      type: this.$route.params.type,
      picker: this.$route.params.picker,
      target: this.$route.params.target,
      items: [],
      filtered: [],
      searchTerm: "",
    };
  },
  watch: {
    $route: "fetchItems"
  },
  methods: {
    fetchItems() {
      this.items = [];
      this.type = this.$route.params.type;
      console.log("fetch");
      api
        .repositories("4d-for-ios-" + this.type)
        .then(json => {
          this.items = json.items;
          this.filter();
          console.log("fetched");
        });
    },
    filter() {
          console.log("type:"+this.type);
          console.log("target:"+this.target);
          console.log("picker:"+this.picker);  
          if (this.searchTerm) {
            var search = this.searchTerm.toLowerCase();
            this.filtered = this.items.filter(item => item.name.toLowerCase().includes(search) || item.description.toLowerCase().includes(search) || item.author.toLowerCase().includes(search));
            console.log(this.filtered.map(item => item.name));
          } else {
            this.filtered = this.items.slice();
            console.log("no more search");
          }
          if (this.target) {
            if (this.target=="ios" || this.target=="android") {
              this.filtered = this.filtered.filter(item => (item.target == null && this.target=="ios" ) || (item.target != null && item.target.includes(this.target)));
            }// else any unexpected types are considerer as "all"
          }
    }
  },
  created() {
    this.fetchItems();
    serverBus.$on('search', (searchTerm) => {
      console.log("search term: " + searchTerm);
      this.searchTerm = searchTerm;
      this.filter();
    });
  },
  components: {
    Item,
    ShareItem,
    GalleryItem
  }
};
</script>