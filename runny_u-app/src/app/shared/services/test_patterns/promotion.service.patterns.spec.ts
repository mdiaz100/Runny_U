import { TestBed } from '@angular/core/testing';
import { PromotionService } from '../promotion.service';
import { Promotion } from '../../interfaces/promotions.interface';

describe('PromotionService Patterns', () => {
  let service: PromotionService;

  //  Dummy data (estructura vacía o mínima, sin lógica)
  const dummyPromotion: Promotion = {
    badge: '',
    image: '',
    title: '',
    restaurant: '',
    description: '',
    date: '',
    time: '',
  };

  beforeEach(() => {
    //  Arrange: Configuración del entorno de prueba
    TestBed.configureTestingModule({
      providers: [PromotionService],
    });
    service = TestBed.inject(PromotionService);
  });

  //  1. Creación del servicio (FIRST)
  it('debería crearse el servicio correctamente', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  //  2. Debería retornar un arreglo de promociones (Fake)
  it('debería retornar un arreglo de promociones (Fake)', () => {
    // Act
    const promotions = service.getPromotions();

    // Assert (Fluent)
    expect(Array.isArray(promotions)).toBeTrue();
    expect(promotions).not.toBeNull();
  });

  //  3. Debería retornar exactamente 3 promociones (Stub)
  it('debería retornar exactamente 3 promociones (Stub)', () => {
    // Act
    const promotions = service.getPromotions();

    // Assert
    expect(promotions.length).toBe(3);
    expect(promotions.length).toBeGreaterThan(0);
  });

  //  4. Cada promoción debería tener las propiedades esperadas (Fluent Assertions)
  it('cada promoción debería tener las propiedades esperadas', () => {
    // Arrange
    const promotions: Promotion[] = service.getPromotions();

    // Act & Assert
    promotions.forEach((promo) => {
      expect(promo.badge).toBeDefined();
      expect(promo.image).toBeDefined();
      expect(promo.title).toBeDefined();
      expect(promo.restaurant).toBeDefined();
      expect(promo.description).toBeDefined();
      expect(promo.date).toBeDefined();
      expect(promo.time).toBeDefined();

      // Fluent checks
      expect(promo.title).not.toBe('');
      expect(typeof promo.restaurant).toBe('string');
    });
  });

  //  5. Validar contenido específico (Mock)
  it('la primera promoción debería ser el "Combo Estudiante" de Sr.Gourmet (Mock)', () => {
    // Arrange
    const mockExpectedPromotion = {
      title: 'Combo Estudiante',
      restaurant: 'Sr.Gourmet',
      badge: '20% OFF',
    };

    // Act
    const promotions = service.getPromotions();
    const firstPromo = promotions[0];

    // Assert (Fluent + AAA)
    expect(firstPromo.title).toBe(mockExpectedPromotion.title);
    expect(firstPromo.restaurant).toBe(mockExpectedPromotion.restaurant);
    expect(firstPromo.badge).toBe(mockExpectedPromotion.badge);
  });

  //  6. Simular lectura de promociones (Spy)
  it('debería llamar a getPromotions una sola vez (Spy)', () => {
    // Arrange
    const spy = spyOn(service, 'getPromotions').and.callThrough();

    // Act
    const result = service.getPromotions();

    // Assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result.length).toBeGreaterThan(0);
  });

  //  7. Validar que las promociones no estén vacías (Fluent Assertion)
  it('ninguna promoción debería tener campos vacíos', () => {
    // Act
    const promotions = service.getPromotions();

    // Assert
    promotions.forEach((promo) => {
      Object.values(promo).forEach((value) => {
        expect(value).not.toBe('');
      });
    });
  });

  //  8. Validar que todas las fechas sigan el formato esperado (FIRST principle)
  it('todas las promociones deberían tener una fecha válida (FIRST)', () => {
    // Act
    const promotions = service.getPromotions();

    // Assert
    promotions.forEach((promo) => {
      const isValidDate = !isNaN(Date.parse(promo.date));
      expect(isValidDate).toBeTrue();
    });
  });
});
