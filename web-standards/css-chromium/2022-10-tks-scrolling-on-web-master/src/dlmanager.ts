import * as C from "./constants";
import DL from "@bbkit/sys-ui-web/dl";

const { ColumnType, Model, DataSource, BasicTable } = DL;

type DataValue = Record<
    string,
    | string
    | number
    | boolean
    | { expr: string }
>;

type SourceTable = BasicTable;
type TableMode = "WORKSHEET" | "BASICTABLE";

export type DLSources = {
    main: DataSource[];
};

export default class DLManager {

    d_dlModel = undefined as Model | undefined;
    d_dlHeaderTable = undefined as SourceTable | undefined;
    d_dlBodyTable = undefined as SourceTable | undefined;
    d_dlDataSources = undefined as DataSource[] | undefined;

    d_curSpanningText = C.s_DEFAULT_SPANNING_TEXT;
    d_curPreTextExp = C.s_DEFAULT_PRE_TEXT_EXP;
    d_curPostTextExp = C.s_DEFAULT_POST_TEXT_EXP;
    d_useTrueRandomStrings = false;
    d_curRandNumIdx = 0;
    d_nextIterationAddsRows = false;
    d_tableMode: TableMode = "BASICTABLE";

    constructor() {
    }

    // GETTERS/SETTERS

    get useTrueRandomStrings(): boolean {
        return this.d_useTrueRandomStrings;
    }

    set useTrueRandomStrings(x: boolean) {
        this.d_useTrueRandomStrings = x;
    }

    set useBasicTable(basic: boolean) {
        this.d_tableMode = basic ? "BASICTABLE" : "WORKSHEET";
    }

    // PUBLIC METHODS

    public buildPipeline(): void {
        // @ts-ignore
        this.d_dlModel = new Model('dl_model');
        this.d_dlHeaderTable = this.createDlHeaderTable(this.d_dlModel);
        this.d_dlBodyTable = this.createDlBodyTable(this.d_dlModel);
        this.d_dlDataSources = this.createDlDataSources(1,
            this.d_dlModel,
            this.d_dlHeaderTable,
            this.d_dlBodyTable);
    }

    public getSources(): DLSources {
        if (this.d_dlDataSources === undefined) {
            throw new Error("getSources called before buildPipeline");
        }

        return {
            main: this.d_dlDataSources
        };
    }

    public changeLongText(): void {
        if (this.d_dlHeaderTable === undefined) {
            throw new Error("changeLongText called before buildPipeline");
        }

    }

    public performAddRemoveRows(): void {
        if (this.d_dlBodyTable === undefined) {
            throw new Error("changeLongText called before buildPipeline");
        }

        if (this.d_nextIterationAddsRows) {

            const addIdx = this.d_dlBodyTable!.numRows;
            const addLen = C.s_ADD_REMOVE_NUM_ROWS;
            this.d_dlBodyTable!.insertRows(addIdx, addLen);
            const rowData = {};

            for (let rowNum = 0, rowIdx = addIdx;
                rowNum < addLen;
                ++rowNum, ++rowIdx) {
                this.populateRow(rowIdx, rowData);
            }
        }
        else {
            const removeIdx = 0;
            const removeLen = C.s_ADD_REMOVE_NUM_ROWS;
            this.d_dlBodyTable!.removeRows(removeIdx, removeLen);
        }

        this.d_nextIterationAddsRows = !this.d_nextIterationAddsRows;
    }

    public performReverseRows(): void {
        if (this.d_dlBodyTable === undefined) {
            throw new Error("changeLongText called before buildPipeline");
        }

        let startIdx = 0;
        let endIdx = this.d_dlBodyTable!.numRows - 1;
        while (startIdx < endIdx) {
            this.d_dlBodyTable!.moveRow(startIdx, endIdx);
            this.d_dlBodyTable!.moveRow(endIdx, startIdx);
            startIdx++;
            endIdx--;
        }
    }

    public performUpdateRows(): void {
        if (this.d_dlBodyTable === undefined) {
            throw new Error("changeLongText called before buildPipeline");
        }

        for (let i = 0; i < Math.ceil(this.d_dlBodyTable!.numRows * 0.05); ++i) {

            const row = ~~(this.d_dlBodyTable!.numRows * Math.random());
            const col = ~~(C.s_NUM_EXTRA_COLS * Math.random());

            const val = this.getRandomValueString();

            this.d_dlBodyTable!.setValue(row, col, val);
        }
    }

