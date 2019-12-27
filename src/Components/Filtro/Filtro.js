import React, {Component,Fragment} from 'react';
import LinkWrapper from '../../uteis/LinkWrapper';
import 'materialize-css/dist/css/materialize.min.css';
import Pubsub from 'pubsub-js';

import Checkbox from '../../uteis/input/Checkbox';
import Button from '../../uteis/input/Button';
import Select from '../../uteis/input/Select';

export default class Filtro extends Component {
  constructor(props){
    super(props);
    this.state = {
      quartos:this.props.filtro.quartos,
      vagas:this.props.filtro.vagas,
      tipos:this.props.filtro.tipos,
      tipo_negocio:this.props.filtro.tipo_negocio,
      bairros:this.props.filtro.bairros,
      cidade:this.props.filtro.cidade,
      valorMin:this.props.filtro.valorMin,
      valorMax:this.props.filtro.valorMax,
      areaMin:this.props.filtro.areaMin,
      areaMax:this.props.filtro.areaMax,
      coluna:this.props.filtro.coluna,
    };
  }

  shouldComponentUpdate(nextProps,nextState){
    if(
        JSON.stringify(this.props.filtro) !== JSON.stringify(nextProps.filtro)
        || JSON.stringify(this.state) !== JSON.stringify(nextState)
      ) {
      return true;
    }
    return false;
  }

  componentDidMount(){
    Pubsub.subscribe('atualiza-filtro',(topico, info) => {
      switch(info.filtroTipo){
        case 'bairros':
        this.setState({bairros:info.selecionados})
        break;
        case 'tipos':
        this.setState({tipos:info.selecionados})
        break;
        case 'quartos':
        let temq = [];
        if (this.state.quartos.length){
          temq = this.state.quartos.filter(item => parseInt(info.selecionado) === item);
        }
        let quartos = [];
        if ( temq.length > 0 ){
          quartos = temq.push(parseInt(info.selecionado));
        }else{
          quartos = [parseInt(info.selecionado)];
        }
        this.setState({quartos:quartos})
        break;
        case 'vagas':
        let temv = [];
        if (this.state.vagas.length){
          temv = this.state.vagas.filter(item => parseInt(info.selecionado) === item);
        }
        let vagas = [];
        if ( temv.length > 0 ){
          vagas = temv.push(parseInt(info.selecionado));
        }else{
          vagas = [parseInt(info.selecionado)];
        }
        this.setState({vagas:vagas})
        break;
        case 'tipo_negocio':
        this.setState({tipo_negocio:info.selecionados})
        break;
        case 'coluna':
        this.setState({coluna:info.selecionados})
        break;
        default:

        break;
      }
      const data = this.state;
      Pubsub.publish('set-filtro',data)
    });
  }

  componentDidUpdate(prevProps, prevState){
    if ( JSON.stringify(this.props.filtro) !== JSON.stringify(prevProps.filtro) ){
      this.setState({
        quartos:this.props.filtro.quartos,
        vagas:this.props.filtro.vagas,
        tipos:this.props.filtro.tipos,
        tipo_negocio:this.props.filtro.tipo_negocio,
        bairros:this.props.filtro.bairros,
        cidade:this.props.filtro.cidade,
        valorMin:this.props.filtro.valorMin,
        valorMax:this.props.filtro.valorMax,
        areaMin:this.props.filtro.areaMin,
        areaMax:this.props.filtro.areaMax,
        coluna:this.props.filtro.coluna,
      });
    }
  }

  pesquisa(e){
    e.preventDefault();
    Pubsub.publish('set-filtro',this.state)
  }

