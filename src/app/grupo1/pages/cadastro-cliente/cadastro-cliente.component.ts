import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseFormularioCadastro , FormularioCadastro, FormularioMeusDados, OutputCliente, Cidade} from '../cliente/shared/cliente.model';
import { ClienteService } from '../cliente/shared/cliente.service';
import { PlanosService } from '../planos/shared/planos.service';

@Component({
  selector: 'app-cadastro-cliente',
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css']
})
export class CadastroClienteComponent implements OnInit {

  constructor(private clienteService: ClienteService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.getFormularioCadastro();
    this.getCidadesByUf();
  }

  responseFormularioCadastro: any;
  responseCidadesByUf: any;

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
        idCidade: null,
        idUf: null
      }]
    },
    ddd: '',
    celular: '',
    contrato: {
      idContrato: null,
      dsContrato: '',
      dtVigencia: '',
      idPlano: null,
      idUsuario: null
    },
    cartao:{
      nmNome:'',
      idCartao:null, 
      idUsuario:null,
      nrCartao:null,
      codSeguranca:null,
      dtValidade:'',
      dtEmissao:''
    
  }
    
  }

  getFormularioCadastro() {
    this.clienteService.getFormularioCadastro().subscribe(
      response => {
        this.responseFormularioCadastro = response;
        console.log(response);
      }
    )
  }

  getCidadesByUf() {
    this.clienteService.getCidadesByUf(this.outputCliente.usuario.enderecos[0].idUf).subscribe(
      response => {
        this.responseCidadesByUf = response;
        console.log(response);
      }
    )
  }
  
  ver() {
    console.log(this.outputCliente.usuario.enderecos[0].idUf)
  }
  
  cadastrar() {
    this.clienteService.createUsuario(this.outputCliente).subscribe(
      response => {
        alert('Cadastro realizado com sucesso');
        this.router.navigate(['/area-cliente/6']);
      },
      error => 
      { console.log(error)
        
    }
    )
  }
}
