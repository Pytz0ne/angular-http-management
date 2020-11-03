import { Injectable, EventEmitter } from '@angular/core';
import { AuthApi } from './api/auth-api';
import { EndpointFactory } from '@Services/endpoint-factory.service';
import { ConfigurationService } from '@Services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class WebapiService {

  constructor(private endpoint: EndpointFactory,

    protected configurations: ConfigurationService) {
  }

  public ErrorEvent: EventEmitter<any> = new EventEmitter<any>();

  public Auth = new AuthApi(this.endpoint);
}
