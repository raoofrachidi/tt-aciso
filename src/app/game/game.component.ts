import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  token: null;
  submitted: boolean;
  measure_list:any[] = [];
  measures: any[] = [];
  score: null;
  cost: 0;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.submitted = false;
    this.score = null;
    this.cost = 0;
    this.route.queryParams.subscribe(params => {
      this.token = params["token"];
    });

    this.httpClient.get('https://tt.augmentedciso.com/measure?token=' + this.token).subscribe((resp: any) => {
      this.measure_list = resp
      this.measure_list.forEach((m:any) => {
        m.name = m.name.replaceAll("é", "e")
      })
    })
  }

  onSubmit() {
    this.httpClient.post("https://tt.augmentedciso.com/play?token=" + this.token, {"measures": this.measures}).subscribe((data) => {
      this.score = data["score"]
      this.submitted = true;
    })
  }

  playAgain() {
    this.score = null;
    this.cost = 0;
    this.measures = [];
    this.submitted = false;
  }

  manageMeasure(measure) {
    if (this.measures.includes(measure.identifier)) {
      let index = this.measures.indexOf(measure.identifier);
      this.measures.splice(index, 1);
      this.cost -= measure.cost
    } else {
      if (this.measures.length < 3) {
        this.measures.push(measure.identifier)
        this.cost += measure.cost
      }
    }
  }

}
