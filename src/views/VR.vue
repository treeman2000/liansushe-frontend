<template>
  <div>
    <h1>工作区</h1>
    <div v-html="html"></div>
  </div>
 <!-- <div class="page-panorama">
    <a-scene>
      <a-assets>
        <img id="sky" src="../assets/img.jpeg" alt="">
      </a-assets>
      <a-camera id="camera" position="0 1.6 0" fov="80" ref="camera"></a-camera>
      <a-sky src="#sky" ref="sky" radius="15"></a-sky>
    </a-scene>
  </div> -->
</template>
<script>
import 'aframe'
import axios from 'axios';
  export default {
    data() {
      return {
        html: "",
      };
    },
  created() {
    this.load();
  },
  methods: {
    // 加载远程html
    load() {
      let url="vr/"+this.$route.params.fileName
      console.log("url is ",url)
      axios.get(url, {
          headers: {
            accept: "text/html;charset=UTF-8"
          },
          params: {},
          }).then((res) => {
            console.log(res);
            this.html = res.data
          })
          .catch((err) => {
            console.log(err);
          });
        },
      }
  }
</script>
