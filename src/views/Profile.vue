<template>
  <div>
      <el-container>
        <el-header  style="text-align: right">
          <el-button type="text" @click="toHome">返回搜索界面</el-button>
        </el-header>
      </el-container>
      
      <el-container style="height:500px;border:1px solid #eee">
        <el-aside width="200px">
            <el-avatar shape="square" :size="150" :src="$store.state.avatarURL" ></el-avatar>
            <el-row >{{$store.state.loginInfo.userName}}</el-row>
          <el-menu>
            <el-menu-item-group >
              <el-menu-item index="1" @click="showValue=1">个人信息</el-menu-item>
              <el-menu-item index="2" @click="showValue=2">添加房屋</el-menu-item>
              <el-menu-item index="3" @click="checkHouse">查看房屋</el-menu-item>
              
            </el-menu-item-group>
          </el-menu>
        </el-aside>
        <el-main v-if="showValue==1">
          <user-profile></user-profile>
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
              <el-select v-model="HouseInfo.FacilityValue" style="width:400px" multiple placeholder="请选择">
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
                :action="ImgURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :on-change="handleHouseImg"
                accept="">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">请上传一张jpg/png格式的房屋图片</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="CreateHouseInfo">确认添加</el-button>
        </el-main>
        <el-main v-if="showValue==3">
          <el-select v-model="filterValue" placeholder="请选择筛选条件" @change="onChangeFilter(1)">
            <el-option
              v-for="item in filterOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!-- 查看房屋结果框 -->
          <el-table :data='OnorOfflineHouseInfo' style="width: 100%">
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
                状态：{{scope.row.IsOnline?"已上线":"已下线"}}
              </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                  <el-button @click='generateVR(scope.row.HouseID,scope.row.IsOnline)'> VR看房</el-button>
                </template>
              </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                  <el-button @click='onoffline(scope.row.HouseID,scope.row.IsOnline)'> 上/下线</el-button>
                </template>
              </el-table-column>
          </el-table>
          <!-- -->
          <div style="text-align:center">
          <el-pagination 
              background 
              layout="prev, pager, next" 
              :total="itemNumber" 
              @current-change='searchHouse'
              :page-size='pageSize'
              :hide-on-single-page="hideOnSinglePage">
            </el-pagination>
          </div>
        </el-main>
      </el-container>
  </div>
</template>

<script>
import axios from 'axios';
import tableItemHouse from '../components/tableItemHouse.vue'
import UserProfile from '../components/userProfile.vue';

export default {
  data(){
    
    return{
      showValue:1,
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
        FacilityValue:[],
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
      OnorOfflineHouseInfo:[],
      uuid:undefined,
      ImgURL:'',
      filterOption:[
        {
          value:'all',
          label:'全部'
        },
        {
          value:'online',
          label:'已上线'
        },
        {
          value:'offline',
          label:'已下线'
        }
      ],
      filterValue:'all',
      pageSize:10,
      itemNumber:undefined,
      hideOnSinglePage:false
    };
  },
  methods:{
    CreateHouseInfo(){
      let url='/house/add'

      axios.post(url,{
        Token:this.$store.state.loginInfo.token,
        Place:this.HouseInfo.Place,
        Center:this.HouseInfo.Center,
        Area:Number(this.HouseInfo.Area),
        Price:Number(this.HouseInfo.Price),
        Deposit:Number(this.HouseInfo.Deposit),
        Room:Number(this.HouseInfo.Room),
        Hall:Number(this.HouseInfo.Hall),
        Elevator:this.HouseInfo.Elevator=="true",
        Storey:Number(this.HouseInfo.Storey),
        Term:Number(this.HouseInfo.Term),
        Direction:this.HouseInfo.Direction,
        Facility:this.createFValue(this.HouseInfo.FacilityValue),
        Note:this.HouseInfo.Note,
        Image:this.uuid
      }).then(rsp=>{
        console.log(rsp);
        if (rsp.data.Result == 'OK'){
          this.$alert('创建成功!','提示')
        }else{
          this.$alert(rsp.data.Result,'创建失败')
        }
        this.updateUUID()
      })
    },
    handleRemove(file,fileList){
      console.log(file,fileList);
    },
    handlePreview(file){
      console.log(file);
    },
    handleHouseImg(file,fileList){
      const isJPG=file.raw.type==='image/jpeg';
      const isPNG=file.raw.type==='image/png';
      if(!isJPG&&!isPNG){
        this.$alert('上传图片只能是JPG/PNG格式！');
        return false;
      }
    },
    //刷新uuid和url()
    updateUUID(){
      let dt=new Date;
      this.uuid=dt.getTime().toString();
      this.ImgURL='/image/'+this.uuid
    },
    toHome(){
      this.$router.push('./')
    },
    onoffline(HouseID,IsOnline){
      let url
      if(IsOnline){
        url='/house/set_offline'
      }else{
        url='/house/set_online'
      }
      axios.post(url,{
        Token:this.$store.state.loginInfo.token,
        HouseID:HouseID
      }).then(rsp=>{
        console.log(rsp);
        if (rsp.data.Result == 'OK'){
          this.$alert('修改成功!','提示')
          this.onChangeFilter(1);
        }else{
          this.$alert(rsp.data.Result,'修改失败')
        }
      })
    },
    checkHouse(){
      this.showValue=3;
      this.onChangeFilter(1);
    },
    onChangeFilter(pageNum){
      let url='/house/search'
      axios.post(url,{
        Token:this.$store.state.loginInfo.token,
        State:this.filterValue,
        PageSize:this.pageSize,
        PageNum:pageNum-1
      }).then(rsp=>{
        console.log(rsp);
        if (rsp.data.Result == 'OK'){
          this.itemNumber=rsp.data.Number
          this.OnorOfflineHouseInfo=rsp.data.HouseInfos
          console.log(this.OnorOfflineHouseInfo)
        }else{
          this.$alert(rsp.data.Result,'服务器繁忙，请稍后再试')
        }
      })
    },
    createFValue(Fvs){
      let value=0;
      for(let i=0;i<Fvs.length;i++){
        value=value|(0x1<<Fvs[i]);
      }
      console.log(Fvs,typeof(value),value);
      
      return value;
    },
    generateVR(HouseID){
      
    }
  },
  components:{
      tableItemHouse,
    UserProfile
  },
  mounted(){
    this.updateUUID()
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
