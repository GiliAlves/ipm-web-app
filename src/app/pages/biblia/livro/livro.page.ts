import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import * as _ from 'lodash';
import { Bible, Books, Commentaries, Stories, Verses } from 'src/app/interfaces/biblia.interface';

@Component({
  selector: 'app-livro',
  templateUrl: './livro.page.html',
  styleUrls: ['./livro.page.scss'],
})
export class LivroPage implements OnInit {
  
  public biblia: Bible = {} as Bible;
  public livro: Books = {} as Books;

  public livros!: _.Dictionary<Books[]>;
  public oldTestament!: _.Dictionary<Books[]>;
  public newTestament!: _.Dictionary<Books[]>;

  public oldSubgroupos = ['Pentateuco', 'Históricos', 'Poéticos', 'Profetas Maiores', 'Profetas Menores']
  public newSubgrupos = ['Evangelhos', 'Histórico', 'Epístolas', 'Revelação'];

  public fontSize = 14;
  public lineHeight = 18;

  public selectedBackground = 'var(--ion-color-medium)';
  public selectedColor = 'var(--ion-color-light-contrast)';
  public background = [
    { b: '#ffffff', c: '#000000' }, 
    { b: '#f4f3ed', c: '#000000'}, 
    { b: '#fff5ed', c: '#000000'}, 
    { b: '#2b2b2b', c: '#ffffff'}, 
    { b: '#263545', c: '#ffffff'}, 
    { b: '#232a33', c: '#ffffff'},
    { b: '#000000', c: '#ffffff'}
  ];

  public capitulosNumero: string[] = [];
  public capitulos: _.Dictionary<Verses[]> = {};
  public capitulo!: number;

  public versiculos: Verses[] = [];

  public titulos: Stories[] = [];
  public comentarios: Commentaries[] = [];
  
  public isResume = true;
  public isSelected = false;
  public isOpenModal = false;
  public isOpenColor = false;
  public isEditModal = false;
  public isOldTestamet = true;

  public grupos: string[] = [];

  public versiculoId: string[] = [];
  public versiculoSelected: HTMLElement[] = [];

