
class BaseClass{

  setProp(key,value){
    const props = value === undefined ? key : {[key]:value};
    this.props = {
      ...this.props,
      ...props,
    }
  }

  getProp(key){
    return key === undefined ? this.props : this.props[key];
  }

}

module.exports = BaseClass;
