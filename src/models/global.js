import {updateModel} from "../frame";
import {random} from "@wangct/util/lib/util";

export default {
  namespace: 'global',
  state: {
  },

  effects: {

  },

  reducers: {
    updateField(state,{field,data,parentField}){
      let extState = field === 'multiple' ? data : {[field]:data};
      if(parentField){
        extState = {
          [parentField]:{
            ...state[parentField],
            ...extState,
          },
        };
      }
      return {
        ...state,
        ...extState
      }
    },
  },
  subscriptions: {
    addWatch() {
      addResizeWatch();
    }
  },
};

function addResizeWatch(){
  window.addEventListener('resize',() => {
    updateModel('global',{
      resizeSign:random(),
    });
  })
}
