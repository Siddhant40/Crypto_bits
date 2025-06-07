@app.route('/crypto/pastData', methods=["GET"])
def pastData():
   currency = request.args.get("currency")
   return jsonify(getPastData(currency))