    public insertRows(numRows: number): void {
        if (this.d_dlBodyTable === undefined) {
            throw new Error("insertRows called before buildPipeline");
        }

        this.d_dlBodyTable!.insertRows(0, numRows);
        const rowData = {};

        for (let rowIdx = 0; rowIdx < numRows; ++rowIdx) {
            this.populateRow(rowIdx, rowData);
        }
    }

    public deleteRows(numRows: number): void {
        if (this.d_dlBodyTable === undefined) {
            throw new Error("deleteRows called before buildPipeline");
        }

        if (this.d_dlBodyTable!.numRows - numRows >= 0) {
            this.d_dlBodyTable!.removeRows(0, numRows);
        }
    }

    public moveBottowRowToTop(): void {
        if (this.d_dlBodyTable === undefined) {
            throw new Error("deleteRows called before buildPipeline");
        }

        this.d_dlBodyTable!.moveRow(this.d_dlBodyTable!.numRows - 1, 0);
    }

    public moveRandomRow(): void {
        if (this.d_dlBodyTable === undefined) {
            throw new Error("deleteRows called before buildPipeline");
        }

        const numRows = this.d_dlBodyTable!.numRows;
        const srcRow = ~~(Math.random() * numRows);
        const dstRow = ~~(Math.random() * numRows);
        if (srcRow !== dstRow) {
            this.d_dlBodyTable!.moveRow(srcRow, dstRow);
        }
    }

    // PRIVATE METHODS

    private populateRow(rowIdx: number, rowData: { [key: string]: string | number }): void {
        if (this.d_dlBodyTable === undefined) {
            throw new Error("populateRow called before buildPipeline");
        }

        for (let colIdx = 0; colIdx < C.s_NUM_EXTRA_COLS; ++colIdx) {
            // Extra columns all have random numbers
            const val = this.getRandomValueString();
            rowData['dl_col' + colIdx] = val;
        }

        // Index column
        rowData['dl_index_col'] = rowIdx;

        // Security column
        rowData['dl_security_col'] = 'AAPL';

        this.d_dlBodyTable.setRowValues(rowIdx, rowData);
    }

    private createDlHeaderTable(model: Model): SourceTable {

        const columns = [];
        const rows = [];

        for (let rowIdx = 0; rowIdx < C.s_NUM_HEADER_ROWS; ++rowIdx) {

            const row = [];

            // All extra columns are random numbers

            for (let colIdx = 0; colIdx < C.s_NUM_EXTRA_COLS; ++colIdx) {

                if (rowIdx === 0) {
                    columns.push({
                        name: 'dl_col' + colIdx,
                        type: ColumnType.DOUBLE
                    });
                }

                row.push(this.getRandomValueString());
            }

            // Permanent index column

            if (rowIdx === 0) {
                columns.push({
                    name: 'dl_index_col',
                    type: ColumnType.INT
                });
            }

            row.push(rowIdx);

            // Dynamic highlight keywords column

            if (rowIdx === 0) {
                columns.push({
                    name: 'dl_highlight_col',
                    type: ColumnType.STRING
                });
            }

            row.push('');

            // Dynamic spanning text column

            if (rowIdx === 0) {
                columns.push({
                    name: 'dl_spanning_text_col',
                    type: ColumnType.STRING
                });
            }

            row.push('');

            rows.push(row);
        }

        const tableConfig = {
            name: 'dl_header_table',
            columns: columns,
            rows: rows
        };
        const table = new BasicTable(model, tableConfig);

        if (this.d_useTrueRandomStrings) {
            this.d_curSpanningText = this.getRandomValueString();
        }
        else {
            this.d_curSpanningText = C.s_DEFAULT_SPANNING_TEXT;
        }

        return table;
    }

