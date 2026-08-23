import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
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
export class DateTimePickerComponent implements ControlValueAccessor {

  @Input() placeholder = 'dd / mm / aaaa — --:--';


  /* =========================================================
     ESTADO
     ========================================================= */

  aberto = false;

  desabilitado = false;


  /* =========================================================
     DATA CONFIRMADA
     ========================================================= */

  valor: Date | null = null;


  /* =========================================================
     DATA EM EDIÇÃO
     ========================================================= */

  dataEdicao: Date | null = null;


  /* =========================================================
     MÊS VISUALIZADO
     ========================================================= */

  mesVisualizado = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );


  /* =========================================================
     HORA / MINUTO
     ========================================================= */

  horaEdicao = 12;

  minutoEdicao = 0;


  /* =========================================================
     CONTROL VALUE ACCESSOR
     ========================================================= */

  private onChange: (value: string | null) => void = () => { };

  private onTouched: () => void = () => { };


  constructor(
    private elementRef: ElementRef
  ) { }


  /* =========================================================
     VALUE ACCESSOR
     ========================================================= */

  writeValue(value: string | null): void {

    if (!value) {

      this.valor = null;

      return;
    }

    const data = this.parseValue(value);

    this.valor = data;
  }


  registerOnChange(
    fn: (value: string | null) => void
  ): void {

    this.onChange = fn;
  }


  registerOnTouched(
    fn: () => void
  ): void {

    this.onTouched = fn;
  }


  setDisabledState(isDisabled: boolean): void {

    this.desabilitado = isDisabled;
  }


  /* =========================================================
     ABRIR / FECHAR
     ========================================================= */

  abrir(): void {

    if (this.desabilitado) {
      return;
    }

    this.iniciarEdicao();

    this.aberto = true;

    this.onTouched();
  }


  fechar(): void {

    this.aberto = false;
  }


  alternar(): void {

    if (this.aberto) {

      this.fechar();

    } else {

      this.abrir();
    }
  }


  /* =========================================================
     CLIQUE FORA
     ========================================================= */

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {

    if (!this.aberto) {
      return;
    }

    const target = event.target as Node;

    if (!this.elementRef.nativeElement.contains(target)) {

      this.fechar();
    }
  }


  /* =========================================================
     INICIAR EDIÇÃO
     ========================================================= */

  private iniciarEdicao(): void {

    if (this.valor) {

      this.dataEdicao = new Date(this.valor);

      this.mesVisualizado = new Date(
        this.valor.getFullYear(),
        this.valor.getMonth(),
        1
      );

      this.horaEdicao = this.valor.getHours();

      this.minutoEdicao = this.valor.getMinutes();

      return;
    }


    const agora = new Date();

    this.dataEdicao = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate()
    );

    this.mesVisualizado = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      1
    );

    this.horaEdicao = agora.getHours();

    this.minutoEdicao = agora.getMinutes();
  }


  /* =========================================================
     CALENDÁRIO
     ========================================================= */

  get diasCalendario(): CalendarDay[] {

    const ano = this.mesVisualizado.getFullYear();

    const mes = this.mesVisualizado.getMonth();

    const primeiroDia = new Date(
      ano,
      mes,
      1
    );

    const diaSemanaInicio = primeiroDia.getDay();

    const diasNoMes = new Date(
      ano,
      mes + 1,
      0
    ).getDate();

    const diasNoMesAnterior = new Date(
      ano,
      mes,
      0
    ).getDate();


    const dias: CalendarDay[] = [];


    /* =====================================================
       DIAS DO MÊS ANTERIOR
       ===================================================== */

    for (
      let i = diaSemanaInicio - 1;
      i >= 0;
      i--
    ) {

      const dia = diasNoMesAnterior - i;

      const data = new Date(
        ano,
        mes - 1,
        dia
      );

      dias.push(
        this.criarDia(
          data,
          false
        )
      );
    }


    /* =====================================================
       DIAS DO MÊS ATUAL
       ===================================================== */

    for (
      let dia = 1;
      dia <= diasNoMes;
      dia++
    ) {

      const data = new Date(
        ano,
        mes,
        dia
      );

      dias.push(
        this.criarDia(
          data,
          true
        )
      );
    }


    /* =====================================================
       DIAS DO PRÓXIMO MÊS
       ===================================================== */

    let proximoDia = 1;

    while (dias.length < 42) {

      const data = new Date(
        ano,
        mes + 1,
        proximoDia
      );

      dias.push(
        this.criarDia(
          data,
          false
        )
      );

      proximoDia++;
    }


    return dias;
  }


  private criarDia(
    date: Date,
    currentMonth: boolean
  ): CalendarDay {

    return {
      date,

      day: date.getDate(),

      currentMonth,

      selected: this.ehMesmaData(
        date,
        this.dataEdicao
      ),

      today: this.ehMesmaData(
        date,
        new Date()
      )
    };
  }


  /* =========================================================
     SELECIONAR DIA
     ========================================================= */

  selecionarDia(day: CalendarDay): void {

    this.dataEdicao = new Date(
      day.date.getFullYear(),
      day.date.getMonth(),
      day.date.getDate()
    );


    if (!day.currentMonth) {

      this.mesVisualizado = new Date(
        day.date.getFullYear(),
        day.date.getMonth(),
        1
      );
    }
  }


  /* =========================================================
     NAVEGAÇÃO
     ========================================================= */

  mesAnterior(): void {

    this.mesVisualizado = new Date(
      this.mesVisualizado.getFullYear(),
      this.mesVisualizado.getMonth() - 1,
      1
    );
  }


  proximoMes(): void {

    this.mesVisualizado = new Date(
      this.mesVisualizado.getFullYear(),
      this.mesVisualizado.getMonth() + 1,
      1
    );
  }


  /* =========================================================
     HOJE
     ========================================================= */

  selecionarHoje(): void {

    const agora = new Date();

    this.dataEdicao = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate()
    );

    this.horaEdicao = agora.getHours();

    this.minutoEdicao = agora.getMinutes();

    this.mesVisualizado = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      1
    );
  }


  /* =========================================================
     HORA
     ========================================================= */

  selecionarHora(hora: number): void {

    this.horaEdicao = hora;
  }


  /* =========================================================
     MINUTO
     ========================================================= */

  selecionarMinuto(minuto: number): void {

    this.minutoEdicao = minuto;
  }


  /* =========================================================
     APLICAR
     ========================================================= */

  aplicar(): void {

    if (!this.dataEdicao) {
      return;
    }


    const data = new Date(
      this.dataEdicao.getFullYear(),
      this.dataEdicao.getMonth(),
      this.dataEdicao.getDate(),
      this.horaEdicao,
      this.minutoEdicao
    );


    this.valor = data;


    this.onChange(
      this.formatValue(data)
    );


    this.fechar();
  }


  /* =========================================================
     LIMPAR
     ========================================================= */

  limpar(): void {

    this.valor = null;

    this.dataEdicao = null;

    this.onChange(null);

    this.fechar();
  }


  /* =========================================================
     VALOR EXIBIDO
     ========================================================= */

  get valorFormatado(): string {

    if (!this.valor) {
      return '';
    }


    const dia = String(
      this.valor.getDate()
    ).padStart(2, '0');


    const mes = String(
      this.valor.getMonth() + 1
    ).padStart(2, '0');


    const ano = this.valor.getFullYear();


    const hora = String(
      this.valor.getHours()
    ).padStart(2, '0');


    const minuto = String(
      this.valor.getMinutes()
    ).padStart(2, '0');


    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }


  /* =========================================================
     MÊS FORMATADO
     ========================================================= */

  get mesAnoFormatado(): string {

    const texto = this.mesVisualizado.toLocaleDateString(
      'pt-BR',
      {
        month: 'long',
        year: 'numeric'
      }
    );


    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }


  /* =========================================================
     HORAS
     ========================================================= */

  get horas(): number[] {

    return Array.from(
      { length: 24 },
      (_, i) => i
    );
  }


  /* =========================================================
     MINUTOS
     ========================================================= */

  get minutos(): number[] {

    return [
      0,
      5,
      10,
      15,
      20,
      25,
      30,
      35,
      40,
      45,
      50,
      55
    ];
  }


  /* =========================================================
     FORMATAÇÃO
     ========================================================= */

  private formatValue(
    date: Date
  ): string {

    const ano = date.getFullYear();

    const mes = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
      date.getDate()
    ).padStart(2, '0');

    const hora = String(
      date.getHours()
    ).padStart(2, '0');

    const minuto = String(
      date.getMinutes()
    ).padStart(2, '0');


    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
  }


  /* =========================================================
     PARSE
     ========================================================= */

  private parseValue(
    value: string
  ): Date | null {

    const match = value.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
    );


    if (!match) {
      return null;
    }


    return new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4]),
      Number(match[5])
    );
  }


  /* =========================================================
     COMPARAÇÃO DE DATAS
     ========================================================= */

  private ehMesmaData(
    a: Date | null,
    b: Date | null
  ): boolean {

    if (!a || !b) {
      return false;
    }


    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }
}