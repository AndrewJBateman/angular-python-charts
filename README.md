# :zap: Angular Python Charts

* Angular frontend chart display with a Firestore database storing data supplied by a Python backend
* **Note:** to open web links in a new window use: _ctrl+click on link_

![GitHub repo size](https://img.shields.io/github/repo-size/AndrewJBateman/angular-python-charts?style=plastic)
![GitHub pull requests](https://img.shields.io/github/issues-pr/AndrewJBateman/angular-python-charts?style=plastic)
![GitHub Repo stars](https://img.shields.io/github/stars/AndrewJBateman/angular-python-charts?style=plastic)
![GitHub last commit](https://img.shields.io/github/last-commit/AndrewJBateman/angular-python-charts?style=plastic)

## :page_facing_up: Table of contents

* [:zap: Angular Python Charts](#zap-angular-python-charts)
  * [:page_facing_up: Table of contents](#page_facing_up-table-of-contents)
  * [:books: General info](#books-general-info)
  * [:camera: Screenshots](#camera-screenshots)
  * [:signal_strength: Technologies](#signal_strength-technologies)
  * [:floppy_disk: Setup](#floppy_disk-setup)
  * [:flashlight: Testing](#flashlight-testing)
  * [:computer: Code Examples](#computer-code-examples)
  * [:cool: Features](#cool-features)
  * [:clipboard: Status & To-Do List](#clipboard-status--to-do-list)
  * [:clap: Inspiration](#clap-inspiration)
  * [:file_folder: License](#file_folder-license)
  * [:envelope: Contact](#envelope-contact)

## :books: General info

* Angular frontend shows chart data
* Angular Material components such as mat-card, mat-form, mat-input & mat-list used
* Python connects to Google Cloud Firestore database using a JSON access key file in the `/_pythonSensor` directory (ignored by Git). Random humidity and temperature data points generated - the number of points and time between samples can be specified by the user. These points are stored by Firestore with timestamps.
* Requires Pip module: google-cloud-firestore for Python backend to access Firestore database
* [Chart.js line chart](https://github.com/chartjs/Chart.js/blob/master/docs/charts/line.md#configuration-options) used to display humidity data in a line chart

## :camera: Screenshots

![Example screenshot](./img/chart.png)
![Example screenshot](./img/firestore.png)

## :signal_strength: Technologies

* [Angular v14](https://angular.io/)
* [Angular Material v14](https://material.angular.io/)
* [rxjs v7](https://rxjs.dev/) reactive extensions library
* [Firebase v9](https://firebase.google.com/)
* [Python v3.9.5](https://www.python.org/) latest version
* [Python package: google-cloud-firestore v2.2.0](https://pypi.org/project/google-cloud-firestore/)
* [Chart.js v3](https://www.chartjs.org/docs/3.7.1/)

## :floppy_disk: Setup

* `npm i` to install dependencies
* Install Python
* Install pip
* `pip install google.cloud` to install python google cloud
* `pip install firebase-admin` to install python firebase_admin
* Install pip module using `pip install --upgrade google-cloud-firestore
* Firebase console: create new project and add Firestore Database
* **Frontend:** Add firebase access credentials to app `environment` files
* **Backend** Download firebase credentials to `./data.privateKey.json`
* **Frontend:** `ng serve` for a dev server. Navigate to `http://localhost:4200/` - app will automatically reload if you change any of the source files
* **Backend:** Run `cd _pythonSensor` then `python sim.py` to run Python code to generate data points
* `ng build --prod` for a build folder

## :flashlight: Testing

* `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io). 2 out of 4 passing. No time spent on tests.

## :computer: Code Examples

* template Angular Material components used to add values to chart

```html
<mat-card-content>
  <mat-form-field class="card-form-field">
    <mat-label>Enter humidity</mat-label>
    <input matInput type="text" [(ngModel)]="humiditySensorReading" />
    <button
      *ngIf="humiditySensorReading"
      matSuffix
      mat-icon-button
      aria-label="Clear"
      (click)="humiditySensorReading = ''"
    >
      <mat-icon>close</mat-icon>
    </button>
  </mat-form-field>
  <mat-form-field class="card-form-field">
    <mat-label>Enter Temperature</mat-label>
    <input matInput type="text" [(ngModel)]="temperatureSensorReading" />
    <button
      *ngIf="temperatureSensorReading"
      matSuffix
      mat-icon-button
      aria-label="Clear"
      (click)="temperatureSensorReading = ''"
    >
      <mat-icon>close</mat-icon>
    </button>
  </mat-form-field>
</mat-card-content>
```

## :cool: Features

* Real-time plotting of data points on Angular Chart

## :clipboard: Status & To-Do List

* Status: Working
* To-Do: Add temperature data points - requires new chart

## :clap: Inspiration

* [D-I-Ry: Real-time Dashboard Charting / Plotting](https://www.youtube.com/watch?v=PY4yjjcThos&t=378s)
* [Python docs: Unicode HOWTO](https://docs.python.org/3/howto/unicode.html) - Python version used has Unicode UTF-8 strings as standard

## :file_folder: License

* N/A

## :envelope: Contact

* Repo created by [ABateman](https://github.com/AndrewJBateman), email: gomezbateman@yahoo.com
