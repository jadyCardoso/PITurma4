import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../cliente/shared/cliente.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { OutputCliente } from '../cliente/shared/cliente.model';
import { Cartao } from '../../Cartoes/shared/cartao.model';
import { LoginClienteService } from '../cliente/shared/loginCliente.service';


@Component({
  selector: 'app-dados-cliente',
  templateUrl: './dados-cliente.component.html',
  styleUrls: ['./dados-cliente.component.css'],
  providers: [NgbModalConfig, NgbModal]
})

export class DadosClienteComponent implements OnInit {

  cliente = JSON.parse(localStorage.getItem("cliente"));
  idUsuario: string;

  responseFormularioMeusDados: any;
  responseCidadesByUf: any;

  planos = {
    plano1: 1,
    plano2: 2,
    plano3: 3
  }

  confirmacao = {
    senhaNova: '',
    senhaConfirmacao: '',
    senhaAtual: '',
    mensagem: '',
    cartaoAtual: null
  };

  password = document.getElementById("cadastro-senha-nova")
  confirm_password = document.getElementById("cadastro-senha-nova2");

  outputCliente: OutputCliente = {
    loginUsuario: {
      idUsuario: null,
      dsSenha: '',
      dsEmail: ''
    },
    usuario: {
      idUsuario: null,
      idGenero: null,
      idEspMedica: null,
      idUfCrm: null,
      idTipoUsuario: null,
      nmNome: '',
      dtNascimento: '',
      nrCpf: '',
      nrCrm: '',
      dsEndImg: '',
      idPreco: null,
      enderecos: [{
        idEndereco: null,
        dsEndereco: '',
        dsComplemento: '',
        dsBairro: '',
        nrCep: '',
        cidade: null,
        idUf: null
      }
      ]
    },
    ddd: '',
    celular: '',
    contrato: {
      idContrato: null,
      dsContrato: '',
      dtVigencia: '',
      plano: {
        idPlano: null,
        nmPlano: '',
        dsPlano: '',
        vlPlano: null,
        servicos: [{
          idServicoPlano: null,
          dsServico: ''
        }]
      },
      idUsuario: null
    },
    cartao: {
      idCartao: null,
      usuario: null,
      nrCartao: null,
      codSeguranca: null,
      dtValidade: '',
      dtEmissao: '',
      nmNome: ''
    }
  }



  constructor(private clienteService: ClienteService,
    private loginService: LoginClienteService,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.idUsuario = this.cliente.idUsuario;
    this.getFormularioMeusDados();
  }

  getFormularioMeusDados() {
    this.clienteService.getFormularioMeusDados().subscribe(
      response => {
        console.log(response);
        this.responseFormularioMeusDados = response;

        this.outputCliente = this.responseFormularioMeusDados.inputCliente;
        this.outputCliente.loginUsuario.dsSenha = "";
        //this.confirmacao.senhaAtual = this.outputCliente.loginUsuario.dsSenha;
        this.confirmacao.cartaoAtual = this.outputCliente.cartao;

        this.getCidadesByUf();
      }
    )
  }

  getCidadesByUf() {
    this.clienteService.getCidadesByUf(this.outputCliente.usuario.enderecos[0].cidade.uf.idUf).subscribe(
      response => {
        this.responseCidadesByUf = response;
      }
    )
  }

  open(content) {
    this.modalService.open(content);
  }

  alterarDadosCliente() {
    console.log(this.outputCliente);

    this.clienteService.alteraDadosCliente(Number(this.idUsuario), this.outputCliente).subscribe(
      response => {
        alert("Dados alterados com sucesso.");
        this.router.navigate([`/area-cliente`]);
      },
      error => {
        console.log(error)
        alert('Algo inesperado aconteceu.');
      }
    )
  }

  selecaoPlano(event, content): void {
    const id = event.target.id;

    switch (id) {
      case "1":
        if (confirm("Deseja alterar o plano?")) {
        this.outputCliente.contrato.plano.idPlano = 1
        event.target.enabled
        }
        break;
      case "2":
        if (confirm("Deseja alterar o plano?")) {
          this.outputCliente.contrato.plano.idPlano = 2
          this.open(content)
        }
        break;
      case "3":
        if (confirm("Deseja alterar o plano?")) {
          this.outputCliente.contrato.plano.idPlano = 3
          this.open(content)
        }
        break;
    }
  }

  limparCartao(): void {
    console.log(this.outputCliente.cartao)
    this.outputCliente.cartao = this.confirmacao.cartaoAtual;

    this.outputCliente.contrato.plano.idPlano = 1;

    console.log(this.outputCliente.cartao)
    this.modalService.dismissAll();
  }

  ver() {
    console.log(this.outputCliente)
  }

  conferirSenha(): void {
    this.loginService.conferirSenha(this.outputCliente.loginUsuario.dsSenha).subscribe(
      response => {
        console.log(response.mensagem);
        //this.confirmacao.mensagem = response.mensagem;
        this.confirmacao.mensagem = "";
      },
      error => {
        console.log(error.error.mensagem);
        this.confirmacao.mensagem = error.error.mensagem;
      }
    )
  }

}