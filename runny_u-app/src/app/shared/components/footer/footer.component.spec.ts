import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente footer', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar el elemento <footer> en la plantilla', () => {
    const footerEl = fixture.debugElement.query(By.css('footer'));
    expect(footerEl).toBeTruthy();
  });

  it('debería contener el texto de derechos de autor', () => {
    const footerEl: HTMLElement = fixture.nativeElement.querySelector('footer');
    expect(footerEl.textContent).toContain('©');
  });
});