  constructor(
    private readonly router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data: Data) => this.biblia = data['biblia']);
    this.activatedRoute.queryParamMap.subscribe(param => {
      const capitulo = param.get('capitulo');
      if (capitulo) this.selectCapitulo(capitulo)
    })
    
    this.livro = this.biblia.livro;
    this.capitulos = _.groupBy(this.biblia.versos, 'chapter');
    this.capitulosNumero = _.keys(this.capitulos);
    this.groupByLivro(this.biblia);
  }

  public groupByLivro = (biblia: Bible) => {
    const grupo = _.groupBy(biblia.livros, 'testament');
    this.oldTestament = _.groupBy(grupo['old'], 'group');
    this.newTestament = _.groupBy(grupo['new'], 'group');

    this.getOldTestament(true);
  };

  public getCapitulos = (capitulo: number) => {
    const capitulos: string[] = [];
    for (let i = 1; i <= capitulo; i++) {
      capitulos.push(`${i}`);
    }
    return capitulos;
  }

  public getOldTestament = (oldTestament: boolean) => {
    this.isOldTestamet = oldTestament;
    this.livros = oldTestament ? this.oldTestament : this.newTestament;
    this.grupos = oldTestament ? this.oldSubgroupos : this.newSubgrupos;
  };

  public resume = () => this.isResume = !this.isResume;

  private selectCapitulo = (capitulo: string) => {
    this.capitulo = +capitulo;
    this.versiculos = this.biblia.versos.filter(verso => +verso.chapter === this.capitulo);
    this.titulos = this.biblia.titulos.filter(titulo => +titulo.chapter === this.capitulo);
  }

  public prevCapitulo = (capitulo: number) => {    
    if (capitulo - 1 >= 1) {
      this.capitulo = capitulo - 1;
      this.router.navigate([], { queryParams: { capitulo: this.capitulo } });
    } else {
      let index = (this.biblia.livros.findIndex(livro => livro.book_number === this.livro.book_number));
      let livro = this.biblia.livros[index === 0 ?  65 : index - 1];    
      this.capitulo = livro.chapters;      
      this.router.navigate([`/biblia/${livro.book_number}`], { queryParams: { capitulo: livro.chapters }});
    }
  }

  public nextCapitulo = (capitulo: number) => {
    if (capitulo + 1 <= this.livro.chapters) {
      this.capitulo = capitulo + 1;
      this.router.navigate([], { queryParams: { capitulo: this.capitulo } });
    } else {
      let index = (this.biblia.livros.findIndex(livro => livro.book_number === this.livro.book_number));
      let livro = this.biblia.livros[index === 65 ?  0 : index + 1];
      this.capitulo = 1; 
      this.router.navigate([`/biblia/${livro.book_number}`], { queryParams: { capitulo: 1 }});
    } 
  }

  public openEditModal = (open: boolean) => {
    console.log(open);
    
    this.isEditModal = open;}

  public getComentarios() {
    return this.biblia.comentarios.filter(coment => coment.book_number === this.livro.book_number && coment.chapter_number_from === this.capitulo);
  }

  public innerHTMLClick(event: Event) {        
    if (event.type === 'click') {
      const element = event.target as HTMLElement;
      
      if (element.id) {
        if (this.versiculoId.includes(element.id)) {
          this.versiculoId.splice(this.versiculoId.findIndex((id) => id === element.id), 1);
          const index = this.versiculoSelected.findIndex(({id}) => id === element.id);
          this.versiculoSelected[index].style.removeProperty('border-bottom-style');
          this.versiculoSelected.splice(index, 1);
        } else {
          this.versiculoId.push(element.id);
          this.versiculoSelected.push(document.getElementById(element.id) as HTMLElement);
          const index = this.versiculoSelected.findIndex(({id}) => id === element.id)
          this.versiculoSelected[index].style.borderBottomStyle = 'dashed';
        }
        this.versiculoSelected = _.sortBy(this.versiculoSelected, 'id');
        this.isOpenModal = this.versiculoSelected.length ? true : false;
      }
    }
  }

  public selectColor = (color: string) => {
    if (this.versiculoSelected.length) {
      this.versiculoSelected.forEach((versiculo) => {
        (versiculo.style.backgroundColor === this.hexToRgb(color)) ? versiculo.style.removeProperty('background-color') : versiculo.style.backgroundColor = color;

        this.removeSelecteVersiculos();
      });
    }
  }

  public setFontSize = (value: boolean) => {
    if (value && this.fontSize < 40) {
      this.fontSize += 1;
      this.lineHeight += 1;
    } else if (this.fontSize > 10) {
      this.fontSize -= 1;
      this.lineHeight -= 1;
    }
    console.log(this.fontSize, this.lineHeight);
    
  }

  public selectBackgroundColor = (color: { b: string, c: string }) => {
    this.selectedBackground = color.b;
    this.selectedColor = color.c;
  }

  private removeSelecteVersiculos = () => {
    this.versiculoSelected.map((versiculo) => versiculo.style.removeProperty('border-bottom-style'));
    this.versiculoId = [];
    this.versiculoSelected = [];
    setTimeout(() => this.isOpenModal = false, 800);
  }
  private hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
  }

  public generateHTML(bookNumber: number, chapter: number): string {
    const verses = this.versiculos.filter(verse => verse.book_number === bookNumber && verse.chapter === chapter);
    const stories = this.titulos.filter(story => story.book_number === bookNumber && story.chapter === chapter);

    let html = '';

    verses.forEach(verse => {
      stories.forEach(story => { if (verse.verse === story.verse) html += this.getRef(story.title) });

      let verseText = verse.text;

      verseText = verseText
        .replaceAll(/<pb\/>/g, `<br/><strong class="ion-margin-start">${verse.verse}</strong>`)
        .replaceAll('<n>[1]</n>', `<br/><strong class="ion-margin-start">${verse.verse}</strong>`)
        .replaceAll(/<t>/g, `<p class="ion-no-margin"><i>`)
        .replaceAll(/<\/t>/g, '</i></p>')
        .replaceAll('<f>', '<ion-note>')
        .replaceAll('</f>', '</ion-note>')
        .replaceAll('<pb/><e>', '<i>')
        .replaceAll('<e>', '<i>')
        .replaceAll('</e>', '</i>')
      
      html += `${verseText.includes(`<br/><strong class="ion-margin-start">${verse.verse}</strong>`) ? '' : `<strong>${verse.verse}</strong>`} <span id="${verse.verse}">${verseText}</span>`;
    });
    
    return html
  }

  public getRef = (title: string) => {
    if (title.includes('<x>')) {
      const ref = title.replaceAll('<x>', '').replaceAll('</x>', '').split(' ');
      const livro = this.biblia.livros.filter(livro => livro.book_number === +ref[0])[0];

      return `<p class="ion-no-margin">${livro.short_name + ' ' + ref[1]}</p>`;
    }
    
    return `<h5>${title}</h5>`
  }

  public formataComentario = (comentario: string) => comentario.replace(/<a[^>]*>([^<]*)<\/a>/g, '$1');

  public clipboard = async () => await Clipboard
    .write({ string: `"` + this.versiculoInnerText() + `"` + '\n' + this.livro.name + ' ' + this.capitulo + '.' + this.versiculosLength() })
    .finally(() => this.removeSelecteVersiculos());

  public share = async () => await Share
    .share({
      title: this.livro.name + ' ' + this.capitulo + '.' + this.versiculosLength(),
      text: `"` + this.versiculosLength() + ' ' + this.versiculoInnerText() + `"`,
      dialogTitle: this.livro.name + ' ' + this.capitulo + '.' + this.versiculosLength()
    }).finally(() => this.removeSelecteVersiculos());

  private versiculoInnerText = () => this.versiculoSelected.map(({id, innerText}) => id + ' ' + innerText.trim()).join('\n');

  private versiculosLength = () => this.versiculoSelected.length < 1
      ? this.versiculoSelected[0].id : this.versiculoSelected[0].id + '-' + this.versiculoSelected[this.versiculoSelected.length - 1].id;
}
