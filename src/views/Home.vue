<template>
<div>
  <el-container>
      <el-header style="text-align: right">
          <div v-if="$store.state.authorized">
              <el-button type="text" @click="toProfile">您好，{{$store.state.loginInfo.userName}}</el-button>
              <el-button  type="text" @click="$store.commit('leave')">退出</el-button>
          </div>
          <div v-else>
              <el-button type="text" @click='openLegisterPage'>注册</el-button>
              <el-button type="text" @click='openLoginPage'>登录</el-button>
          </div>

          <!-- 注册界面 -->
          <el-dialog :visible.sync='registering'>
            <el-form>
              <el-form-item label="用户名">
                <el-input v-model="loginInfo.userName"></el-input>
              </el-form-item>                   
              <el-form-item label="学邮">
                <el-input v-model="loginInfo.userID"></el-input>
              </el-form-item> 
              <el-form-item label="密码">
                <el-input v-model="loginInfo.password"></el-input>
              </el-form-item> 
              <el-form-item label="验证码">
                <el-input v-model="loginInfo.verificationCode"></el-input>
              </el-form-item> 
              <el-form-item>
                <el-button @click='verify'>获取验证码</el-button>
                <el-button @click='register'>注册</el-button>
              </el-form-item> 
            </el-form>
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
        <!-- 搜索框 -->
        <div class="bgImg">
          <el-row  style='height:400px'>
          </el-row>
        <el-row >
          <el-col :span='8' :offset='8'>
            <el-button type="text" @click="isSearchingHouse=true">搜好房</el-button>
            <el-button type="text" @click="isSearchingHouse=false">找室友</el-button>
          </el-col>
        </el-row>
        <el-row v-if='isSearchingHouse' type="flex" justify="center">
          <el-col :span='2'>
            <el-select v-model="searchHouseReq.price" clearable placeholder="租金">
              <el-option
                v-for="item in prices"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span='2'>
             <el-select v-model="searchHouseReq.roomNumber" clearable placeholder="几居室">
               <el-option
                v-for="item in roomNumbers"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
             </el-select>
          </el-col>
          <el-col :span='2'>
            <el-select v-model="searchHouseReq.center" clearable placeholder="区域中心">
              <el-option
                v-for="item in centers"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span='2'>
            <el-select v-model="searchHouseReq.term" clearable placeholder="租期">
              <el-option
                v-for="item in terms"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span='1'>
            <el-button icon="el-icon-search" @click='searchHouseFirstPage'></el-button>
          </el-col>
        </el-row>
        <el-row v-else type="flex" justify="center">
          <el-col :span='8'>
            <el-input v-model="keyword" placeholder="请用几个关键词描述您想找的室友"></el-input>
          </el-col>
          <el-col :span='1'>
            <el-button icon="el-icon-search" @click='searchRoommateFirstPage'></el-button>
          </el-col>
        </el-row>
        <el-row style="height: 50px">
        </el-row>
       </div>
        <!-- 结果框 -->
        <el-row type="flex" justify="center">
          <el-col>
            <el-table :data='houseInfos' style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <el-image :src='scope.row.ImgURL' style="width: 200px; height: 200px">
                      <div slot="error">暂无房屋图片</div>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <table-item-house :houseInfo='scope.row'></table-item-house>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button @click='generateVR(scope.row.HouseID)'> VR看房</el-button>
                  <el-button @click='addtocollection(scope.row.HouseID)'> 添加收藏</el-button>
                  <el-button @click='contact(scope.row.HouseID)'> 立即咨询</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination 
              background 
              layout="prev, pager, next" 
              :total="itemNumber" 
              @current-change='searchHouse'
              :page-size='pageSize'
              :hide-on-single-page="hideOnSinglePage">
            </el-pagination>
          </el-col>
        </el-row>
      </el-main>
  </el-container>
</div>
</template>

<script>
import axios from 'axios'
import tableItemHouse from '../components/tableItemHouse.vue'

