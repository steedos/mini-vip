import req from '@/network'

class CreatorClinet{
  async loadBootstrap(space_id){
    const result = await req.get(`/api/bootstrap/${space_id}`, {}).catch((err)=>{
      return {}
    })

    return result;
  }
}

export default new CreatorClinet()
