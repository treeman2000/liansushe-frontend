<template>
  <div>
    <el-container style="height:100%">
      <el-aside>
        <el-menu @select="chooseTarget">
          <el-menu-item-group>
            <el-menu-item 
            v-for="item in chatList"
            :key="item.UserID"
            :index="item.UserID">
            {{item.UserName}} 
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main style="height:60%;" class="infinite-list-wrapper">
          <ul class="list" infinite-scroll-disabled="disabled">
            <li v-for="item in messageMap[targetUserID]" :key="item">{{item}}</li>
          </ul>
        </el-main>
        <el-footer style="height:40%; text-align:right">
          <el-input v-model="messageToSend" placeholder="请输入" type="textarea" :rows="5"></el-input>
          <el-button type="primary" @click='sendMessage'>发送</el-button>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return{
      messageToSend:'',
      chatList:[{UserID:"uid1",UserName:"uName1"},
        {UserID:"uid2",UserName:"uName2"},
      ],
      messageMap:{"localID":[{
        UserID:"localID",
        UserName:"localName",
        Message:"rarara",
        IsSelf:true
      }]},
      ws:WebSocket,
      targetUserID:'localID'
    }
  },
  methods:{
    chooseTarget(tid){
      console.log("idx:",tid)
      this.targetUserID=tid
    },
    getChatList(){
      let url='/chatlist'
      axios.post(url,{
        Token:this.$store.state.loginInfo.token,
        UserID:this.$store.state.loginInfo.userID
      }).then(res=>{
        console.log('[/chat/list]',res)
        if(res.data.Result=="OK"){
          // 为了响应式
          this.chatList=[]
          this.chatList.push(...res.data.ChatList)
        }else{
          console.log("err in chatlist",res.data.Result)
          return
        }
      })
    },
    wsInit(){
      let url="ws://localhost:9000/chat/"+this.$store.state.loginInfo.userID
      this.ws=new WebSocket(url)
      this.ws.onopen=this.onopen
      this.ws.onerror=this.onerror
      this.ws.onmessage=this.onmessage
      this.ws.onclose=this.onclose
    },
    onopen(){
      console.log('ws连接成功')
    },
    onerror(){
      console.log('err in ws')
    },
    onmessage(msg){
      console.log("onmessage")
      console.log(msg)

      msg=JSON.parse(msg.data)
      if(this.messageMap[msg.UserID]==undefined){
        this.$set(this.messageMap,msg.UserID,[msg])
      }else{
        this.messageMap[msg.UserID].push(msg)
      }
    },
    onclose(){
      console.log("socket已经关闭")
    },
    sendMessage(){
      let m=JSON.stringify({"TargetUserID":"targetID",
      "Message":this.messageToSend})
      this.ws.send(m)
      console.log(this.messageMap)
    }
  },
  created(){
    this.wsInit()
    this.getChatList()
  }
}
</script>

<style>

</style>