<template>
<div>
  <el-container>
      <el-header style="text-align: right">
          <div v-if="$store.state.authorized">
              <el-button type="text" @click="toProfile">您好，{{$store.state.loginInfo.userName}}</el-button>
              <el-button  type="text">退出</el-button>
          </div>
          <div v-else>
              <el-button type="text" @click='openLegisterPage'>注册</el-button>
              <el-button type="text" @click='openLoginPage'>登录</el-button>
          </div>

          <!-- 注册界面 -->
          <el-dialog :visible.sync='registering'>
            //todo: 注册功能
          </el-dialog>
          
          <!-- 登录界面 -->
          <el-dialog :visible.sync='logining'>
            <el-form>
              <el-form-item label="帐号（手机号）">
                <el-input v-model="loginInfo.userID"></el-input>
              </el-form-item> 
              <el-form-item label="密码">
                <el-input v-model="loginInfo.password"></el-input>
              </el-form-item> 
              <el-form-item>
                <el-button @click='login'>登录</el-button>
              </el-form-item> 
            </el-form>
          </el-dialog>
          
      </el-header>
      <el-main>
          i am main
      </el-main>
  </el-container>
</div>
</template>

<script>
import axios from 'axios'

export default {
    data () {
        return{
            registering:false,
            logining:false,
            loginInfo:{
              userName:'',
              userID:'',
              password:'',
              token:''
            }
        }
    },
    methods:{
        openLegisterPage () {
            this.registering=true
        },
        openLoginPage () {
            this.logining=true
        },
        toProfile () {
            this.$router.push('./profile')
        },
        login () {
          let url='/login'
          axios.post(url,{
            UserID: this.loginInfo.userID,
            Password: this.loginInfo.password
          }).then(rsp=>{
            console.log(rsp);

            if (rsp.data.Result == 'OK'){
              this.loginInfo.token = rsp.data.Token
              this.loginInfo.userName = rsp.data.UserName
              this.$store.commit('login',this.loginInfo)
              
              console.log(this.$store.state.loginInfo)
            }else{
              this.$alert(rsp.data.Result,'登录失败')
            }
          })

          this.logining=false
        }
    }
}
</script>

<style>

</style>
