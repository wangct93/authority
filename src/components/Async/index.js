/**
 * Created by wangct on 2019/2/1.
 */
import React, {PureComponent} from 'react';
import Loading from "../Loading";

/**
 * 异步加载
 */
export default class Async extends PureComponent {
    state = {};

    componentDidMount(){
      this.getComponent();
    }

    getComponent(){
      const {getComponent} = this.props;
      if(getComponent){
        getComponent().then(result => {
          this.setState({
            component:result.default ? result.default : result
          })
        })
      }
    }

    getLoadingView(){
      return this.props.loading || <Loading loading />;
    }

    render() {
      const {component: Com} = this.state;
      return Com ? <Com {...this.props} getComponent={undefined}/> : this.getLoadingView()
    }
}