  render(){
    return(
      <Fragment>
        <section>
          <div className="row">
            <form onSubmit={this.pesquisa.bind(this)} className="form-escuro col s12">
              <div className="row">
                <Select name="coluna" titulo="Ordenação" valores={[{link:'ordem',nome:'Ordem'},{link:'preco-max',nome:'Preço Max'},{link:'preco-min',nome:'Preço Min'}]} selecionados={this.state.coluna}/>
                <Select name="tipos" titulo="Tipos" valores={this.props.tipos} selecionados={this.state.tipos} multiple/>
                <Select name="bairros" titulo="Bairros" valores={this.props.bairros} selecionados={this.state.bairros} multiple/>
                <Checkbox name="quartos" titulo="Quartos" valores={[1,2,3,4]} selecionados={this.state.quartos} />
                <Checkbox name="vagas" titulo="Vagas de garagem" valores={[1,2,3,4]} selecionados={this.state.vagas} />
                <input type="submit" name="envio" value="Pesquisar" className="btn" />
              </div>
              </form>
            </div>
          </section>
          <ul className="sidenav" id="filtro">
            <li className="fecharSidenav row mb-0">
              <LinkWrapper to="#" className="sidenav-close col s2 offset-s1"><i className="material-icons left blue-text text-darken-4">close</i></LinkWrapper>
            </li>
            <li className="row">
              <form onSubmit={this.pesquisa.bind(this)} className="form-escuro col s10 offset-s1">
                <div className="row">
                  <div className="input-field col s12">
                    <input type="text" name="localidade" id="localidade" className="validate"/>
                    <label for="localidade" className="active">Localidade</label>
                  </div>
                  <div className="input-field col s12">
                    <select name="tipo" id="tipo">
                      <option disabled selected>Escolha um tipo de imóvel...</option>
                      <option value="apartamento">Apartamento</option>
                      <option value="casa">Casa</option>
                      <option value="kitinete">Kitinete</option>
                      <option value="sobrado">Sobrado</option>
                    </select>
                  </div>
                  <div className="input-field col s12 condominio-check my-0 mx-auto">
                    <p className="my-0 mx-auto">
                      <label>
                        <input type="checkbox" name="condominio" className="filled-in"/>
                        <span>Condomínio</span>
                      </label>
                    </p>
                  </div>
                  <div className="input-field col s6">
                    <i className="material-icons md-18 prefix top">attach_money</i>
                    <input type="text" name="preco_minimo" id="preco_minimo" className="validate"/>
                    <label for="preco_minimo" className="active">Preço mínimo</label>
                  </div>
                  <div className="input-field col s6">
                    <i className="material-icons md-18 prefix top">attach_money</i>
                    <input type="text" name="preco_maximo" id="preco_maximo" className="validate"/>
                    <label for="preco_maximo" className="active">Preço máximo</label>
                  </div>
                  <div className="input-field col s6">
                    <i className="material-icons md-18 prefix top">terrain</i>
                    <input type="text" name="area_minima" id="area_minima" className="validate"/>
                    <label for="area_minima" className="active">Área mínima</label>
                  </div>
                  <div className="input-field col s6">
                    <i className="material-icons md-18 prefix top">terrain</i>
                    <input type="text" name="area_maxima" id="area_maxima" className="validate"/>
                    <label for="area_maxima" className="active">Área máxima</label>
                  </div>
                  <div className="input-field col s12">
                    <p>
                      <label>
                        <span className="fs-14">Quartos</span>
                      </label>
                    </p>
                    <p>
                      <div className="row">
                        <div className="col s3">
                          <label>
                            <input type="checkbox" name="quarto1" className="filled-in"/>
                            <span>1</span>
                          </label>
                        </div>
                        <div class="col s3">
                          <label>
                            <input type="checkbox" name="quarto2" className="filled-in"/>
                            <span>2</span>
                          </label>
                        </div>
                        <div className="col s3">
                          <label>
                            <input type="checkbox" name="quarto3" className="filled-in"/>
                            <span>3</span>
                          </label>
                        </div>
                        <div className="col s3">
                          <label>
                            <input type="checkbox" name="quarto4" className="filled-in"/>
                            <span>4</span>
                          </label>
                        </div>
                      </div>
                    </p>
                    <p>
                      <label>
                        <span className="fs-14">Banheiros</span>
                      </label>
                    </p>
                    <p>
                      <div className="row">
                        <div className="col s3">
                          <label>
                            <input type="checkbox" name="banheiro1" className="filled-in"/>
                            <span>1</span>
                          </label>
                        </div>
                        <div className="col s3">
                          <label>
                            <input type="checkbox" name="banheiro2" className="filled-in"/>
                            <span>2</span>
                          </label>
                        </div>
                        <div className="col s3">
                          <label>
                            <input type="checkbox" name="banheiro3" className="filled-in"/>
                            <span>3</span>
                          </label>
                        </div>
                        <div className="col s3">
                          <label>
                            <input type="checkbox" name="banheiro4" className="filled-in"/>
                            <span>4</span>
                          </label>
                        </div>
                      </div>
                    </p>
                    <p>
                      <label>
                        <span className="fs-14">Vagas</span>
                      </label>
                    </p>
                    <p>
                      <div className="row">
                        <div class="col s3">
                          <label>
                            <input type="checkbox" name="vaga1" className="filled-in"/>
                            <span>1</span>
                          </label>
                        </div>
                        <div className="col s3">
                          <label>
                            <input type="checkbox" name="vaga2" className="filled-in"/>
                            <span>2</span>
                          </label>
                        </div>
                        <div className="col s3">
                          <label>
                            <input type="checkbox" name="vaga3" className="filled-in"/>
                            <span>3</span>
                          </label>
                        </div>
                        <div className="col s3">
                          <label>
                            <input type="checkbox" name="vaga4" className="filled-in"/>
                            <span>4</span>
                          </label>
                        </div>
                      </div>
                    </p>
                  </div>
                  <button type="reset" className="btn-small blue darken-4 col s12">Limpar</button>
                </div>
              </form>
            </li>
          </ul>
          <Button/>
      </Fragment>
    )
  }
}