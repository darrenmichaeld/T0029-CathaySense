import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import pandas as pd
import json

# Load JSON file into a Pandas DataFrame
with open("db-tester.json", "r") as f:
    data = json.load(f)

df = pd.json_normalize(data['flights'])

def send_email(recipient_email, subject, body, sender_email, sender_password):
    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        
        text = msg.as_string()
        server.sendmail(sender_email, recipient_email, text)
        server.quit()
        
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email. Error: {str(e)}")

def send_or_not(departure_origin, arrival_place, brand, threshold):
    # Filter based on departure, arrival, and brand
    resultdf = df[(df['departure_origin'] == departure_origin) & 
                  (df['arrival_place'] == arrival_place) & 
                  (df['brand'] == brand)].copy()  # Create a copy to avoid the warning
    
    # Convert 'estimated_departure' to datetime and sort
    resultdf.loc[:, 'estimated_departure'] = pd.to_datetime(resultdf['estimated_departure'])
    resultdf = resultdf.sort_values(by=['departure_origin', 'arrival_place', 'estimated_departure'])
    
    # Reset index before calculating price change
    resultdf = resultdf.reset_index(drop=True)
    
    # Calculate price change
    resultdf.loc[:, 'price_change'] = resultdf.groupby(['departure_origin', 'arrival_place'])['price_per_kg'].diff().ne(0)
    
    # Find rows with price changes, excluding the first row
    change = resultdf[resultdf['price_change'] == True].iloc[1:]
    
    if change.empty:
        print("No price changes found.")
        return
    
    idx = change.index[0]
    
    if idx >= 1:
        # Calculate the change in price
        change_in_price = change['price_per_kg'].iloc[0] - resultdf.loc[idx - 1, 'price_per_kg']
        
        # Determine if it's a price increase or decrease and send the appropriate alert
        if change_in_price > threshold:
            subject = "Price Increase Alert"
            body = (f"Dear Team,\n\n"
                   f"The price per kg for {brand} on the route from {departure_origin} to {arrival_place} "
                   f"has increased by {change_in_price:.2f} units.\n"
                   "Please be aware of this change and consider taking further actions if necessary.\n\n"
                   "Best regards,\n"
                   "Pricing Team")
            send_alert(subject, body)
        elif change_in_price * -1 > threshold:
            subject = "Price Decrease Alert"
            body = (f"Dear Team,\n\n"
                   f"The price per kg for {brand} on the route from {departure_origin} to {arrival_place} "
                   f"has decreased by {abs(change_in_price):.2f} units.\n"
                   "Please be aware of this change and consider taking further actions if necessary.\n\n"
                   "Best regards,\n"
                   "Pricing Team")
            send_alert(subject, body)

def send_alert(subject, body):
    sender_email = "christ.wilson10@gmail.com"
    sender_password = "xjrr vziq znac btyd"
    recipient_email = "vanessarvln@gmail.com"
    send_email(recipient_email, subject, body, sender_email, sender_password)

if __name__ == "__main__":
    departure_origin = sys.argv[1]
    arrival_place = sys.argv[2]
    brand = sys.argv[3]
    threshold = float(sys.argv[4])
    send_or_not(departure_origin, arrival_place, brand, threshold)