<template>
  <div>
    <el-row type="flex" justify='center' align="middle">
      <el-col>
        <el-image :src='profile.AvatarURL' style="width: 200px; height: 200px">
          <div slot="error">该用户暂无头像</div>  
        </el-image>
      </el-col>  
      <el-col> 
      <el-descriptions :column="2">
        <el-descriptions-item label="年龄" >{{profile.Age}}</el-descriptions-item>
        <el-descriptions-item label="性别">{{profile.Gender}}</el-descriptions-item> 
        <el-descriptions-item label="专业">{{profile.Major}}</el-descriptions-item> 
        <el-descriptions-item label="家乡">{{profile.Hometown}}</el-descriptions-item> 
        <el-descriptions-item label="性格">{{profile.Character}}</el-descriptions-item> 
        <el-descriptions-item label="爱好">{{profile.Hobby}}</el-descriptions-item> 
        <el-descriptions-item label="期望睡觉时间">{{profile.SleepTime}}</el-descriptions-item> 
        <el-descriptions-item label="期望起床时间">{{profile.AwakeTime}}</el-descriptions-item> 
        <el-descriptions-item label="对室友的期望">{{profile.Expectation}}</el-descriptions-item>
      </el-descriptions>
      </el-col>
      <el-col style="text-align:center">
        <el-button @click='contact()'>立即联系</el-button>
      </el-col>
    </el-row>
    <el-row v-if='profile.WantHouse'>
      <el-col :span='8'>
        <el-image :src='houseInfo.ImgURL' style="width: 200px; height: 200px">
          <div slot="error">暂无房屋图片</div>
        </el-image>
      </el-col>
      <el-col :span='8'>
        <table-item-house :houseInfo='houseInfo'></table-item-house>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import tableItemHouse from './tableItemHouse.vue'
export default {
  components: { tableItemHouse },
  props:['profile'],
  data(){
    return{
      houseInfo:{},
      updateded:0
    }
  },
  methods:{
    contact(){

    },
    getHouseInfo(){
      console.log("[getHouseInfo]")
      let url="/house/get"
      axios.post(url,{
        Token:this.$store.state.loginInfo.token,
        HouseID:this.profile.WantHouse
      }).then(res=>{
        if(res.data.Result=="OK"){
          this.houseInfo=res.data.HouseInfo

          console.log(res.data)
        }else{
          console.log("[getHouseInfo]",res.data.Result)
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  updated(){
    if(this.updateded>=2){
      return
    }
    this.updateded++;
    console.log("[tableProfile mounted]",this.profile)
    if(this.profile.WantHouse){
      this.getHouseInfo()
    }
  }
}
</script>

<style>

</style>