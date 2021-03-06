// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';
import { Lazyload } from 'vant';
import axios from 'axios'
import VueBus from './common/vue-bus'
import store from './store'
import { Toast } from 'vant';

Vue.use(VueBus)
Vue.use(Vant);
Vue.use(Lazyload);

Vue.prototype.$http = axios

// 打包安卓配置
// axios.defaults.baseURL = 'http://cloud.zgcfo.com';

Vue.prototype.$Get = function(url, config, success){
	let _self = this
	_self.$http.get(url, config).then(function(res){
		if(res.data.msgCode == "40000"){
			success(res)
		}else{
			_self.$toast.fail('系统错误！')
		}
	}).catch(function(err){
		_self.$toast.fail('网络错误！')
	})
}
Vue.prototype.$Post = function (url, config, success, fail) {
  let _self = this
  this.$http.post(url, config).then(function (res) {
    if (res.data.msgCode == "40000") {
      if (res.data.msg) {
        _self.$toast.success(res.data.msg)
      }
      success(res)
    } else {
      fail(res)
      _self.$toast.fail(res.data.msg)
    }
  }).catch(function (err) {
    fail(err)
    _self.$toast.fail(err)
  })
}

Vue.prototype.$backTo = function(){
  console.log(this.$router)
  this.$router.go(-1)
}

Vue.prototype.$array2map = function (array){
  if(array==""||array==null){
      return ;
  }else{
      let tempMap = new Map()
      for(let i = 0;i<array.length;i++){
          tempMap.set(array[i].typecode,array[i].typename)
      }
      return tempMap
  }

}

Vue.prototype.$ButtonCollect = function(name){
  let _self = this;
  let url = 'api/system/addGather';
  let config = {
      params:{
          code : name
      }
  }
  this.$http.get(url,config).then(function(res){
      if(res.data.msgCode == "40000"){
          if(res.data.msg){
              // _self.$Message.success(res.data.msg)
              console.log("采集成功");
          }
      }else{
          // _self.$Message.error(res.data.msg)
          console.warn(res.data.msg)
      }
  }).catch(function(err){
      console.error(err)
  })
}

Vue.prototype.$GetDataCenter = function (params, finish) {
  let _self = this
  let config = {
    params: {
      groupCodes: params
    }
  }
  // let url = `api/dataCenter/system/tsType/queryTsTypeByGroupCodes`
  let url = `api/system/tsType/queryTsTypeByGroupCodes`

  this.$http.get(url, config).then(function (res) {
    // _self.$backToLogin(res)
    if (res.data.msgCode == "40000") {
      finish(res)
    } else {
      // _self.$Message.error("请求异常！")
    }
  }).catch(function (err) {
    console.log(err)
    // _self.$Message.error("网络异常！")
  })
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
