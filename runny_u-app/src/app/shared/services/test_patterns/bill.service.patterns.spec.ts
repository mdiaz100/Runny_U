import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BillService } from '../bill.service';

describe('BillService Patterns', () => {
  let service: BillService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Arrange
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BillService],
    });
    service = TestBed.inject(BillService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Clean up
    httpMock.verify();
  });

  it('debería estar creado', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  it('debería obtener las facturas de un usuario (AAA + Fluent)', () => {
    // Arrange
    const mockUserId = '123';
    const mockBills = [
      { id: '1', amount: 1000, date: '2025-01-01' },
      { id: '2', amount: 2000, date: '2025-02-01' },
    ];

    // Act
    service.getBillsByUser(mockUserId).subscribe((bills) => {
      // Assert (Fluent + legible)
      expect(Array.isArray(bills)).toBeTrue(); // nativo
      expect(bills.length).toBe(2);
      expect(bills).toEqual(mockBills);
      expect(bills[0].amount).toBeGreaterThan(0);
      expect(bills[0].id).toBeDefined();
    });

    // HTTP mock expectations
    const req = httpMock.expectOne(`http://localhost:3000/api/v1/bill/user/${mockUserId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBills);
  });
});
