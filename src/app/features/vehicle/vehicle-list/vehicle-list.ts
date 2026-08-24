import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Vehicle } from '../services/vehicle';
import { VehicleShortResponse } from '../../../shared/models/vehicle-short-response';
import { NotificationService } from '../../../core/services/notification';


const TAMANHO_PAGINA = 5;


@Component({
  selector: 'app-vehicle-list',
  imports: [FormsModule],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss'
})
export class VehicleList implements OnInit {
  private vehicleService = inject(Vehicle);
  private notification = inject(NotificationService);
  private router = inject(Router);


  veiculos = signal<VehicleShortResponse[]>([]);

  termoBusca = signal('');
  paginaAtual = signal(1);
  totalRegistros = signal(0);
  totalPaginas = signal(1);

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

  paginasVisiveis = computed(() => {
    const total = this.totalPaginas();
    const atual = this.paginaAtual();
    const paginas: (number | '...')[] = [];

    for (let pagina = 1; pagina <= total; pagina++) {
      const proximoAoInicio = pagina <= 2;
      const proximoAoFim = pagina > total - 2;
      const proximoAtual = Math.abs(pagina - atual) <= 1;

      if (proximoAoInicio || proximoAoFim || proximoAtual) {
        paginas.push(pagina);
      } else if (paginas[paginas.length - 1] !== '...') {
        paginas.push('...');
      }
    }

    return paginas;
  });

  ngOnInit() {
    this.carregarVeiculos();
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

  onBuscar(termo: string) {
    this.termoBusca.set(termo);
  }

  irParaPagina(pagina: number | '...') {
    if (pagina === '...' || pagina === this.paginaAtual()) return;
    this.paginaAtual.set(pagina);
    this.carregarVeiculos();
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

  excluirVeiculo(event: Event, veiculo: VehicleShortResponse) {
    event.stopPropagation();

    if (!confirm(`Tem certeza que deseja excluir o veículo ${veiculo.licensePlate}? Essa ação não pode ser desfeita.`)) {
      return;
    }

    this.vehicleService.excluir(veiculo.id).subscribe({
      next: () => {
        this.notification.show('Veículo excluído!', 'success');
        this.carregarVeiculos();
      },
      error: () => this.notification.show('Erro ao excluir veículo.')
    });
  }
}