from flask import Flask, redirect, url_for, request, render_template, jsonify
from flask_cors import CORS, cross_origin
# from model import getPredictions, getPredictionsUsingLSTM, getPredictionsUsingRF, getPastData, getSettings, saveSettings, getLogs
from model import getPredictions, getPredictionsUsingRF, getPastData, getSettings, saveSettings, getLogs, getPredictionsUsingLSTM, getModelComparison
from scraper import newsScraper
from gevent.pywsgi import WSGIServer
import os
from dotenv import load_dotenv
load_dotenv()

templateDir = os.path.abspath('./template/build')
staticDir = os.path.abspath('./template/build/static')
app = Flask(__name__, static_folder = staticDir, template_folder = templateDir)
cors = CORS(app)

@app.route('/wakeup', methods=["GET"])
def wakeup():
   return "Waked Up!"

@app.route('/config/getConfig', methods=["GET"])
def getConfig():
   return getSettings()

@app.route('/config/setConfig', methods=["POST"])
def setConfig():
   data = request.json
   period = data.get('period')
   epochs = data.get('epochs')
   results = data.get('results')
   state = data.get('state')
   algorithm = data.get('algorithm')
   return jsonify(saveSettings(period, epochs, results, state, algorithm))

@app.route('/config', methods=["GET"])
def template():
   return render_template("index.html")

@app.route('/crypto/pastData', methods=["GET"])
def pastData():
   currency = request.args.get("currency")
   return jsonify(getPastData(currency))

@app.route('/crypto/predictions', methods=["GET"])
def predictions():
   currency = request.args.get("currency")
   return jsonify(getPredictions(currency))

@app.route('/crypto/predictions/LSTM', methods=["GET"])
def predictionsLSTM():
   currency = request.args.get("currency")
   return jsonify(getPredictionsUsingLSTM(currency))

@app.route('/crypto/predictions/RF', methods=["GET"]) 
def predictionsRF():
   currency = request.args.get("currency")
   return jsonify(getPredictionsUsingRF(currency))

@app.route('/crypto/model-comparison', methods=["GET"])
def modelComparison():
   currency = request.args.get("currency")
   return jsonify(getModelComparison(currency))

@app.route('/crypto/news', methods=["GET"])
def news():
   return newsScraper()

@app.route('/config/logs', methods=["GET"])
def logs():
   return getLogs()


if __name__ == '__main__':
   # Debug/Development
   app.run(debug=True, host="0.0.0.0", port="5000")
   # Production
   # http_server = WSGIServer(('0.0.0.0', 5000), app)
   # http_server.serve_forever()