import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as cubism from 'cubism';
import * as d3 from 'd3';

@Component({
  selector: 'cubism',
  templateUrl: './cubism.component.html',
  styleUrls: ['./cubism.component.scss']
})
export class CubismComponent implements OnInit {


  @Input() data: any = { series: "a" }

  private context: any;

  constructor(private el:ElementRef) { }

  onResize(event) {
    //console.log(event.target.innerWidth);
    this.createGraphs(this.el.nativeElement.clientWidth)
  }


  private createGraphs(width): void {
    this.context = cubism.context()
      .serverDelay(0)
      .clientDelay(0)
      .step(1e1)
      .size(width);
    var context = this.context;
    var data = this.data;
    var valueGet = function random(name,idx) {
      var value = 0,
        values = [],
        i = 0,
        last;
      return context.metric(function (start, stop, step, callback) {
        start = +start, stop = +stop;
        if (isNaN(last)) last = start;
        while (last < stop) {
          last += step;
          value = 0;
          if(data[idx]()) value = data[idx]();
          values.push(value);
        }
        callback(null, values = values.slice((start - stop) / step));
      }, name);
    }

    var accx = valueGet("Acc x",0),
      accy = valueGet("Acc y",1),
      accz= valueGet("Acc z",2);
      d3.selectAll(".axis").remove();
      d3.selectAll(".horizon").remove();
      d3.selectAll(".rule").remove();
    d3.select("#cubism").call(function (div) {

      div.append("div")
        .attr("class", "axis")
        .call(context.axis().orient("top"));

      div.selectAll(".horizon")
        .data([accx, accy, accz])
        .enter().append("div")
        .attr("class", "horizon")
        .call(context.horizon().extent([-20, 20]));

      div.append("div")
        .attr("class", "rule")
        .call(context.rule());

    });
  }

  ngOnInit() {
    this.createGraphs(this.el.nativeElement.clientWidth);
  }

}