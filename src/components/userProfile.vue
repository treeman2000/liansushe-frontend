<template>
  <div>
      <el-descriptions v-if="!isAdding" title="用户信息" :column="2">
        <template slot="extra">
          <el-button type="primary" @click='btnAddProfile' >修改个人信息</el-button>
        </template>
        <el-descriptions-item label="年龄" >{{profile.Age}}</el-descriptions-item>
        <el-descriptions-item label="性别">{{profile.Gender}}</el-descriptions-item> 
        <el-descriptions-item label="专业">{{profile.Major}}</el-descriptions-item> 
        <el-descriptions-item label="家乡">{{profile.Hometown}}</el-descriptions-item> 
        <el-descriptions-item label="性格">{{profile.Character}}</el-descriptions-item> 
        <el-descriptions-item label="爱好">{{profile.Hobby}}</el-descriptions-item> 
        <el-descriptions-item label="期望睡觉时间">{{profile.SleepTime}}</el-descriptions-item> 
        <el-descriptions-item label="期望起床时间">{{profile.AwakeTime}}</el-descriptions-item> 
        <el-descriptions-item label="对室友的期望">{{profile.Expectation}}</el-descriptions-item> 
        <el-descriptions-item label="希望合租的宿舍ID">{{profile.WantHouse}}</el-descriptions-item> 
      </el-descriptions>

      <el-form v-else>
        <el-form-item label="年龄">
          <el-input v-model="profile.Age"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="profile.Gender"></el-input>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="profile.Major"></el-input>
        </el-form-item>
        <el-form-item label="家乡">
          <el-input v-model="profile.Hometown"></el-input>
        </el-form-item>
        <el-form-item label="性格">
          <el-input v-model="profile.Character"></el-input>
        </el-form-item>
        <el-form-item label="爱好">
          <el-input v-model="profile.Hobby"></el-input>
        </el-form-item>
        <el-form-item label="期望睡觉时间">
          <el-input v-model="profile.SleepTime"></el-input>
        </el-form-item>
        <el-form-item label="期望起床时间">
          <el-input v-model="profile.AwakeTime"></el-input>
        </el-form-item>
        <el-form-item label="对室友的期望">
          <el-input v-model="profile.Expectation"></el-input>
        </el-form-item>
        <el-form-item label="希望合租的宿舍ID（没有可不填）">
          <el-input v-model="profile.WantHouse"></el-input>
        </el-form-item>
        <el-form-item label="上传头像">
          <el-upload
          class="avatar-uploader"
            :action="AvatarURL"
            :show-file-list="false">
            <img v-if="profile.AvatarURL" :src="profile.AvatarURL" class="avatar-uploader-icon">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-button type="primary" @click="addProfile">提交修改</el-button>
      </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return{
      profile:{
        UserID:this.$store.state.loginInfo.userID,
        Age:'',
        Gender:'',
        Major:'',
        Hometown:'',
        Character:'',
        Hobby:'',
        SleepTime:'',
        AwakeTime:'',
        Expectation:'',
        WantHouse:'',
        AvatarURL:''
      },
      isAdding:false,
      fileList:[],
      AvatarURL:''//上传时的url
    }
  },
  methods:{
    getProfile(){
      let url='/profile/get'
      axios.post(url,{
        Token:this.$store.state.loginInfo.token,
        UserID:this.$store.state.loginInfo.userID,
      }).then(res=>{
        if(res.data.Result=="OK"){
          this.profile=res.data.Profile
          this.$store.commit('setAvatarURL',this.profile.AvatarURL)

          console.log('[profile/get]',this.profile)
        }else{
          console.log("[/profile/get]",res.data.Result)
        }
      }).catch(err=>{
        console.log("[/profile/get]",err)
      })
    },
    addProfile(){
      this.toNumber()
      let url='/profile/add'
      this.profile.userID=this.$store.state.loginInfo.userID
      axios.post(url,{
        Token:this.$store.state.loginInfo.token,
        Profile:this.profile
      }).then(rsp=>{
        console.log(rsp);
        if (rsp.data.Result == 'OK'){
          this.getProfile()
          this.$alert('修改成功!','提示')
          this.isAdding=false
        }else{
          this.$alert(rsp.data.Result,'修改失败')
        }
      }).catch(err=>{
        console.log("[/profile/add]",err)
      })
    },
    btnAddProfile(){
      this.isAdding=true
      this.beforeAvatarUpload()
    },
    toNumber(){
      this.profile.Age=Number(this.profile.Age)
      this.profile.WantHouse=Number(this.profile.WantHouse)
    },
    beforeAvatarUpload(){
      this.AvatarURL='/profile/add_avatar/'+this.$store.state.loginInfo.userID
      console.log('[beforeAvatarUpload]',this.AvatarURL)
    }
  },
  created(){
    this.getProfile()
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>