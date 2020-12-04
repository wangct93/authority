import DefineComponent from "../DefineComponent";
import {createPortal} from "react-dom";

/**
 * 门户
 */
export default class Portal extends DefineComponent {

  state = {
    container:null,
  };

  componentDidMount() {
    this.createElem();
  }

  componentWillUnmount() {
    this.removeElem();
  }

  removeElem(){
    const {container} = this;
    if(container){
      container.parentNode.removeChild(container);
    }
  }

  createElem(){
    const container = document.createElement('div');
    const {className,style} = this.props;
    container.className = className;
    container.style = style;
    document.body.appendChild(container);
    this.setState({
      container
    });
  }

  render() {
    const container = this.getProp('container');
    return container && createPortal(this.props.children,container);
  }
}
