from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
PORT=8080

def process(data):
  '''
  TODO  
  '''
  print([key for key in data])
  return data

@app.route('/analysis', methods=['POST'])
def process_analysis():
  data = request.json
  processed_data = process(data)
  return jsonify(processed_data)


if __name__ == "__main__":
    app.run(debug=True, port=PORT)