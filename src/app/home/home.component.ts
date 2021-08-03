import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { debounceTime } from 'rxjs/operators';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public canvasHumidity: any; // HTML canvas
  public ctxHumidity: any; // context for HTML canvas
  public chartHumidity: any; // chart object for Chart.js

  public humiditySensorReading: any; // form input of new sensor value
  public temperatureSensorReading: any;

  public historicalHumidity: any[]; // stored data from Firebase (or hardcoded for testing)

  public currentSensorReadings: any; // current sensor readings for a given collection

  constructor(private firestore: AngularFirestore) {
    this.historicalHumidity = [];
  }

  ngOnInit(): void {
    this.initHumidityChart();

    let docNameCurrent = 'current'; // only storing the current sensor readings
    let docNameHistoric = this.buildHistoricDocName(); // storing an array of all sensor readings for the time bucket

    this.currentSensorReadings = this.firestore
      .collection('manufProcess')
      .doc(docNameCurrent)
      .valueChanges(); // attach to the observable so HTML updated
    this.firestore
      .collection('manufProcess')
      .doc(docNameCurrent)
      .valueChanges()
      .pipe(
        debounceTime(200)
      )
      .subscribe((data) => {
        if (data && data.hasOwnProperty('humidity'))
          this.addDataToChart(this.chartHumidity, '', data['humidity']); // when the 'current' doc changes, place the new humidity value in the chart
      });

    this.firestore
      .collection('manufProcess')
      .doc(docNameHistoric)
      .ref.get()
      .then((doc) => {
        // get the current hour's historical readings just once (without an observable)
        if (doc.exists) {
          let data = doc.data();
          let measurements = data['historicalMeasurements'];

          console.log('measurements', measurements);

          for (let i = 0; i < measurements.length; i++) {
            let measurement = measurements[i];
            let humidity = measurement['humidity'];
            this.addDataToChart(this.chartHumidity, '', humidity);
          }
        }
      })
      .catch((error) => {
        console.log('Error getting historical doc:', error);
      });

    this.randomizeSensorReadings(); // set our form inputs to random values
  }

  initHumidityChart() {
    this.canvasHumidity = document.getElementById('chartHumidity');
    this.ctxHumidity = this.canvasHumidity.getContext('2d');
    this.chartHumidity = new Chart(this.ctxHumidity, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Humidity',
            data: [],
            fill: false,
            borderColor: 'rgb(44, 11, 179)',
            borderWidth: 1,
            pointStyle: 'rectRot',
            pointRadius: 2,
            pointBorderColor: 'rgb(0, 0, 0)',
            tension: 0.1,
          }
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Chart of Chemical Process Variables'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  randomizeSensorReadings() {
    this.humiditySensorReading = this.generateRandomInt(0, 100);
    this.temperatureSensorReading = this.generateRandomInt(60, 80);
  }

  generateRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  insertData() {
    let docNameCurrent = 'current'; // only storing the current sensor readings
    let docNameHistoric = this.buildHistoricDocName(); // storing an array of all sensor readings for the time bucket

    this.firestore.collection('manufProcess').doc(docNameCurrent).set({
      humidity: this.humiditySensorReading,
      temperature: this.temperatureSensorReading,
      timestamp: firebase.firestore.Timestamp.now(),
    });

    this.firestore
      .collection('manufProcess')
      .doc(docNameHistoric)
      .set(
        {
          historicalMeasurements: firebase.firestore.FieldValue.arrayUnion({
            humidity: this.humiditySensorReading,
            temperature: this.temperatureSensorReading,
            timestamp: firebase.firestore.Timestamp.now(),
          }),
        },
        { merge: true }
      ); // provides an update and creates the doc if it doesn't exist

    this.randomizeSensorReadings(); // generate new random values for next time
  }

  buildHistoricDocName() {
    let now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth() + 1 + ''; // javascript months are zero-based, so add 1
    let day = now.getDate() + '';
    let hour = now.getHours() + '';

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    hour = 'h' + hour;

    return [year, month, day, hour].join('_'); // ex: '2021_05_13_h09'
  }

  addDataToChart(chart:any, label: string, data: number) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset: any) => {
      dataset.data.push(data);
    });
    chart.update();
  }
}
