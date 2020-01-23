import $ from "jquery";

const maxResult = 10;
const QUERY = `&q=`;
const ROWS = `&rows`;
const START = `&start=`;
const SORT = `&sort=`;
const JSON = `&wt=json`;
const INDENT = `&indent=on`;
const FIELDS = 'fl=';

class Query {

    constructor(url, path){
        this.url = url;
        this.path = path;
    }

    set rows(rows){
        this._rows = (rows > maxResult)? maxResult : rows;
    }

    next(){
        if(this.hasNext()){
            return new Promise((resolve, reject) => {
                let offset = this.offset;
                this.offset = this.offset + this._rows;
                $.ajax({
                    url: this.url + this.path,
                    data: `?` + this.buildFieldParams(this.fields) + this.buildQueryParams(this.query, offset, this._rows, this.sort), 
                    dataType: 'jsonp',
                    jsonp: 'json.wrf',
                    success: (res) => {
                        if(this.resultSize == undefined) this.resultSize = res.response.numFound;
                        resolve(res);
                    },
                    error: reject
                });
            });
        }
        else throw 'Query has returned a complete result set';
    }

    hasNext(){
        return (this.resultSize == undefined || (this.resultSize != undefined && this.resultSize > this.offset));
    }

    reset(){
        this.offset = 0;
    }

    getURLSearchParams(){
        return `?` + this.buildFieldParams(this.fields) + this.buildQueryParams(this.query, offset, this._rows, this.sort);
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