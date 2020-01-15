export const logInfo = () => {
    console.log('logging this shit');
    console.log($);

    $.ajax({
        url: `https://ethsear.ch:8984/solr/nutch/select`,
        data: `?fl=url,%20meta_description,%20anchor,%20title&indent=on&q=content:test&wt=json`, 
        dataType: 'jsonp',
        jsonp: 'json.wrf',
        success: function(result){
            console.log(result);
        }
      });
};
