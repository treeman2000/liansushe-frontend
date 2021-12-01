<template>
<div>
  <el-row type="flex">
    <el-col :span='4'>
      <el-image style="width: 50px; height: 50px" :src="imgPath"></el-image>
    </el-col>
    <el-col>
      {{message.Message}}
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
    props:['message'],
    data(){
      return{
        imgPath:'/profile/get_avatar/'+(this.message.IsSelf?this.$store.state.loginInfo.userID:this.message.UserID)+'.jpg'
      }
    },
    created(){
      console.log(this.message)
      console.log(this.message.IsSelf)
      console.log(this.$store.state.loginInfo.userID)
      console.log((this.message.IsSelf?this.$store.state.loginInfo.userID:this.message.UserID))
    }
}
</script>

<style>

</style>