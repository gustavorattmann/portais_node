import React, { Component, Fragment } from 'react';
import urlParse from '../../uteis/urlParse';
import Pubsub from 'pubsub-js';

import './Index.css';


import Menu from '../../Components/Menu/Menu';
import Filtro from '../../Components/Filtro/Filtro';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import Footer from '../../Components/Footer/Footer';
import Imoveis from '../../Components/Imoveis/Imoveis';
import Alert from '../../uteis/Alert';

import ApiService from '../../uteis/ApiService'
import ImoveisTipos from '../../uteis/ImoveisTipos';
import FiltroUtil from '../../uteis/FiltroUtil';

import 'materialize-css/dist/css/materialize.min.css';
import '../../css/principal.css';

export default class Index extends Component {

  constructor(){
    super();
    this.state = {
      cidade:{logo:'tp_imoveiscuritiba.gif'},
      menu:[],
      bairros:{itens:[],qtde:0},
      filtro:{
        quartos:[],
        vagas:[],
        tipos:[],
        tipo_negocio:['venda'],
        bairros:[],
        cidade:'',
        valorMin:[],
        valorMax:[],
        areaMin:[],
        areaMax:[],
        coluna:[],
      },
      imoveis:{itens:[],qtde:0},
      url:{},
      tipos: ImoveisTipos(),
      titulo:'Imóveis ',
      baseUrl:'',
      totalImoveis:''
    };
  }

  shouldComponentUpdate(nextProps,nextState){
    console.log(this.props);
    if(
        JSON.stringify(this.state.url) !== JSON.stringify(nextState.url)
    ||  JSON.stringify(this.state.cidade) !== JSON.stringify(nextState.cidade)
    ||  JSON.stringify(this.state.filtro) !== JSON.stringify(nextState.filtro)
    ||  JSON.stringify(this.state.titulo) !== JSON.stringify(nextState.titulo)
    ||  JSON.stringify(this.state.baseUrl) !== JSON.stringify(nextState.baseUrl)
    ||  JSON.stringify(this.state.imoveis) !== JSON.stringify(nextState.imoveis)
    ||  JSON.stringify(this.state.totalImoveis) !== JSON.stringify(nextState.totalImoveis)
    ||  JSON.stringify(this.props.location) !== JSON.stringify(nextProps.location)
    ){
      return true;
    }
    return false;


  }

  componentDidMount(){
    var url = urlParse(this.props.location);
    this.setState({url:url, baseUrl:this.props.location.pathname+this.props.location.search});
  }

  componentDidUpdate(prevProps, prevState){
    if(JSON.stringify(this.state.url) !== JSON.stringify(prevState.url)) {
      this.getCidade(this.state.url.hostname);
    }
    if( JSON.stringify(this.state.cidade) !== JSON.stringify(prevState.cidade) ) {
      this.getFiltroInicial();
    }
    if(JSON.stringify(this.state.filtro) !== JSON.stringify(prevState.filtro)) {
      FiltroUtil('atualiza',{filtro:this.state.filtro})
      this.getImoveis();
      this.getTitulo();
    }
    Pubsub.subscribe('set-filtro',(topico, valores) => {
        this.setState({filtro:valores});
    });
  }

  getFiltroInicial(){
    const valor = FiltroUtil(true, {url:this.state.url, cidade:this.state.cidade, bairros:this.state.bairros});
    this.setState({filtro:valor})
  }

  getImoveis(){
    ApiService.ListaImoveis(FiltroUtil(false,this.state.filtro))
    .then(res => {
      this.setState({imoveis:res.itens, totalImoveis:res.qtde_total});
    })
    .catch(error => {
      Alert.exibeMensagem('error','Problemas ao retorno imoveis');
    });

  }

  getCidade(host){
    ApiService.GetCidade(host)
    .then(res => {
      this.setState({cidade:res, menu:res.menu, bairros:res.bairros});
    })
    .catch(error => {
      Alert.exibeMensagem('error','Não foi possivel conectar ao banco de dados, tentaremos novamente em 5s');
    });
  }

  getTitulo() {
    let titulo = FiltroUtil('titulo');

    this.props.history.push(titulo.retornoUrl);
    this.setState({titulo:titulo.retorno,baseUrl:titulo.retornoUrl});
  }

  render(){
    return (
      <Fragment>
        <Menu logo={this.state.cidade.topo} menu={this.state.menu} cidadeLink={this.state.cidade.link} cidadeNome={this.state.cidade.nome}/>
        <div className="container">
          <Filtro bairros={this.state.bairros.itens} tipos={this.state.tipos} filtro={this.state.filtro}/>
          <Breadcrumbs filtro={this.state.filtro}/>
          <h1 className="fs-20 f-bold blue-text text-darken-4 mt-2 mb-0">{this.state.titulo}</h1>
          <h2 className="fs-16 f-bold mt-0 mb-2">{this.state.totalImoveis} imóveis encontrados</h2>
          <Imoveis {...this.state.imoveis} />
        </div>
        <Footer cidade={this.state.cidade}/>
      </Fragment>
    )
  }
}
