# Generating credentials:
#   go to the project in Firebase > Settings (gear icon) >
#   Project settings > Service Account (tab) > "Generate new private key"
#   import file into project directory `/_pythonSensor/` as `data.privateKey.json`

import os
import sys
from time import sleep
from datetime import datetime
import random
import argparse

from google.cloud import firestore
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

credentials_path = './data.privateKey.json'
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path

cred = credentials.Certificate(credentials_path)
firebase_admin.initialize_app(cred)

# unicode string is the default in Python 3
# f string evaluates at runtime of the program
COLLECTION_NAME = 'manufProcess'

def build_historic_doc_name():
    date = datetime.today().strftime('%Y_%m_%d')        # ex: '2021_08_02'
    hour = datetime.today().strftime('%H')
    return f'{date}_h{hour}'

def parse_args():
    parser = argparse.ArgumentParser(description='Sensor simulator')
    # parser.add_argument('-o','--once', action='store_true', help='Simulate sensor simulation s...once')         # doesn't take in a value (stores as True/False)
    parser.add_argument('-c','--count', default=20, type=int, help='Count of sensor simulations to run')
    parser.add_argument('-p','--pause', default=5.0, type=float, help='Pause in seconds between sensor simulations')
    args = vars(parser.parse_args())
    return args

if __name__ == '__main__':
    args = parse_args()
    simulation_count = args['count']                        # how many simulations to run
    sleep_time = args['pause']                              # how long to sleep between runs in milliseconds

    print(f'sleep time: {sleep_time}')
    print(f'simulating {simulation_count} reads')

    db = firestore.Client()

    humidity = random.randint(0,100)                    # [a, b], start the humidity at some random value
    humidity_max_delta = 10

    for _ in range(simulation_count):
        doc_current = 'current';                       # only storing the current sensor readings
        doc_historic = build_historic_doc_name();      # storing an array of all sensor readings for the time bucket

        humidity = random.randint(max(0, humidity - humidity_max_delta), min(100, humidity + humidity_max_delta))                    # [a, b]
        temperature = random.randint(60, 80)
        print(f'humidity: {humidity}, temperature: {temperature}')

        data = {
            'humidity': humidity,
            'temperature': temperature,
            'timestamp': datetime.utcnow(),                # use utcnow() instead of now(), otherwise the timezone offset will be applied twice
        }
        doc_ref = db.collection(COLLECTION_NAME).document(doc_current)
        doc_ref.set(data)

        data = {
            'historicalMeasurements': firestore.ArrayUnion( [{
                'humidity': humidity,
                'temperature': temperature,
                'timestamp': datetime.utcnow(),                # use utcnow() instead of now(), otherwise the timezone offset will be applied twice
            }] )
        }
        doc_ref = db.collection(COLLECTION_NAME).document(doc_historic)
        doc_ref.set(data, merge=True)

        if simulation_count == 1:                           # don't pause when there's a single simulation to run
            sys.exit(0)

        sleep(sleep_time)
