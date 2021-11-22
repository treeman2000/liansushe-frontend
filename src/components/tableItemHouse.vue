<template>
<div>
  <el-row>
    <el-col :span=12>地点：{{houseInfo.Place}}</el-col>
    <el-col :span=12>房租：{{houseInfo.Price}}</el-col>
  </el-row>
  <el-row>
    <el-col :span=12>面积：{{houseInfo.Area}}</el-col>
    <el-col :span=12>押金：{{houseInfo.Deposit}}</el-col>
  </el-row>
  <el-row>
    <el-col :span=12>楼层：{{houseInfo.Storey}}</el-col>
    <el-col :span=12>朝向：{{houseInfo.Direction}}</el-col>
  </el-row>
  <el-row>
    <el-col :span=12>电梯：{{getElevator()}}</el-col>
    <el-col :span=12>期望租期：{{houseInfo.Term}} 个月</el-col>
  </el-row>
  <el-row>
    <el-col :span=12>户型：{{houseInfo.Room}}室{{houseInfo.Hall}}厅</el-col>
    <el-col :span=12>设施：{{getFacility()}}</el-col>
  </el-row>
  
</div>  
</template>

<script>
export default {
  props:['houseInfo'],
  data(){
    return{
      facilityMap:['天然气','宽带','暖气','床','热水器','冰箱','电视','衣柜','空调','洗衣机']
    }
  },
  methods:{
    getFacility(){
      let n=this.houseInfo.Facility
      let facility=''
      for(let i=0;i<16;i++){
        if((n&(1<<i))!=0){
          facility+=this.facilityMap[i]+' '
        }
      }
      return facility
    },
    getElevator(){
      return this.houseInfo.Elevator==true?'有':'无'
    }
  }
}
</script>

<style>

</style>