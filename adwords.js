//Adwords JS
var apiUrl = 'http://www.YOURWEBSITE.COM/priceapi.php/?ean=';

function main() {
  var adGroup,
      adGroupIterator = AdWordsApp.adGroups().get();
  
  // If we couldn't find the Ad Group, log an error and halt.
  while (adGroupIterator.hasNext()) {
    adGroup = adGroupIterator.next();
    if (adGroup) {
      if (adGroup.getName().indexOf('|EAN')>0) {
         var eanSplit =  adGroup.getName().split('|EAN');
         var ean = eanSplit[1];
         Logger.log('Found ean: '+ean);
        
         var grabbedInfo = UrlFetchApp.fetch(apiUrl+ean);
        Logger.log('grabbedInfo: '+grabbedInfo);
        if (grabbedInfo) {
          grabbedInfo = grabbedInfo.toString().split('|');
          var priceUse = grabbedInfo[0];
          var stock =  grabbedInfo[1];
          updateAdParameterValues(adGroup, '€'+priceUse, stock, ean);
        }
      } else {
        Logger.log('No EAN found for: '+adGroup.getName());
      }
    } else {
      Logger.log('Could not locate AdGroup with name ' + AD_GROUP_NAME);
    }
  }
}

function getAdGroup(name) {
  var adGroupIterator = AdWordsApp.adGroups()
      .withCondition('Name = "' + name + '"')
      .withLimit(1)
      .get();
  if (adGroupIterator.hasNext()) {
    return adGroupIterator.next();
  }
}

function updateAdParameterValues(adGroup, price, stock, ean) {
  // Note that due to the way previewing works, this script won't
  // update ad params for newly created keywords.
  
  if (stock == 0 ) {
    adGroup.pause();
    adGroup.applyLabel('OutOfStock');
    var foo  = UrlFetchApp.fetch(apiUrl+ean+'&stockreport=1');
    Logger.log('0 Stock disabled: '+ean);
  } else {
    var keywordIter = adGroup.keywords().get();
    Logger.log('Price update: '+price);
    while (keywordIter.hasNext()) {
      var keyword = keywordIter.next();
      keyword.setAdParam(1, price);
      if (typeof stock !== "undefined" && stock > 0) {
        keyword.setAdParam(2, stock);
      }
      Logger.log('Price bij kw: '+keyword);
    }
    if (hasLabel(adGroup, 'OutOfStock')) {
      adGroup.removeLabel('OutOfStock');
      adGroup.enable(); 
    }
  }
}

function hasLabel(obj, label) {
 return obj.labels().withCondition("Name = '" + label + "'").get().hasNext();
}