    private createDlBodyTable(model: Model) {

        const columns = [];
        const rows = [];

        for (let rowIdx = 0; rowIdx < C.s_NUM_BODY_ROWS; ++rowIdx) {

            const row = [];

            // All extra columns are random numbers

            for (let colIdx = 0; colIdx < C.s_NUM_EXTRA_COLS; ++colIdx) {

                if (rowIdx === 0) {
                    columns.push({
                        name: 'dl_col' + colIdx,
                        type: ColumnType.DOUBLE
                    });
                }

                row.push(this.getRandomValueString());
            }

            // Permanent index column

            if (rowIdx === 0) {
                columns.push({
                    name: 'dl_index_col',
                    type: ColumnType.INT
                });
            }

            row.push(rowIdx);

            // Permanent security column

            if (rowIdx === 0) {
                columns.push({
                    name: 'dl_security_col',
                    type: ColumnType.STRING
                });
            }

            if (this.d_useTrueRandomStrings) {
                row.push(this.getRandomValueString());
            }
            else {
                const secIdx = rowIdx % C.s_SECURITIES.length;
                row.push(C.s_SECURITIES[secIdx]);
            }

            // Dynamic highlight keywords column

            if (rowIdx === 0) {
                columns.push({
                    name: 'dl_highlight_col',
                    type: ColumnType.STRING
                });
            }

            row.push('');

            // Dynamic pre text column

            if (rowIdx === 0) {
                columns.push({
                    name: 'dl_pre_text_col',
                    type: ColumnType.STRING
                });
            }

            row.push('');

            // Dynamic post text column

            if (rowIdx === 0) {
                columns.push({
                    name: 'dl_post_text_col',
                    type: ColumnType.STRING
                });
            }

            row.push('');

            rows.push(row);
        }

        const tableConfig = {
            name: 'dl_body_table',
            columns: columns,
            rows: rows
        };
        const table = new BasicTable(model, tableConfig);

        return table;
    }

    private createDlDataSources(numSources: number, model: Model, headerTable: SourceTable, bodyTable: SourceTable): DataSource[] {

        const dlDataSources = [];

        for (let i = 0; i < numSources; ++i) {
            const ds = this.createDlDataSource(model,
                headerTable,
                bodyTable);
            dlDataSources.push(ds);
        }

        return dlDataSources;
    }

    private createDlDataSource(model: Model, headerTable: SourceTable, bodyTable: SourceTable): DataSource {

        const source = new DataSource(model, { name: 'dl_source' });

        this.registerDlSectionsNoTemp(source, headerTable, bodyTable);

        return source;
    }

    private registerDlHeaderRowTemplates(source: DataSource): void {

        let headerRowTpl1: DataValue = {
            ui_text_spanning: { expr: 'dl_spanning_text_col' },
            ui_text_highlight: { expr: 'dl_highlight_col' }
        };

        let headerRowTpl2: DataValue = {
            ui_text_highlight: { expr: 'dl_highlight_col' }
        };

        let headerRowTpl3: DataValue = {
            ui_text_highlight: { expr: 'dl_highlight_col' }
        };

        let headerRowTpl4: DataValue = {
            ui_text_highlight: { expr: 'dl_highlight_col' }
        };

        let headerRowTpl5: DataValue = {
            ui_text_highlight: { expr: 'dl_highlight_col' }
        };

        // Bind the extra properties to columns containing random data

        for (let colIdx = 0; colIdx < C.s_NUM_EXTRA_COLS; ++colIdx) {

            headerRowTpl1['ui_text_col' + colIdx] = {
                expr: 'dl_col' + colIdx
            };

            headerRowTpl2['ui_text_col' + colIdx] = {
                expr: 'dl_col' + colIdx
            };

            headerRowTpl3['ui_text_col' + colIdx] = {
                expr: 'dl_col' + colIdx
            };

            headerRowTpl4['ui_text_col' + colIdx] = {
                expr: 'dl_col' + colIdx
            };

            headerRowTpl5['ui_text_col' + colIdx] = {
                expr: 'dl_col' + colIdx
            };
        }

        source.addTemplate('dl_header_tpl1', [{
            ui_header_tpl1: headerRowTpl1
        }]);

        source.addTemplate('dl_header_tpl2', [{
            ui_header_tpl2: headerRowTpl2
        }]);

        source.addTemplate('dl_header_tpl3', [{
            ui_header_tpl3: headerRowTpl3
        }]);

        source.addTemplate('dl_header_tpl4', [{
            ui_header_tpl4: headerRowTpl4
        }]);

        source.addTemplate('dl_header_tpl5', [{
            ui_header_tpl5: headerRowTpl5
        }]);
    }

