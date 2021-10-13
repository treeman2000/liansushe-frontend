<template>
  <div>
      <el-container>
        <el-header  style="text-align: right">
          <el-button type="text">返回搜索界面</el-button>
        </el-header>
      </el-container>
      
      <el-container style="height:500px;border:1px solid #eee">
        <el-aside width="200px">
            <el-avatar shape="square" :size="150" :src="avatarUrl" ></el-avatar>
            <el-row >{{$store.state.loginInfo.userName}}</el-row>
          <el-menu>
            <el-menu-item-group >
              <el-menu-item index="1" @click="showValue=1">个人信息</el-menu-item>
              <el-menu-item index="2" @click="showValue=2">添加房子</el-menu-item>
              <el-menu-item index="3" @click="showValue=3">查看房子</el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </el-aside>
        <el-main v-if="showValue==1">
          <el-descriptions title="用户信息">
            <el-descriptions-item label="用户名" >{{personInfo.userName}}</el-descriptions-item>
            <el-descriptions-item label="手机号码">{{personInfo.teleNumber}}</el-descriptions-item> 
          </el-descriptions>
        </el-main>
        <el-main v-if="showValue==2" >
          <el-form label-width="100px" >
            <el-form-item label="地点">
              <el-input v-model="HouseInfo.Place" style="width:500px" ></el-input>
            </el-form-item>
            <el-form-item label="区域中心">
              <el-input v-model="HouseInfo.Center" style="width:500px" ></el-input>
            </el-form-item>
            <el-form-item label="面积(m²)">
              <el-input v-model="HouseInfo.Area" style="width:80px" ></el-input>
            </el-form-item>
            <el-form-item label="房租(元/月)">
              <el-input v-model="HouseInfo.Price" style="width:80px" ></el-input>
            </el-form-item>
            <el-form-item label="押金">
              <el-input v-model="HouseInfo.Deposit" style="width:80px" ></el-input>
            </el-form-item>
            <el-form-item label="居室(个)">
              <el-input v-model="HouseInfo.Room" style="width:80px" ></el-input>
            </el-form-item>
            <el-form-item label="厅室(个)">
              <el-input v-model="HouseInfo.Hall" style="width:80px" ></el-input>
            </el-form-item>
            <el-form-item label="是否有电梯">
              <el-radio v-model="HouseInfo.Elevator" label="true">是</el-radio>
              <el-radio v-model="HouseInfo.Elevator" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="楼层">
              <el-input v-model="HouseInfo.Storey" style="width:80px" ></el-input>
            </el-form-item>
            <el-form-item label="租期(月)">
              <el-input v-model="HouseInfo.Term" style="width:80px" ></el-input>
            </el-form-item>
            <el-form-item label="朝向">
               <el-input v-model="HouseInfo.Direction" style="width:80px" ></el-input>
            </el-form-item>
            <el-form-item label="设施">
              <el-select v-model="HouseInfo.Facility" style="width:400px" multiple placeholder="请选择">
                <el-option
                  v-for="item in FacilityOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="HouseInfo.Note" style="width:300px" ></el-input>
            </el-form-item>
            <el-form-item label="房屋图片">
              <el-upload
                class="houseImg"
                ref="upload"
                action=""
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false"
                :on-change="handleHouseImg"
                accept="">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="CreateHouseInfo">确认添加</el-button>
        </el-main>
        <el-main v-if="showValue==3">
          <el-table :data="OnlineHouseInfo" style="width: 100%">
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
                  <el-button @click='offline(scope.row.HouseID)'> 下线</el-button>
                </template>
              </el-table-column>
          </el-table>
        </el-main>
      </el-container>
  </div>
</template>

<script>
import axios from 'axios';
import tableItemHouse from '../components/tableItemHouse.vue'

export default {
  data(){
    
    return{
      showValue:1,
      personInfo:{
        userName:'bb',
        teleNumber:'136'
      },
      avatarUrl:require("../assets/MainImg.jpg"),
      HouseInfo:{
        Place:'',
        Center:'',
        Area:undefined,
        Price:undefined,
        Deposit:undefined,
        Room:undefined,
        Hall:undefined,
        Elevator:false,
        Storey:undefined,
        Term:undefined,
        Direction:'',
        Facility:[],
        Note:''
      },
      fileList:[],
      file:undefined,
      FacilityOptions:[
        {
          value:0,
          label:'天然气'
        },
        {
          value:1,
          label:'宽带'
        },
        {
          value:2,
          label:'暖气'
        },
        {
          value:3,
          label:'床'
        },
        {
          value:4,
          label:'热水器'
        },
        {
          value:5,
          label:'冰箱'
        },
        {
          value:6,
          label:'电视'
        },
        {
          value:7,
          label:'衣柜'
        },
        {
          value:8,
          label:'空调'
        },
        {
          value:9,
          label:'洗衣机'
        },
      ],
      HouseImgUrl:'',
      OnlineHouseInfo:[],
      OfflineHouseInfo:[]
    };
  },
  methods:{
    CreateHouseInfo(){
      let url='/house/add'
      axios.post(url,{
        Token:this.$store.state.loginInfo.token,
        Place:this.HouseInfo.Place,
        Center:this.HouseInfo.Center,
        Area:this.HouseInfo.Area,
        Price:this.HouseInfo.Price,
        Deposit:this.HouseInfo.Deposit,
        Room:this.HouseInfo.Room,
        Hall:this.HouseInfo.Hall,
        Elevator:this.HouseInfo.Elevator,
        Storey:this.HouseInfo.Storey,
        Term:this.HouseInfo.Term,
        Direction:this.HouseInfo.Direction,
        Facility:this.HouseInfo.Facility,
        Note:this.HouseInfo.Note,
        Image:this.file
      }).then(rsp=>{
        console.log(rsp);
        if (rsp.data.Result == 'OK'){
          this.$alert('创建成功!','提示')
        }else{
          this.$alert(rsp.data.Result,'创建失败')
        }
      })
    },
    handleRemove(file,fileList){
      console.log(file,fileList);
    },
    handlePreview(file){
      console.log(file);
    },
    handleHouseImg(file,fileList){
      const isJPG=file.raw.type==='image/jpeg'
      const isPNG=file.raw.type==='image/png'
      if(!isJPG&&!isPNG){
        this.$alert('上传图片只能是JPG/PNG格式！')
        return false
      }
      this.HouseImgUrl=file.raw;
      console.log(file.raw);
    },
    offline(HouseID){

    }
  }
}
</script>

<style>
.el-aside{
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 20px;
}
</style>
