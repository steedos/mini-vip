Creator.Objects.vip_billing =
	name: "vip_billing"
	label: "消费记录"
	icon: "apps"
	fields:
        amount:
            label:'消费金额'
            type:'number'
        location:
            label:'位置'
            type:'location'
        store:
            label:'门店'
            type:'lookup'
            reference_to:'vip_store'
        card:
            label:'会员卡'
            type:'lookup'
            reference_to:'vip_card'
        description:
            label:'备注'
            type:'textarea'
