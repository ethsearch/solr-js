const maxResult = 10;
const QUERY = `&q=`;
const ROWS = `&rows`;
const START = `&start`;
const SORT = `&sort=`;
const JSON = `&wt=json`;
const INDENT = `&indent=on`;
const FIELDS = 'fl=';

class Query {

    constructor(url, path, query, offset, fields, rows, sort){
        this.url = url;
        this.path = path;
        this.query = query;
        this.offset = offset;
        this.fields = fields;
        this.rows = (rows > maxResult)? maxResult : rows;
        this.sort = sort;
    }

    next(){
        if(this.resultSize == undefined || (this.resultSize != undefined && this.resultSize > this.offset)){
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: this.url + this.path,
                    data: `?` + this.buildFieldParams(this.fields) + this.buildQueryParams(this.query, this.offset, this.rows, this.sort), 
                    dataType: 'jsonp',
                    jsonp: 'json.wrf',
                    success: (res) => {
                        this.offset = this.offset + res.response.docs.length;
                        if(this.resultSize == undefined) this.resultSize = res.response.numFound;
                        console.log(this.resultSize);
                        resolve(res);
                    },
                    error: reject
                });
            });
        }
        return;
    }

    buildFieldParams(fields){
        if(fields == undefined || fields.length < 1) return;
        return FIELDS + fields;
    }

    buildQueryParams(query, offset, rows, sort) {
        let queryParams;
        if(query != undefined) queryParams = QUERY + query;
        else throw 'Query cannot be executed without a query parameter';
        
        if(rows != undefined) queryParams = queryParams + ROWS + rows;
        if(offset != undefined) queryParams = queryParams + START + offset;
        if(sort != undefined) queryParams = queryParams + SORT + sort;
        queryParams = queryParams + JSON;
        queryParams = queryParams + INDENT;
        
        return queryParams;
    }
}
export default Query;

export const sortOrder = {
    ASCENDING: 'asc',
    DESCENDING: 'desc'
}