import DefineComponent from "../DefineComponent";
import {createPortal} from "react-dom";

/**
 * body布局
 */
export default class PortalMod extends DefineComponent {

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
      document.body.removeChild(container);
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
    const {container} = this.state;
    return container && createPortal(this.props.children,container);
  }
}