    private registerDlBodyRowTemplates(source: DataSource): void {
        const bodyRowTpl1: DataValue = {
            ui_text_security: { expr: 'dl_security_col' },
            ui_text_index: { expr: 'dl_index_col' },
            ui_text_pre: { expr: 'dl_pre_text_col' },
            ui_text_post: { expr: 'dl_post_text_col' },
            ui_text_highlight: { expr: 'dl_highlight_col' }
        };

        const bodyRowTpl2: DataValue = {
            ui_text_security: { expr: 'dl_security_col' },
            ui_text_index: { expr: 'dl_index_col' },
            ui_text_pre: { expr: 'dl_pre_text_col' },
            ui_text_post: { expr: 'dl_post_text_col' },
            ui_text_highlight: { expr: 'dl_highlight_col' }
        };

        // Bind the extra properties to columns containing random data

        for (let colIdx = 0; colIdx < C.s_NUM_EXTRA_COLS; ++colIdx) {

            bodyRowTpl1['ui_text_col' + colIdx] = {
                expr: 'dl_col' + colIdx
            };

            bodyRowTpl2['ui_text_col' + colIdx] = {
                expr: 'dl_col' + colIdx
            };
        }

        source.addTemplate('dl_body_tpl1', [{
            ui_body_tpl1: bodyRowTpl1
        }]);

        source.addTemplate('dl_body_tpl2', [{
            ui_body_tpl2: bodyRowTpl2
        }]);
    }

    private registerDlSectionsNoTemp(source: DataSource, headerTable: SourceTable, bodyTable: SourceTable): void {
        for (let groupIdx = 0; groupIdx < C.s_NUM_GROUPS; ++groupIdx) {

            source.appendSection("header_section",
                headerTable,
                'IF($(dl_index_col) = 0,' +
                '"dl_header_tpl1",' +
                'IF($(dl_index_col) = 1,' +
                '"dl_header_tpl2",' +
                'IF($(dl_index_col) = 2,' +
                '"dl_header_tpl3",' +
                'IF($(dl_index_col) = 3,' +
                '"dl_header_tpl4",' +
                '"dl_header_tpl5"))))',
                [[
                {
                    ui_header_tpl1: {
                        ui_text_spanning: { expr: 'dl_spanning_text_col' },
                        ui_text_highlight: { expr: 'dl_highlight_col' }
                    }
                }
            ]]);

            const bodyRowTpl1: any = {
                            ui_text_security: { expr: 'dl_security_col' },
                            ui_text_index: { expr: 'dl_index_col' },
                            ui_text_pre: { expr: 'dl_pre_text_col' },
                            ui_text_post: { expr: 'dl_post_text_col' },
                            ui_text_highlight: { expr: 'dl_highlight_col' }
            };

            for (let colIdx = 0; colIdx < C.s_NUM_EXTRA_COLS; ++colIdx) {

                bodyRowTpl1['ui_text_col' + colIdx] = {
                    expr: 'dl_col' + colIdx
                };
            }
            source.appendSection("body_section",
                bodyTable,
                'IF($(dl_index_col) % 2 = 0,' +
                '"dl_body_tpl1",' +
                '"dl_body_tpl2")',
                [[
                    { ui_body_tpl1: bodyRowTpl1 }
            ]]);
        }
    }

    private registerDlSections(source: DataSource, headerTable: SourceTable, bodyTable: SourceTable): void {

        for (let groupIdx = 0; groupIdx < C.s_NUM_GROUPS; ++groupIdx) {

            source.appendSection('header_section',
                headerTable,
                'IF($(dl_index_col) = 0,' +
                '"dl_header_tpl1",' +
                'IF($(dl_index_col) = 1,' +
                '"dl_header_tpl2",' +
                'IF($(dl_index_col) = 2,' +
                '"dl_header_tpl3",' +
                'IF($(dl_index_col) = 3,' +
                '"dl_header_tpl4",' +
                '"dl_header_tpl5"))))',
                undefined);

            source.appendSection('body_section',
                bodyTable,
                'IF($(dl_index_col) % 2 = 0,' +
                '"dl_body_tpl1",' +
                '"dl_body_tpl2")',
                undefined);
        }
    }

    private getRandomValueString() {

        return (1000 * this.getRandomValue()).toFixed(Math.floor(10 * this.getRandomValue()));
    }

    private getRandomValue() {
        if (this.d_useTrueRandomStrings) {
            return Math.random();
        }
        else {
            this.d_curRandNumIdx++;
            this.d_curRandNumIdx = this.d_curRandNumIdx % C.s_PRE_GEN_RANDS.length;
            return C.s_PRE_GEN_RANDS[this.d_curRandNumIdx];
        }
    }

};
