<template>
  <div>
    <van-popup v-model="areaShow" position="bottom">
      <van-picker
        show-toolbar
        title="企业来源"
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  data(){
    return{
      areaShow:false,
      columns: [],
    }
  },
  methods:{
    onConfirm(e){
      this.areaShow = false;
      this.$bus.emit('UPDATA_COMPANY_SRC',e);
    },
    onCancel(){
      this.areaShow = false;
    }
  },
  created(){
    let _self = this;
    _self.$bus.off('OPEN_COMPANY_SRC');
    _self.$bus.on('OPEN_COMPANY_SRC',(e)=>{
      _self.areaShow = true;
      _self.columns = e;
    })
  }
}
</script>
