<template>
    <van-dialog
        v-model="name_open"
        :show-confirm-button="false"
        :close-on-click-overlay="true"
        >
        <form action="/">
            <van-search placeholder="请输入公司名称搜索" v-model="searchname" @click="search"/>
        </form>
        <!-- <van-field
            v-model="searchname"
            placeholder="请输入公司名称"
        /> -->
        <van-radio-group v-model="select_company_id">
            <van-cell-group>
                <van-cell v-for="item in companyList" :key="item.companyid" clickable @click="choose(item)">
                    <van-col span="22"><div>{{item.name}}</div></van-col>
                    <van-col span="2"><van-radio :name="item.companyid" /></van-col>
                </van-cell>
            </van-cell-group>
        </van-radio-group>
    </van-dialog>
</template>

<script>
export default {
    data(){
        return {
            searchname:"",
            name_open:false,
            select_company_id:"",
            companyList:""
        }
    },
    methods:{
        search(){
                let _self = this
                let url = `api/legwork/apiQueryCompanyOrCustomerMsg`
                let config = {
                    params:{
                        name: _self.searchname
                    }
                }

                function success(res){
                    _self.companyList = res.data.data                   
                }

                this.$Get(url, config, success)
                // this.$http.get(url, config).then(function(res){
                //     if(res.data.msgCode == "40000"){
                //         _self.companyList = res.data.data                   
                //     }else{
                //         // alert(res.data.msgCode)
                //         _self.$toast.fail('系统错误！')                      
                //     }
                // }).catch(function(err){
                //     _self.$toast.fail('网络错误！')
                // })
        },
        choose(e){
            this.select_company_id = e.companyid
            this.$bus.emit('update_info',e)
            this.name_open = false
        },
    },
    created(){
        let _self = this
        this.$bus.on('open_name_list',(e)=>{
            _self.name_open = true
            _self.search()
        })
    },
    watch:{
        'searchname':'search'
    }
}
</script>

<style>
    .van-field__clear, .van-field__icon{
        margin-right:0px
    }
</style>