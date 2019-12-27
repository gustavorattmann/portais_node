import React, {Component,Fragment} from 'react';
import LinkWrapper from '../../uteis/LinkWrapper';
import 'materialize-css/dist/css/materialize.min.css';


export default class Button extends Component {

  render(){
    return (
      <Fragment>
        <div>
          <LinkWrapper to="#" data-target="filtro" className="sidenav-trigger show-on-large active">
            <div class="fixed-action-btn btn-floating btn-large blue">
              <i class="large material-icons">search</i>
            </div>
            </LinkWrapper>
        </div>
      </Fragment>
    )
  }
}
