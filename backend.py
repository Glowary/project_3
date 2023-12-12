from flask import Flask, jsonify
from pymongo import MongoClient
import pandas as pd

# MongoDB connection string
conn_string = 'mongodb+srv://greenboi:greenboi105@cluster0.qz8kntf.mongodb.net/?retryWrites=true&w=majority'

# Create a MongoClient
client = MongoClient(conn_string)

# Select your database
db = client['RealEstateDatabase']

# Select your collection
sale_price_collection = db['RealEstateCollection']
group_collection = db['GroupCollection']

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################
@app.route("/")
def home_price():
    return (
        f"Home Page<br/>"
    )

@app.route("/updated-sale-price-data")
def updated_sale_price_data():

    """Return the updated sale price data."""
    sale_price_data = list(sale_price_collection.find())

    sale_price_df = pd.DataFrame(sale_price_data)

    sale_price_df.drop('_id', axis=1, inplace=True)

    final_sale_price_data = sale_price_df.to_dict(orient='records')

    return jsonify(final_sale_price_data)

@app.route("/group-data")
def group_data():

    """Return the group price data."""
    
    group_data = list(group_collection.find())

    group_df = pd.DataFrame(group_data)

    group_df.drop('_id', axis=1, inplace=True)
    
    final_group_data = group_df.to_dict(orient='records')

    return jsonify(final_group_data)

if __name__ == "__main__":
    app.run(host='localhost', port=8003, debug=True)
