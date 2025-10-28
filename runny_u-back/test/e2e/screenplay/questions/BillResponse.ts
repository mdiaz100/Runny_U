import { Question, Actor, notes } from '@serenity-js/core';
import { BillResponse as BillResponseType } from '../models/BillRequest';

export class BillResponse {
  static list(): Question<Promise<BillResponseType[]>> {
    return Question.about<Promise<BillResponseType[]>>('bills list', async (actor: Actor) => {
      const data = await actor.answer(notes().get('lastResponseData'));
      return data || [];
    });
  }

  static count(): Question<Promise<number>> {
    return Question.about<Promise<number>>('bills count', async (actor: Actor) => {
      const data = await actor.answer(notes().get('lastResponseData'));
      return Array.isArray(data) ? data.length : 0;
    });
  }

  static billByNumber(numberBill: number): Question<Promise<BillResponseType | undefined>> {
    return Question.about<Promise<BillResponseType | undefined>>(
      `bill with number ${numberBill}`,
      async (actor: Actor) => {
        const data: BillResponseType[] = await actor.answer(notes().get('lastResponseData'));
        return data?.find(bill => bill.numberBill === numberBill);
      }
    );
  }

  static totalOfBill(numberBill: number): Question<Promise<number>> {
    return Question.about<Promise<number>>(
      `total of bill ${numberBill}`,
      async (actor: Actor) => {
        const data: BillResponseType[] = await actor.answer(notes().get('lastResponseData'));
        const bill = data?.find(b => b.numberBill === numberBill);
        return bill?.total || 0;
      }
    );
  }

  static itemsCountOfBill(numberBill: number): Question<Promise<number>> {
    return Question.about<Promise<number>>(
      `items count of bill ${numberBill}`,
      async (actor: Actor) => {
        const data: BillResponseType[] = await actor.answer(notes().get('lastResponseData'));
        const bill = data?.find(b => b.numberBill === numberBill);
        return bill?.items?.length || 0;
      }
    );
  }

  static statusCode(): Question<Promise<number>> {
    return Question.about<Promise<number>>('HTTP status code', async (actor: Actor) => {
      const status = await actor.answer(notes().get('lastResponseStatus'));
      return status || 0;
    });
  }
}