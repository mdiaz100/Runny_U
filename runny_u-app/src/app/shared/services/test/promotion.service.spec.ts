import { TestBed } from '@angular/core/testing';
import { PromotionService } from '../promotion.service';
import { Promotion } from '../../interfaces/promotions.interface';


describe('PromotionService', () => {
  let service: PromotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromotionService);
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería retornar un arreglo de promociones', () => {
    const promotions = service.getPromotions();
    expect(Array.isArray(promotions)).toBeTrue();
  });

  it('debería retornar exactamente 3 promociones', () => {
    const promotions = service.getPromotions();
    expect(promotions.length).toBe(3);
  });

  it('cada promoción debería tener las propiedades esperadas', () => {
    const promotions: Promotion[] = service.getPromotions();

    promotions.forEach((promo) => {
      expect(promo.badge).toBeDefined();
      expect(promo.image).toBeDefined();
      expect(promo.title).toBeDefined();
      expect(promo.restaurant).toBeDefined();
      expect(promo.description).toBeDefined();
      expect(promo.date).toBeDefined();
      expect(promo.time).toBeDefined();
    });
  });

  it('la primera promoción debería ser el "Combo Estudiante" de Sr.Gourmet', () => {
    const promotions = service.getPromotions();
    expect(promotions[0].title).toBe('Combo Estudiante');
    expect(promotions[0].restaurant).toBe('Sr.Gourmet');
    expect(promotions[0].badge).toBe('20% OFF');
  });
});
