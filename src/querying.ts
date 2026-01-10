import {
    FilterLocationRequest,
    LocationRequest,
    QueryInfo_,
    QueryType
} from "../definitions/requests";
import {Sanitizer} from "./sanitizer";


export class Query implements QueryType {
    table_name = '';
    operator_connectors: string[][] = [];
    page_info: QueryInfo = null;
    private has_error = false;
    constructor(table_name: string) {
        this.table_name = table_name;
    }
    add_connector(strings: string[])  : Query  {
        if (this.verifyStringArray(strings)) {
            this.operator_connectors.push(strings);
        }
        return this;
    }
    private verifyStringArray(arr : string[]) : boolean {
        let unsanitized = false;
        let messages = [];
        arr.forEach(s => {
            if (Sanitizer.sqlSanitizer.test(s)) {
                unsanitized = true;
                messages.push(`${s} has combinations that are not allowed.\n`)
            }
        });
        if (unsanitized) {
            throw new Error('Incorrect characters.  '+ messages.join(""));
        }
        return !unsanitized;
    }
    join_connectors_with(joiner : string[])  : Query {
        if (this.verifyStringArray(joiner)) {
            const clone = [];
            let count = 0;
            for (let conn of this.operator_connectors) {
                clone.push(conn);
                count+= 1;
                if (count < this.operator_connectors.length) {
                    clone.push(joiner);
                }
            }
            this.operator_connectors = clone;
        }
        return this;
    }
    set_query_info(qi: QueryInfo)  : Query  {
        this.page_info = qi;
        return this;
    }
    make_query_info(last_val: number, rows_per_page: number)  : Query {
        this.page_info = new QueryInfo(last_val, rows_per_page, false);
        return this;
    }
    set_connectors(customquery : string[][]) : Query {
        customquery.forEach(c => {
            this.add_connector(c);
        });
        return this;
    }
    toFilterLocationRequest(location: LocationRequest) : FilterLocationRequest {
        if (this.has_error) {
            throw Error("Could not send query. Did not pass sanitation test.");
        }
        const fs : FilterLocationRequest | { filter: null, location: any} = {filter: null, location: location};
        const query : any = {
            table_name: this.table_name,
            operator_connectors: this.operator_connectors,
            page_info: this.page_info
        };
        fs.filter = query;
        return fs as FilterLocationRequest;
    }
    stringify() : string {
        if (this.has_error) {
            throw Error("Could not send query. Did not pass sanitation test.");
        }
        const query = {
            table_name: this.table_name,
            operator_connectors: this.operator_connectors,
            page_info: this.page_info
        };
        console.info("Query is", query);
        return JSON.stringify(query);
    }
    /*stringify() {
    let x = JSON.stringify(this);
    console.log("Query body for fetch: ", x);
    return x;
  }*/
}

export class QueryInfo implements QueryInfo_{
    offset = 0;
    limit = 1;
    ordered_by : string[] = [];
    asc : boolean = false;
    constructor(offset: number, limit: number,isAsc: boolean) {
        this.limit = limit;
        this.offset = offset;
        this.asc = isAsc;
    }
    addOrderer(orderOn : string) : QueryInfo {
        this.ordered_by.push(orderOn);
        return this;
    }

}