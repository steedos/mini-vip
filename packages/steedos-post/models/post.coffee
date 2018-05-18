Creator.Objects.post =
	name: "post"
	label: "热点信息"
	icon: "apps"
    enable_files:true
	fields:
        name:
            label:'标题'
            type:'text'
            required:true
        summary:
            label:'简介'
            type:'text'
        store:
            label:'门店'
            type:'master_detail'
            reference_to:'vip_store'
        description:
            label:'详细'
            type:'textarea'
        comment_count:
            label:'评论数'
            type:'number'
        star_count:
            label:'点赞数'
            type:'number'
        read_count:
            label:'阅读数'
            type:'number'
        forward_count:
            label:'转发数'
            type:'number'
        enable_comment:
            label:'是否允许评论'
            type:'Boolean'
            defaultValue:true
        start_time:
            label:'开始时间'
            type:'datetime'
        end_time:
            label:'结束时间'
            type:'datetime'
        