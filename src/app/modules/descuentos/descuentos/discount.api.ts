import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from 'src/app/myUtils/utils.service';

@Injectable({
    providedIn: 'root'
})
export class DiscountService {

    DISTCOUNT_PATH = 'discounts';

    constructor(
        private _httpClient: HttpClient,
        private utils: UtilsService) { }

    postDiscount(json: any) {
        return this._httpClient.post(this.utils.getBasicEndPoint(`${this.DISTCOUNT_PATH}/maxive`), json)
    }
}
