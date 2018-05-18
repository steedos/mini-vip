Creator.Objects.vip_card =
	name: "vip_card"
	label: "会员卡"
	icon: "apps"
	fields:
        card_number:
            label:"卡号"
            type:'text'
            required:true
        points:
            label:'积分'
            type:'number'
        grade:
            label:'等级'
            type:'text'
        discount:
            label:'折扣'
            type:'number'
        balance:
            label:'余额'
            type:'number'
        store:
            label:'办卡门店'
            type:'lookup'
            reference_to:'vip_store'
        apply_stores:
            label:'适用门店'
            type:'lookup'
            reference_to:'vip_store'
            mutiple:true
        start_time:
            label:'办卡时间'
            type:'datetime'
        end_time:
            label:'有效时间'
            type:'datetime'
        user:
            label:'持卡人'
            type:'lookup'
            reference_to:'users'
        introducer:
            label:'推荐人'
            type:'lookup'
            reference_to:'users'
        is_actived:
            label:'是否激活'
            type:'text'
        actived_time:
            label:'激活时间'
            type:'datetime'
        # shared_users:
        #     label: "共享用户"
        #     type:'lookup'
        #     mutiple: true
        #     reference_to:'users'
        enable_forward:
            label:'允许转发'
            type:'Boolean'
            defaultValue:false
        forward_count:
            label:'转发次数'
            type:'number'
        
