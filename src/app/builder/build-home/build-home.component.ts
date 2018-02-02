import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Form } from '@angular/forms/src/directives/form_interface';
import { IHttpCall, Json2TS } from '../../core/httpcall';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { RestXService } from '../../rest-x.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-build-home',
  templateUrl: './build-home.component.html',
  styleUrls: ['./build-home.component.css']
})
export class BuildHomeComponent implements OnInit, OnDestroy {

  $results: Observable<HttpResponse<any>> = null;
  rsub: Subscription;
  results: any;
  fullResponse: HttpResponse<any> = null;
  error: HttpErrorResponse;
  tsInterface: Json2TS = null;

  constructor(private rest: RestXService) { }

  getcall(c: IHttpCall) {
    this.results = null;
    this.error = null;
    this.tsInterface = null;
    this.$results = this.rest.getRest(c.rawURL, c.params, c.headers).pipe(
      tap( data => console.log(data) ));
      this.rsub = this.$results.subscribe(
        (r: HttpResponse<any>) => {
          this.results = r.body;
          this.fullResponse = r;
        },
        (err: HttpErrorResponse) => {
          if (err.name !== 'TypeError') {
            this.error = err;
          } else {
            console.log(err);
          }
        }
      );

  /*   this.results.subscribe( result => {
      console.log(result);
  }); */
  }
  genTS(raw: any) {
    this.tsInterface = new Json2TS('IQuery', raw);
    console.log(this.tsInterface.output());
  }

  ngOnInit() {
  }

  ngOnDestroy() {
     this.rsub.unsubscribe();
  }

}
