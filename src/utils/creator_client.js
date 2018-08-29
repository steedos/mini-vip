import req from '@/network'
import _ from 'underscore'

class CreatorClinet{
  getObjectRelateds(objects, object_name){
    let related_objects = [];

    const _object = objects[object_name];

    if(!_object){
      return related_objects
    }

    _.each(objects, function(related_object, related_object_name) {
      return _.each(related_object.fields, function(related_field, related_field_name) {
        if (related_field.type === "master_detail" && related_field.reference_to && related_field.reference_to === object_name) {
          if (related_object_name === "object_fields") {
            return related_objects.splice(0, 0, {
              object_name: related_object_name,
              foreign_key: related_field_name
            });
          } else {
            return related_objects.push({
              object_name: related_object_name,
              foreign_key: related_field_name
            });
          }
        }
      });
    });

    if( _object.enable_files){
      related_objects.push({object_name:"cms_files", foreign_key: "parent"})
    }
    if(_object.enable_tasks){
      related_objects.push({object_name:"tasks", foreign_key: "related_to"})
    }
    if( _object.enable_notes){
      related_objects.push({object_name:"notes", foreign_key: "related_to"})
    }
    if( _object.enable_instances){
      related_objects.push({object_name:"instances", foreign_key: "instances"})
    }

    console.log('CreatorClinet.getObjectRelateds',related_objects);

    return related_objects
  }

  async loadBootstrap(space_id){
    const result = await req.get(`/api/bootstrap/${space_id}`, {}).catch((err)=>{
      return {}
    });
    return result;
  }

  getPermissions(obj){
    if(!obj){
      return
    }
    return obj.permissions
  }

  getObjectRecord(){

  }


  getODataRelatedFilter = function(spaceId, userId, object_name, related_object, related_field_name, record_id, objects) {
    var permissions, record_object_name, related_field_name, selector, related_object_name;
    related_object_name = related_object.name
    selector = [];
    related_field_name = related_field_name.replace(/\./g, "/");
    if (related_object_name === "cfs.files.filerecord") {
      selector.push(`(metadata/space eq '${spaceId}')`);
    } else {
      selector.push(`(space eq '${spaceId}')`);
    }
    if (related_object_name === "cms_files") {
      selector.push("and", `(parent/o eq '${object_name}')`);
      selector.push("and", `(parent/ids eq '${record_id}')`);
    } else if (object_name === "objects") {
      console.log('record_id', record_id)
      record_object_name = _.findWhere(objects, {_id: record_id}).name;
      selector.push("and", `(${related_field_name} eq '${record_object_name}')`);
    } else {
      let related_field = related_object.fields[related_field_name];
      console.log('====================>', object_name, related_field_name, related_field)
      if(related_field && (_.isArray(related_field.reference_to) || _.isFunction(related_field.reference_to) || _.isString(related_field._reference_to))){
        selector.push("and", `(${related_field_name}/o eq '${object_name}')`);
        selector.push("and", `(${related_field_name}/ids eq '${record_id}')`);
      }else{
        selector.push("and", `(${related_field_name} eq '${record_id}')`);
      }

    }
    permissions = this.getPermissions(related_object);
    if (!permissions.viewAllRecords && permissions.allowRead) {
      selector.push("and", `(owner eq '${userId}')`);
    }
    return selector;
  };

}

export default new CreatorClinet()
