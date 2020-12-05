import {updateModel} from "../frame";
import {random} from "@wangct/util/lib/util";

export default {
  namespace: 'com',
  state: {
  },

  effects: {

  },

  reducers: {
  },
  subscriptions: {
    addResize,
  },
};

function addResize(){
  window.addEventListener('resize',() => {
    updateModel('com',{
      resizeSign:random(),
    });
  });
}