export default {
    data () {
        return{
            registering:false,
            logining:false,
            loginInfo:{
              userName:'',
              userID:'defaultID',
              password:'defaultPwd',
              verificationCode:'',
              token:''
            },
            isSearchingHouse:true,
            keyword:'',
            searchHouseReq:{
              price:'',
              roomNumber:[],
              center:'',
              term:''
            },
            prices:[
              {label:'任意',value:0},
              {label:'<2k',value:1},
              {label:'2k~3k',value:2},
              {label:'3k~4k',value:3},
              {label:'4k~5k',value:4},
              {label:'>5k',value:5}
            ],
            roomNumbers:[
              {label:'任意',value:0},
              {label:'一居室',value:1},
              {label:'二居室',value:2},
              {label:'三居室',value:3},
              {label:'大于三居室',value:4}
            ],
            centers:[
              {label:'任意',value:'任意'},
              {label:'邯郸',value:'邯郸'},
              {label:'江湾',value:'江湾'},
              {label:'张江',value:'张江'},
              {label:'枫林',value:'枫林'}
            ],
            terms:[
              {label:'任意',value:0},
              {label:'<3月',value:1},
              {label:'3~6月',value:2},
              {label:'6~12月',value:3},
              {label:'>12月',value:4}
            ],
            pageSize:10,
            houseInfos:[],
            itemNumber:0,
            hideOnSinglePage:true,
            backImgUrl:require("../assets/backgroundImg.jpg")
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
          }).catch(err=>{
            console.log(err)
          })

          this.logining=false
        },
        verify(){
          let url='/verify'
          axios.post(url,{
            EmailAddress:this.loginInfo.userID
          }).then(res=>{
            console.log(res)
            if(res.data.Result!='OK'){
              this.$alert(res.data.Result,'提示')
              return
            }
            this.$alert('发送成功','提示')
          }).catch(err=>{
            console.log(err)
          })
        },
        register(){
          let url='/register/v2'
          axios.post(url,{
            UserName: this.loginInfo.userName,
            EmailAddress: this.loginInfo.userID,
            Password: this.loginInfo.password,
            VerificationCode:this.loginInfo.verificationCode
          }).then(rsp=>{
            console.log(rsp);

            if (rsp.data.Result == 'OK'){
              this.$alert('注册成功!','提示')
            }else{
              this.$alert(rsp.data.Result,'注册失败')
            }
          })

          this.registering=false
        },
        searchRoommateFirstPage() {
          this.searchRoommate(0)
        },
        searchRoommate() {

        },
        searchHouseFirstPage(){
          this.searchHouse(1)
        },
        // 参数的pageNum从1开始，而接口是从0开始，故减1
        searchHouse(pageNum) {
          console.log(this.searchHouseReq)

          if(typeof(this.$store.state.loginInfo.token)=='undefined' || this.$store.state.loginInfo.token==''){
            this.$alert('请先登录','提示')
            console.log(this.$store.state.loginInfo.token)
            return
          }

          let url='/house/search'
          axios.post(url,{
            Token: this.$store.state.loginInfo.token,
            PageSize: this.pageSize,
            PageNum: pageNum-1,
            RoomNum: this.roomNum,
            Center: this.center,
            MinPrice: this.minPrice,
            MaxPrice: this.maxPrice,
            MinTerm: this.minTerm,
            MaxTerm: this.maxTerm,
            UserID: ''
          }).then(rsp=>{
            console.log("this.center returns",this.center)
            console.log(rsp)
            
            if(rsp.data.Result!='OK'){
              this.$alert(rsp.data.Result,'提示')
              return
            }
            this.itemNumber=rsp.data.Number
            this.houseInfos=rsp.data.HouseInfos
          }).catch(err=>{
            console.log(err)
          })
        },
        contact(HouseID){
          console.log(HouseID)

          this.$alert('联系方式：1145141919','提示')
        },
        generateVR(HouseID){
          this.$router.push("./VR/"+HouseID+".html")
        },
        addtocollection(HouseID){

        }
    },
    computed:{
      minPrice(){
        let i=this.searchHouseReq.price
        switch(i){
          case 0: return undefined;
          case 1: return 0;
          case 2: return 2000;
          case 3: return 3000;
          case 4: return 4000;
          case 5: return 5000;
        } 
      },
      maxPrice(){
        let i=this.searchHouseReq.price
        switch(i){
          case 0: return undefined;
          case 1: return 2000;
          case 2: return 3000;
          case 3: return 4000;
          case 4: return 5000;
          case 5: return undefined;
        } 
      },
      minTerm(){
        let i=this.searchHouseReq.term
        switch(i){
          case 0: return undefined;
          case 1: return 0;
          case 2: return 3;
          case 3: return 6;
          case 4: return 12;
        }
      },
      maxTerm(){
        let i=this.searchHouseReq.term
        switch(i){
          case 0: return undefined;
          case 1: return 3;
          case 2: return 6;
          case 3: return 12;
          case 4: return undefined;
        }
      },
      roomNum() {
        if(this.searchHouseReq.roomNumber==0){
          return undefined
        }
        return [this.searchHouseReq.roomNumber]
      },
      center(){
        console.log('in center',this.searchHouseReq.center)
        if(this.searchHouseReq.center=='任意' || this.searchHouseReq.center==''){
          console.log('!!!!!!!!!!!')
          return []
        }
        return [this.searchHouseReq.center]
      }
    },
    components:{
      tableItemHouse
    }
}
</script>

<style>
.bgImg{
  background-image: url(../assets/backgroundImg.jpg);
  background-repeat: no-repeat;
  background-position: 0px 0px;
  background-size: 100% 100%;
}
</style>
