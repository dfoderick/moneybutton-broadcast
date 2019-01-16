# moneybutton-broadcast
Update moneybutton, price and quantity in stock on all browsers who are viewing your site.  Useful for high traffic sites with volatile product availability or pricing.

## Run Demo
Start the server.
```
node src/svc/server.js
```
Run client.html in a couple browsers to simulate users.  
Run admin.html in another browser to test admin function.  
Swipe moneybutton to simulate purchasing product.

> Use small amounts! Payout is to author unless you modify the html!

When quantity reaches 0 all client browsers will show sold out.  
In Product Admin page increase the quantity and price, click submit to update all the active money buttons.