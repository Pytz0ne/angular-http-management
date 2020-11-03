import { ViewChild } from '@angular/core';
import { MatDialog, MatSort, PageEvent } from '@angular/material';
import { Params } from '@angular/router';
import { DateFilterComponent } from '@Root/filters/date-filter/date-filter.component';
import { FilterTypes } from '@Root/filters/filter-types.enum';
import { TypedEvent } from '@Root/typed-event';
import { FilteredDataSource } from './filtered-data-source';
import { HttpCustomParams } from './services/api/http-params.model';
import { IHttpParameterGen } from './services/api/ihttp-parameter-gen';

export class BaseTableManagement {

    public navigate = new TypedEvent<any>();

    constructor(public dialog: MatDialog,
        public displayedColumns: string[],
        public columns: Map<string, { index: number, display: string, value: boolean, editable: boolean }>,
        public filterSelectObj: {
            name: string,
            columnProp: string,
            options: { key: any, value: string }[],
            modelValue: any,
            filterType: FilterTypes
        }[]
    ) {
    }

    useFilter: string;
    activeParams: IHttpParameterGen;
    currentParams: Params;

    activeQuery: IHttpParameterGen;
    currentQuery: any;
    //#region column switch    
    columnChecked(event,
        val: { key: string, value: { index: number, display: string, value: boolean, editable: boolean } }) {
            
        if (event.checked) {
            if (!this.displayedColumns.some(f => f == val.key)) {
                this.displayedColumns.push(val.key);
                this.displayedColumns = this.displayedColumns.sort((a, b) =>
                    this.columns.get(a).index - this.columns.get(b).index
                );
            }
        }
        else
            this.displayedColumns = this.displayedColumns.filter(f => f != val.key);
    }
    //#endregion


    //#region  filters
    filterValues = {};

    getFilterSelectObj(type: FilterTypes) {
        return this.filterSelectObj.filter(f => f.filterType == type);
    }

    sortChange(sort: MatSort) {
        if (sort.direction == '') {
            this.activeQuery.FindAndRemove('sort');
        }
        else if (sort.direction == 'asc') {
            this.assignQuery('sort', sort.active);
        }
        else {
            this.assignQuery('sort', sort.active + ' desc');
        }

        let queryArr = this.activeQuery.ToArray();
        this.navigate.emit(queryArr);
    }



    filterChange(filter: {
        name: string,
        columnProp: string,
        options: { key: number, value: string }[],
        modelValue: any
    }, event) {

        if (filter.modelValue.toString() == '')
            this.activeQuery.FindAndRemove(filter.columnProp);
        else
            this.assignQuery(filter.columnProp, filter.modelValue.toString(), true);
        let queryArr = this.activeQuery.ToArray();
        this.navigate.emit(queryArr)
    }

    assignQuery(key: string, value: string, swEnable = false) {

        this.filterValues[key] = value.trim().toLowerCase();

        let exist = this.activeQuery.Find(key);
        if (exist ? exist.some(s => s.value == value) : false) {
            if (swEnable) this.activeQuery.FindAndRemove(key)
        }
        else
            this.activeQuery.Combine(HttpCustomParams.Generate(key, value));

    }

    filterDate_Click(filter, event) {
        const dialogRef = this.dialog.open(DateFilterComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result['gt']) {
                let filterGt = filter;
                filterGt.columnProp = filter.columnProp + '_gt';
                this.filterChange(filter, { target: { value: (result['gt'] as Date).toDateString() } })
            }
            if (result['lt']) {
                let filterLt = filter;
                filterLt.columnProp = filter.columnProp + '_lt';
                this.filterChange(filter, { target: { value: (result['lt'] as Date).toLocaleDateString() } })
            }
        });
    }


    getFilterObject(fullObj, key) {
        const uniqChk = [];
        fullObj.filter((obj) => {
            if (!uniqChk.includes(obj[key])) {
                uniqChk.push(obj[key]);
            }
            return obj;
        });
        return uniqChk;
    }

    //#endregion



    getServerData(event?: PageEvent) {

        this.assignQuery('page', (event.pageIndex + 1) + '');
        this.assignQuery('pageSize', event.pageSize + '');

        let queryArr = this.activeQuery.ToArray();
        this.navigate.emit(queryArr);

        return event;
    }



}
