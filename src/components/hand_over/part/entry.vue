<template>
  <div>
    <van-row>
      <van-cell-group>
        <div @click="open_company_select">
          <van-field v-model="companyName" label="归属公司" placeholder="请选择归属公司" required disabled/>
        </div>
        <div @click="open_file_type">
          <van-field v-model="customerFileType" label="文件类型" placeholder="请选择文件类型" required disabled/>
        </div>
        <div>
          <van-field v-model="customerFileName" label="文件名称" placeholder="请输入文件名称" required></van-field>
        </div>
        <div v-if="plural">
          <van-field v-model="fileNum" label="文件数量" placeholder="请输入文件数量" />
        </div>
        <div @click="open_save_depart">
          <van-field v-model="saveDepart" label="存放部门" placeholder="请选择存放部门" required disabled/>
        </div>
        <div @click="open_storage">
          <van-field v-model="storageName" label="存放地点" placeholder="请选择存放地点" disabled/>
        </div>
        <van-field v-model="storageCode" label="存放位置" placeholder="请选择存放位置" />
      </van-cell-group>
    </van-row>
    <van-row>
      <center>
        <van-button size="large" style="width:90%;margin-top:20px" type="default" @click="add_file_item" >新增资料项</van-button>
      </center>
    </van-row>
    <van-row style="margin-top:10px">
      <van-row v-for="(item, index) in dataJson" :key="index" style="margin-top:5px">
        <van-col span="4">
          <center><van-icon name="close" style="font-size:20px;line-height:20px" @click="remove(index)"/></center>
        </van-col>
        <van-col span="16">
          <van-row>{{item.customerFileName}}</van-row>
        </van-col>
        <van-col span="4">
          <van-row>{{item.fileNum}}</van-row>
        </van-col>
      </van-row>
    </van-row>
    <van-row>
      <center>
        <van-button size="large" style="width:90%;margin-top:20px" type="danger" @click="submit" :loading="loading" :disabled="disabledButton"> 新 增 </van-button>
      </center>
    </van-row>
    <my-depart></my-depart>
    <local-list></local-list>
  </div>
</template>

<script>
import localList from '../common/localList'
import myDepart from '../common/myDepart'

export default {
  name:"entry",
  components:{
    myDepart,
    localList
  },
  computed:{
    // isInputFilename(){
    //   if(this.customerFileTypeId == "54"){
    //     return true
    //   }else{
    //     return false
    //   }
    // }
    disabledButton(){
      if(this.companyId && this.dataJson.length != 0){
        return false
      }else{
        return true
      }
    }
  },
  data(){
    return{
      loading: false,
      customerId: "",
      companyId: "",
      companyName: "",
      customerFileType: "",
      customerFileTypeId: "",
      fileNum: 1,
      saveDepart: "",
      saveDepartId: "",
      storageName: "",
      storage: "",
      storageCode: "",
      customerFileName: "",
      plural: true,
      dataJson: []
    }
  },
  methods:{
    open_company_select(){
      this.$bus.emit("open_company_list", true)
    },
    open_file_type(){
      this.$bus.emit("OPEN_FILETYPE",true)
    },
    open_save_depart(){
      this.$bus.emit("OPEN_DEPART",true)
    },
    open_storage(){
      this.$bus.emit("OPEN_LOCAL",true)
    },
    submit(){
      let _self = this
        if(this.companyId && this.customerFileTypeId && this.saveDepartId){
          let url = `api/customer/file/create`
          this.loading = true
          let config = {
            // companyId: _self.customerFileTypeId,
            dataJson: JSON.stringify(_self.dataJson),
            // saveDepartId: _self.saveDepartId,
            // storage: _self.storage,
            companyId: _self.companyId,
            // fileNum: _self.fileNum,
            // storageCode: _self.storageCode,
            // customerFileName: _self.customerFileName
          }

          function success(res){
            _self.loading = false
            _self.customerId = ""
            _self.companyId = ""
            _self.companyName = ""
            _self.customerFileType = ""
            _self.customerFileTypeId = ""
            _self.fileNum = 1
            _self.customerFileName = ""
            _self.saveDepart = ""
            _self.saveDepartId = ""
            _self.storageName = ""
            _self.storage = ""
            _self.storageCode = ""
            _self.plural = true
            _self.dataJson = []
          }

          function fail(err){
            _self.loading = false
          }

          this.$Post(url, config, success, fail)
        }else{
          this.$toast.fail("请补全信息！")
        }

    },
    add_file_item(){
      let _self = this

      if(!_self.customerFileTypeId){
        _self.$toast.fail("请输入文件类型")
        return ;
      }
      let temp = {}
      temp.customerFileName = _self.customerFileName
      temp.customerFileTypeId = _self.customerFileTypeId
      temp.saveDepartId = _self.saveDepartId
      temp.storage = _self.storage
      temp.fileNum = _self.fileNum
      temp.storageCode = _self.storageCode

      _self.dataJson.push(temp)

      temp = null
    },
    remove(e){
      this.dataJson.splice(e,1)
    }
  },
  created(){
    let _self = this
    this.$bus.off("update_company")
    this.$bus.on("update_company",(e)=>{
      // console.log(e)
      _self.companyId = e.id
      _self.companyName = e.companyname
      _self.customerId = e.customerId
    })
    this.$bus.off("UPDATE_FILETYPE")
    this.$bus.on("UPDATE_FILETYPE", (e)=>{
      // console.log(e)
      _self.customerFileName = e.file_type_name
      _self.customerFileType = e.file_type_name
      _self.customerFileTypeId = e.id
      if(e.plural == "Y"){
        _self.plural = true
        _self.fileNum = "1"
      }else{
        _self.plural = false
        _self.fileNum = "1"
      }
    })

    this.$bus.off("UPDATE_DEPART")
    this.$bus.on("UPDATE_DEPART", (e)=>{
      // console.log(e)
      _self.saveDepart = e.departname
      _self.saveDepartId = e.departid
    })

    this.$bus.off("UPDATE_LOCAL")
    this.$bus.on("UPDATE_LOCAL", (e)=>{
      _self.storageName = e.typename
      _self.storage = e.typecode

    })
  }
}
</script>

