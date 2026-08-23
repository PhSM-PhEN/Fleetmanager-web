import {
  Component,
  ElementRef,
  Renderer2,
  forwardRef,
  HostListener,
  Input,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule
} from '@angular/forms';


interface CalendarDay {
  date: Date;
  day: number;
  currentMonth: boolean;
  selected: boolean;
  today: boolean;
}


@Component({
  selector: 'app-date-time-picker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './date-time-picker.html',
  styleUrl: './date-time-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ]
})
export class DateTimePickerComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {

  @Input() placeholder = 'dd/mm/aaaa --:--';

  @ViewChild('trigger') triggerRef!: ElementRef<HTMLElement>;
  @ViewChild('panel') panelRef!: ElementRef<HTMLElement>;

  aberto = false;
  desabilitado = false;

  valor: Date | null = null;
  dataEdicao: Date | null = null;

  textoDigitado = '';

  mesVisualizado = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  horaEdicao = 12;
  minutoEdicao = 0;

  private onChange: (value: string | null) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    // Move o painel para o final do <body>, assim que ele existir no DOM.
    // Isso o "liberta" do modal e de qualquer backdrop-filter.
    this.renderer.appendChild(document.body, this.panelRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.panelRef?.nativeElement.parentNode) {
      this.panelRef.nativeElement.parentNode.removeChild(this.panelRef.nativeElement);
    }
  }

  /* =========================================================
     VALUE ACCESSOR
     ========================================================= */

  writeValue(value: string | null): void {
    if (!value) {
      this.valor = null;
      this.textoDigitado = '';
      return;
    }
    const data = this.parseValue(value);
    this.valor = data;
    this.textoDigitado = this.valorFormatado;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.desabilitado = isDisabled;
  }

  /* =========================================================
     DIGITAÇÃO MANUAL
     ========================================================= */

  onTextoDigitado(texto: string): void {
    const textoComMascara = this.aplicarMascara(texto);
    this.textoDigitado = textoComMascara;

    const data = this.parseTextoManual(textoComMascara);
    if (data) {
      this.valor = data;
      this.onChange(this.formatValue(data));
    }
  }

  private aplicarMascara(texto: string): string {
    const digitos = texto.replace(/\D/g, '').slice(0, 12);

    let resultado = '';
    for (let i = 0; i < digitos.length; i++) {
      if (i === 2 || i === 4) resultado += '/';
      if (i === 8) resultado += ' ';
      if (i === 10) resultado += ':';
      resultado += digitos[i];
    }

    return resultado;
  }

  onTextoBlur(): void {
    this.onTouched();

    // Se o que foi digitado não formar uma data válida, reverte para o último valor válido.
    if (!this.parseTextoManual(this.textoDigitado)) {
      this.textoDigitado = this.valorFormatado;
    }
  }

  private parseTextoManual(texto: string): Date | null {
    const match = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
    if (!match) return null;

    const [, dia, mes, ano, hora, minuto] = match;
    const data = new Date(
      Number(ano), Number(mes) - 1, Number(dia),
      Number(hora), Number(minuto)
    );

    if (isNaN(data.getTime())) return null;
    return data;
  }

  /* =========================================================
     ABRIR / FECHAR
     ========================================================= */

  abrirCalendario(): void {
    if (this.desabilitado) return;

    this.iniciarEdicao();
    this.aberto = true;
    this.onTouched();
  }

  fechar(): void {
    this.aberto = false;
  }

  alternarCalendario(): void {
    if (this.aberto) {
      this.fechar();
    } else {
      this.abrirCalendario();
    }
  }

  /* =========================================================
     CLIQUE FORA
     ========================================================= */

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.aberto) return;

    const target = event.target as Node;
    const clicouNoTrigger = this.elementRef.nativeElement.contains(target);
    const clicouNoPainel = this.panelRef?.nativeElement.contains(target);

    if (!clicouNoTrigger && !clicouNoPainel) {
      this.fechar();
    }
  }

  /* =========================================================
     RESTANTE DA LÓGICA (igual ao que você já tinha)
     ========================================================= */

  private iniciarEdicao(): void {
    if (this.valor) {
      this.dataEdicao = new Date(this.valor);
      this.mesVisualizado = new Date(this.valor.getFullYear(), this.valor.getMonth(), 1);
      this.horaEdicao = this.valor.getHours();
      this.minutoEdicao = this.valor.getMinutes();
      return;
    }

    const agora = new Date();
    this.dataEdicao = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    this.mesVisualizado = new Date(agora.getFullYear(), agora.getMonth(), 1);
    this.horaEdicao = agora.getHours();
    this.minutoEdicao = agora.getMinutes();
  }

  get diasCalendario(): CalendarDay[] {
    const ano = this.mesVisualizado.getFullYear();
    const mes = this.mesVisualizado.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const diaSemanaInicio = primeiroDia.getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const diasNoMesAnterior = new Date(ano, mes, 0).getDate();

    const dias: CalendarDay[] = [];

    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      const dia = diasNoMesAnterior - i;
      dias.push(this.criarDia(new Date(ano, mes - 1, dia), false));
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
      dias.push(this.criarDia(new Date(ano, mes, dia), true));
    }

    let proximoDia = 1;
    while (dias.length < 42) {
      dias.push(this.criarDia(new Date(ano, mes + 1, proximoDia), false));
      proximoDia++;
    }

    return dias;
  }

  private criarDia(date: Date, currentMonth: boolean): CalendarDay {
    return {
      date,
      day: date.getDate(),
      currentMonth,
      selected: this.ehMesmaData(date, this.dataEdicao),
      today: this.ehMesmaData(date, new Date())
    };
  }

  selecionarDia(day: CalendarDay): void {
    this.dataEdicao = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate());
    if (!day.currentMonth) {
      this.mesVisualizado = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
    }
  }

  mesAnterior(): void {
    this.mesVisualizado = new Date(this.mesVisualizado.getFullYear(), this.mesVisualizado.getMonth() - 1, 1);
  }

  proximoMes(): void {
    this.mesVisualizado = new Date(this.mesVisualizado.getFullYear(), this.mesVisualizado.getMonth() + 1, 1);
  }

  selecionarHoje(): void {
    const agora = new Date();
    this.dataEdicao = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    this.horaEdicao = agora.getHours();
    this.minutoEdicao = agora.getMinutes();
    this.mesVisualizado = new Date(agora.getFullYear(), agora.getMonth(), 1);
  }

  selecionarHora(hora: number): void {
    this.horaEdicao = hora;
  }

  selecionarMinuto(minuto: number): void {
    this.minutoEdicao = minuto;
  }

  aplicar(): void {
    if (!this.dataEdicao) return;

    const data = new Date(
      this.dataEdicao.getFullYear(),
      this.dataEdicao.getMonth(),
      this.dataEdicao.getDate(),
      this.horaEdicao,
      this.minutoEdicao
    );

    this.valor = data;
    this.textoDigitado = this.valorFormatado;
    this.onChange(this.formatValue(data));
    this.fechar();
  }

  limpar(): void {
    this.valor = null;
    this.dataEdicao = null;
    this.textoDigitado = '';
    this.onChange(null);
    this.fechar();
  }

  get valorFormatado(): string {
    if (!this.valor) return '';
    const dia = String(this.valor.getDate()).padStart(2, '0');
    const mes = String(this.valor.getMonth() + 1).padStart(2, '0');
    const ano = this.valor.getFullYear();
    const hora = String(this.valor.getHours()).padStart(2, '0');
    const minuto = String(this.valor.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }

  get mesAnoFormatado(): string {
    const texto = this.mesVisualizado.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  get horas(): number[] {
    return Array.from({ length: 24 }, (_, i) => i);
  }

  get minutos(): number[] {
    return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  }

  private formatValue(date: Date): string {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    const hora = String(date.getHours()).padStart(2, '0');
    const minuto = String(date.getMinutes()).padStart(2, '0');
    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
  }

  private parseValue(value: string): Date | null {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!match) return null;
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]));
  }

  private ehMesmaData(a: Date | null, b: Date | null): boolean {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
}