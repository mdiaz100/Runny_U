import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BillService } from '../bill.service';


describe('BillService', () => {
  let service: BillService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BillService],
    });
    service = TestBed.inject(BillService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería estar creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener facturas por usuario', () => {
    const mockUserId = '123';
    const mockBills = [
      { id: '1', amount: 1000, date: '2025-01-01' },
      { id: '2', amount: 2000, date: '2025-02-01' },
    ];

    service.getBillsByUser(mockUserId).subscribe((bills) => {
      expect(bills.length).toBe(2);
      expect(bills).toEqual(mockBills);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/bill/user/${mockUserId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBills);
  });
});
