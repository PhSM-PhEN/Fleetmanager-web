import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Vehicle } from '../services/vehicle';
import { VehicleShortResponse } from '../../../shared/models/vehicle-short-response';


const TAMANHO_PAGINA = 5;


@Component({
  selector: 'app-vehicle-list',
  imports: [FormsModule],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss'
})
export class VehicleList implements OnInit {
  private vehicleService = inject(Vehicle);
  private router = inject(Router);


  veiculos = signal<VehicleShortResponse[]>([]);

  termoBusca = signal('');
  paginaAtual = signal(1);
  totalRegistros = signal(0);
  totalPaginas = signal(1);

  // Dados para os cards de resumo (frota total / disponíveis / alugados / em manutenção)
  resumoVeiculos = signal<VehicleShortResponse[]>([]);
  carregandoResumo = signal(true);

  resumoFrotaTotal = computed(() => this.resumoVeiculos().length);

  resumoDisponiveis = computed(() =>
    this.resumoVeiculos().filter((v) => v.status?.label === 'Available').length
  );

  resumoAlugados = computed(() =>
    this.resumoVeiculos().filter((v) => v.status?.label === 'Rented').length
  );

  resumoManutencao = computed(() =>
    this.resumoVeiculos().filter((v) => v.status?.label === 'Maintenance').length
  );

  veiculosFiltrados = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    if (!termo) return this.veiculos();

    return this.veiculos().filter((veiculo) =>
      veiculo.licensePlate.toLowerCase().includes(termo) ||
      veiculo.model.toLowerCase().includes(termo) ||
      veiculo.brand.toLowerCase().includes(termo)
    );
  });

  inicioIntervalo = computed(() => {
    if (this.totalRegistros() === 0) return 0;
    return (this.paginaAtual() - 1) * TAMANHO_PAGINA + 1;
  });

  fimIntervalo = computed(() => {
    return Math.min(this.paginaAtual() * TAMANHO_PAGINA, this.totalRegistros());
  });

  ngOnInit() {
    this.carregarVeiculos();
    this.carregarResumo();
  }

  carregarVeiculos() {
    this.vehicleService.listar(this.paginaAtual(), TAMANHO_PAGINA).subscribe({
      next: (response) => {
        this.veiculos.set(response.data);
        this.totalRegistros.set(response.totalCount);
        this.totalPaginas.set(response.totalPages || 1);
      }
    });
  }

  // Busca a frota completa apenas para calcular os totais do card de resumo.
  // TODO: trocar por um endpoint de resumo dedicado (ex: Vehicle/Summary) quando existir no backend,
  // para não precisar carregar todos os veículos no front.
  carregarResumo() {
    this.carregandoResumo.set(true);
    this.vehicleService.listar(1, 1000).subscribe({
      next: (response) => {
        this.resumoVeiculos.set(response.data);
        this.carregandoResumo.set(false);
      },
      error: () => this.carregandoResumo.set(false)
    });
  }

  onBuscar(termo: string) {
    this.termoBusca.set(termo);
  }

  paginaAnterior() {
    if (this.paginaAtual() <= 1) return;
    this.paginaAtual.update((pagina) => pagina - 1);
    this.carregarVeiculos();
  }

  proximaPagina() {
    if (this.paginaAtual() >= this.totalPaginas()) return;
    this.paginaAtual.update((pagina) => pagina + 1);
    this.carregarVeiculos();
  }

  abrirNovo() {
    this.router.navigate(['/vehicles/new']);
  }

  abrirDetalhe(id: number) {
    this.router.navigate(['/vehicles', id]);
  }
}