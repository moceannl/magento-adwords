# magento-adwords
Automatic price and Stock updates from Magento to Adwords. This code is provided as-as. The really proper way to query Magento should be to use a Magento Extension. The PHP file here is a simple solution which just checks straight away inside the Magento database.

# Magento part
the file priceapi.php needs to go in your root-htdocs folder. Fill in yourdatabase credentials. This file assumes you have Flat Tables enables, and use an 'ean' field to identify products.

# Adwords part
The adwords.js is a s script that you need to import into your adwords account. It assumes tha your Ad groups end with the EAN numer in the following format: "Groupname|EAN123456789010". Prices are updates (for use in advertisements). When you're out of stock the ad is paused an the label 'OutOfStock' is applied.
