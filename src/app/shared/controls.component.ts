import { Component, ViewChild } from '@angular/core';
import { CalculatedData, DataListener, DataPointListener } from "app/shared/data";
import { BaseChartDirective } from 'ng2-charts';
import { NgModule }      from '@angular/core';

@Component({
  selector: 'app-controls',
  template: `
  <div class="chart-wrapper" style="height:100px;">
    <canvas baseChart class="chart" [datasets]="accelerationChartData" [options]="mainChartOptions" [colors]="mainChartColours" [legend]="mainChartLegend" [chartType]="mainChartType" (chartClick)="chartClicked($event)"></canvas>
  </div>
  <div class="row" style="padding:10px">
    <div class="col-sm-12 col-lg-12">
      <input type="range" (input)="setIndex($event.target.value)"  [min]="sliderMin" [max]="sliderMax" class="slider" id="myRange">
    </div>
  </div>
`,
styles:[`
/* The slider itself */
.slider {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 30px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

.btn {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  height: 30px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use webkit (Chrome, Opera, Safari, Edge) and moz (Firefox) to override default look) */ 
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}`]
})
export class ControlsComponent implements DataListener, DataPointListener  {

  @ViewChild(BaseChartDirective)
  chart: BaseChartDirective;

  private chartRef:BaseChartDirective;
  public static Instance: ControlsComponent;
  private data:CalculatedData;
  private dataListeners:DataListener[] = [];
  private dataPointListeners:DataPointListener[] = [];
  private index:number = 0;
  public accelerationChartData: Array<any> = this.create3DDataArray();
  public sliderMin:number=0;
  public sliderMax:number=0;

  constructor (){
    this.registerDataListener(this);
    this.registerDataPointListener(this);
    if (ControlsComponent.Instance == undefined){
      ControlsComponent.Instance = this;
    } else {
      throw new Error("Cannot have two instances of the ControlsComponent class.");
    }
  }

  ngOnInit(): void {
    this.registerDataListener(this);
    this.registerDataPointListener(this);
    this.data = ControlsComponent.Instance.getData();
    this.DataUpdated(this.data);
  }

  public DataPointUpdated(index: number): void {
    // this.data = ControlsComponent.Instance.getData();
    // if (this.data !== undefined){
    //   var pos = this.data.boardReference.az[index].x;
    //   this.accelerationChartData[3].data = [{x:pos,y:2},{x:pos,y:0},{x:pos,y:-2}];
    // }
    
    // this.accelerationChartData = this.accelerationChartData.slice();
  }

  public DataUpdated(data: CalculatedData): void {
    this.data = ControlsComponent.Instance.getData();
    if (this.data !== undefined){
      this.accelerationChartData[0].data = this.data.boardReference.ax;
      this.accelerationChartData[1].data = this.data.boardReference.ay;
      this.accelerationChartData[2].data = this.data.boardReference.az;
      this.accelerationChartData = this.accelerationChartData.slice();
      this.sliderMax = this.data.boardReference.ax.length - 1;
    }
  }

  public chartClicked(e:any):void {
    if(e.active.length > 0){
      
      let label = e.active[0]._index;
    
      console.log("Point: "+label);
      this.index = e.active[0]._index;
      this.DataPointUpdated(this.index);
    }
  }
  
  public getData():CalculatedData{
    return this.data;
  }
  public setData(data:CalculatedData){
    this.data = data;
    this.dataChanged();
  }
  public registerDataListener(listener:DataListener){
    this.dataListeners.push(listener);
  }
  public registerDataPointListener(listener:DataPointListener){
    this.dataPointListeners.push(listener);
  }
  public setIndex(index:number){
    this.index = index;
    this.dataPointChanged();
  }
  public dataChanged(){
    this.dataListeners.forEach(l=>l.DataUpdated(this.data));
  }
  public dataPointChanged(){
    this.dataPointListeners.forEach(l=>l.DataPointUpdated(this.index));
  }
  public create3DDataArray():Array<any>{
    return [
    {
      data: [],
      label: 'X'
    },
    {
      data: [],
      label: 'Y'
    },
    {
      data: [],
      label: 'Z'
    }//,
    // {
    //   data: [{x:0,y:2},{x:0,y:-2}],
    //   label: 'Marker'
    // }
  ];
  }
  public mainChartOptions: any = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0.2,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }],
    },
    tooltips: {enabled: false}
  };
  public brandPrimary = '#20a8d8';
  public brandSuccess = '#4dbd74';
  public brandInfo = '#63c2de';
  public brandWarning = '#f8cb00';
  public brandDanger = '#f86c6b';
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: 'transparent',
      borderColor: this.brandInfo,
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: this.brandSuccess,
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: this.brandDanger,
      pointHoverBackgroundColor: '#fff'
    }
  ];
  
  public mainChartLegend = false;
  public mainChartType = 'scatter';
}