import RUI from '@bbkit/sys-ui-web/rui';
import UI from '@bbkit/sys-ui-web/ui';
import * as C from "./constants";
import type { DLSources } from "./dlmanager";
import DetailsLabelWidget from "./detailslabelwidget";
import ResponsiveLabelWidget from "./responsivelabelwidget";
import type { FnObject } from "./controller-react";

const { React, Renderer } = RUI;
const _ = Renderer.Assign;

const {
    Table
} = RUI;

const {
    Action,
    Column,
    Cell,
    RowTemplate,
    WidgetFactory
} = Table;

export interface TableOptions {
    toggleScrollTest: boolean;
    horGridLines: boolean;
    vertGridLines: boolean;
    colResizersInBody: boolean;
    fixedFirstPane: boolean;
    fixedLastPane: boolean;
    altRowHeightsAndPaddings: boolean;
    displayWholeRows: boolean;
    startIndicesAtOne: boolean;
    border: boolean;
    fixedRightCol: boolean;
    fixedRows: boolean;
    keepColResizerEdgeInView: boolean;
}

const WidgetFactories = React.memo(function WidgetFactories() {
    return (
        <>
            <WidgetFactory name='ui_details_label_factory'
                instantiator={{
                    create: function () {
                        return new DetailsLabelWidget();
                    }
                }} />
            <WidgetFactory name='ui_responsive_label_factory'
                instantiator={{
                    create: function () {
                        return new ResponsiveLabelWidget();
                    }
                }} />
        </>
    )
});

const TitleRowTemplates = React.memo(
    function TitleRowTemplates(
        { colStateAccessoryMenu }:
            { colStateAccessoryMenu: UI.MenuList }) {

        function onColStateAccessoryClick() {
            return;
        }

        function ExtraColsSecondTemplate() {
            const extraCols = [];
            for (let colIdx = 0; colIdx < C.s_NUM_EXTRA_COLS; ++colIdx) {
                extraCols.push(
                    <Cell key={colIdx}
                        factory={C.s_USE_RESPONSIVE_LABELS ? 'ui_responsive_label_factory' : 'label'}
                        set={{
                            text: C.s_USE_RESPONSIVE_LABELS ?
                                `This is Column ${colIdx}|This is Col ${colIdx}|Column ${colIdx}|Col ${colIdx}|${colIdx}` :
                                `Col ${colIdx}`
                        }} />
                )
            }
            return <>{extraCols}</>
        }

        function ExtraColsFirstTemplate() {
            const extraCols = [];
            for (let colIdx = 0; colIdx < C.s_NUM_EXTRA_COLS; ++colIdx) {
                if (colIdx === 0) {
                    extraCols.push(
                        <Cell key={colIdx}
                            factory='label'
                            colSpan={2}
                            set={{ text: `Col ${colIdx}` }} />
                    );
                } else if (colIdx === 1) {
                    // This column is spanned by the first cell in first title
                    // row template
                } else {
                    extraCols.push(
                        <Cell key={colIdx}
                            factory='label'
                            set={{ text: `Col ${colIdx}` }} />
                    );
                }
            }
            return <>{extraCols}</>
        }

        return (
            <>
                <RowTemplate name='ui_title_tpl1'
                    style='title'
                    height={C.s_USE_AUTO_HEIGHT_TITLE_ROW ? 'auto' : '1x'}>
                    <Cell factory='label'
                        set={{
                            text: '',
                            tooltip: 'This is a Crix column'
                        }} />
                    <Cell top={{
                        right: {
                            factory: 'colstate',
                            set: {
                                dropdownContent: colStateAccessoryMenu,
                                sortDirection: null
                            },
                            on: {
                                click: onColStateAccessoryClick
                            }
                        }
                    }}
                        main={{
                            center: {
                                factory: 'ui_details_label_factory',
                                set: {
                                    text: 'Idx',
                                    detailsText: 'This is an Index Column',
                                    wordWrap: true
                                }
                            }
                        }} />
                    <Cell top={{
                        right: {
                            factory: 'colstate',
                            set: {
                                dropdownContent: null,
                                sortDirection: 'asc'
                            },
                            on: {
                                click: onColStateAccessoryClick
                            }
                        },
                    }}
                        main={{
                            center: {
                                factory: 'ui_details_label_factory',
                                set: {
                                    text: 'Security Name',
                                    detailsText: 'This is a Security Column',
                                    wordWrap: true
                                }
                            }
                        }} />
                    <ExtraColsFirstTemplate />
                </RowTemplate>

                <RowTemplate name='ui_title_tpl2'
                    style='title'>
                    <Cell factory='label'
                        set={{ text: '' }} />
                    <Cell factory={C.s_USE_RESPONSIVE_LABELS ? 'ui_responsive_label_factory' : 'label'}
                        set={{
                            text: C.s_USE_RESPONSIVE_LABELS ?
                                'This is Column B|' + 'This is Col B|' + 'Column B|' + 'Col B|' + 'B' :
                                'Col B'
                        }} />
                    <Cell factory={C.s_USE_RESPONSIVE_LABELS ? 'ui_responsive_label_factory' : 'label'}
                        set={{
                            text: C.s_USE_RESPONSIVE_LABELS ?
                                'This is Column C|' + 'This is Col C|' + 'Column C|' + 'Col C|' + 'C' :
                                'Col C'
                        }} />
                    <ExtraColsSecondTemplate />
                </RowTemplate>
            </>
        );
    });

const HeaderRowTemplates = React.memo(function HeaderRowTemplates() {
    function PermSecColumn() {
        return <Cell factory='label'
            config={{ exportValue: '<Blank>' }} />;
    }

    function ExtraCols() {
        const extraCols = [];
        for (let colIdx = 0; colIdx < C.s_NUM_EXTRA_COLS; ++colIdx) {
            extraCols.push(
                <Cell key={colIdx}
                    factory='label'
                    set={{
                        text: '@ui_text_col' + colIdx,
                        justify: 'center',
                        highlightRegex: '@ui_text_highlight'
                    }} />
            );
        }
        return <>{extraCols}</>;
    }

    function ExtraColsSummaryCol() {
        const extraCols = [];
        for (let colIdx = 0; colIdx < C.s_NUM_EXTRA_COLS; ++colIdx) {
            extraCols.push(
                <Cell key={colIdx}
                    factory='label'
                    set={{
                        text: '@ui_text_col' + colIdx,
                        justify: 'center',
                        highlightRegex: '@ui_text_highlight'
                    }}
                    action={colIdx < ~~(C.s_NUM_EXTRA_COLS / 2) ?
                        'summary_cell_action1' :
                        'summary_cell_action2'} />
            );
        }

        return <>{extraCols}</>;
    }

    function onExpanderClick(e: any) {
        e.target.expanded = !e.target.expanded
    }

    return (
        <>
            <RowTemplate name='ui_header_tpl1'
                style='header'
                spanning={true}
                height={C.s_USE_AUTO_HEIGHT_HEADER_ROW ? 'auto' : '1x'}>
                <Cell factory='crix' />
                <Cell factory='ui_details_label_factory'
                    colSpan={C.s_NUM_PERM_COLS + C.s_NUM_EXTRA_COLS - 1}
                    set={{
                        text: '@ui_text_spanning',
                        detailsText: C.s_DETAILS_TEXT,
                        wordWrap: C.s_USE_AUTO_HEIGHT_HEADER_ROW ? true : false
                    }} />
            </RowTemplate>

            <RowTemplate name='ui_header_tpl2'
                style='header'
                indicesUsed='0'>
                <Cell factory='label' />
                <Cell left={{
                    factory: 'expander',
                    set: {
                        expanded: true
                    },
                    on: {
                        click: onExpanderClick
                    }
                }}
                    center={{
                        factory: C.s_USE_RADIX_LABELS ? 'radixlabel' : 'label',
                        set: {
                            text: 'Header',
                            highlightRegex: '@ui_text_highlight'
                        }
                    }} />
                <PermSecColumn />
                <ExtraCols />

            </RowTemplate>

            <RowTemplate name='ui_header_tpl3'
                style='subheader'
                indicesUsed='0'>
                <Cell factory='label' />
                <Cell config={{
                    indent: 1
                }}
                    left={{
                        factory: 'expander',
                        set: {
                            expanded: false
                        },
                        on: {
                            click: onExpanderClick
                        }
                    }}
                    center={{
                        factory: C.s_USE_RADIX_LABELS ? 'radixlabel' : 'label',
                        set: {
                            text: 'Subheader 1',
                            highlightRegex: '@ui_text_highlight'
                        }
                    }} />
                <PermSecColumn />
                <ExtraCols />
            </RowTemplate>

            <RowTemplate name='ui_header_tpl4'
                style='summary'
                indicesUsed='0'>
                <Cell factory='label' />
                <Cell factory='label'
                    config={{ indent: 2 }}
                    set={{
                        text: 'Totals',
                        highlightRegex: '@ui_text_highlight'
                    }} />
                <PermSecColumn />
                <ExtraCols />
            </RowTemplate>

            <RowTemplate name='ui_header_tpl5'
                style='subheader'
                indicesUsed='0'>
                <Cell factory='label' />
                <Cell config={{ indent: 1 }}
                    left={{
                        factory: 'expander',
                        set: {
                            expanded: false
                        },
                        on: {
                            click: onExpanderClick
                        }
                    }} />
                <PermSecColumn />
                <ExtraColsSummaryCol />
            </RowTemplate>
        </>
    );
});

const BodyRowTemplates = React.memo(function BodyRowTemplates() {
    function PermIdxColumn() {
        return (
            <Cell factory='label'
                config={{ indent: 2 }}
                set={{
                    text: '@ui_text_index',
                    highlightRegex: '@ui_text_highlight'
                }} />
        );
    }

    let template1Cells = [];
    let template2Cells = [];

    for (let colIdx = 0; colIdx < C.s_NUM_EXTRA_COLS; ++colIdx) {
        if (colIdx === 0) {
            template1Cells.push(
                <Cell factory={C.s_USE_RADIX_LABELS ? 'radixlabel' : 'label'}
                    key={colIdx}
                    set={{
                        text: '@ui_text_col' + colIdx,
                        preText: '@ui_text_pre',
                        postText: '@ui_text_post',
                        postColor: 'ticker-delay',
                        preColor: 'verified',
                        flash: true,
                        flashColor: 'target-price',
                        justify: 'left',
                        preJustify: 'left',
                        postJustify: 'left',
                        preBold: true,
                        postBold: true,
                        preItalic: true,
                        postItalic: true,
                        bold: true,
                        ellipsis: true,
                        highlightRegex: '@ui_text_highlight'
                    }} />
            );

            template2Cells.push(
                <Cell factory={C.s_USE_RADIX_LABELS ? 'radixlabel' : 'label'}
                    key={colIdx}
                    colSpan={2}
                    config={{
                        flashBackgroundColor: 'ask'
                    }}
                    set={{
                        text: '@ui_text_col' + colIdx,
                        preText: '@ui_text_pre',
                        postText: '@ui_text_post',
                        preColor: 'emphasis',
                        postColor: 'emphasis',
                        flash: true,
                        flashColor: 'contrast',
                        justify: 'center',
                        preJustify: 'left',
                        postJustify: 'right',
                        italic: true,
                        bold: true,
                        color: 'security-identifier',
                        highlightRegex: '@ui_text_highlight'
                    }} />
            );
        } else if (colIdx === 1) {
            template1Cells.push(
                <Cell factory={C.s_USE_RADIX_LABELS ? 'radixlabel' : 'label'}
                    key={colIdx}
                    set={{
                        text: '@ui_text_col' + colIdx,
                        preText: '@ui_text_pre',
                        postText: '@ui_text_post',
                        postColor: 'ticker-delay',
                        preColor: 'positive',
                        flash: true,
                        justify: 'right',
                        preJustify: 'right',
                        postJustify: 'right',
                        bold: true,
                        postBold: true,
                        preItalic: true,
                        postItalic: true,
                        ellipsis: true,
                        highlightRegex: '@ui_text_highlight'
                    }} />
            );
        } else if (colIdx === 2) {
            template1Cells.push(
                <Cell factory={C.s_USE_RADIX_LABELS ? 'radixlabel' : 'label'}
                    key={colIdx}
                    config={{
                        backgroundColor: 'dealer-non-matching',
                        flashBackgroundColor: 'short'
                    }}
                    set={{
                        text: '@ui_text_col' + colIdx,
                        flash: true,
                        justify: 'center',
                        highlightRegex: '@ui_text_highlight'
                    }} />
            );

            template2Cells.push(
                <Cell factory={C.s_USE_RADIX_LABELS ? 'radixlabel' : 'label'}
                    key={colIdx}
                    set={{
                        text: '@ui_text_col' + colIdx,
                        flash: true,
                        flashColor: 'default',
                        justify: 'center',
                        styles: 'sys-buy-order',
                        highlightRegex: '@ui_text_highlight',
                        flashBackgroundColor: 'emphasis'
                    }} />
            );
        } else {
            const randomNumCell =
                <Cell factory={C.s_USE_ENTRIES_INSTEAD_OF_LABELS ? 'entry' : 'label'}
                    key={colIdx}
                    set={{
                        text: '@ui_text_col' + colIdx,
                        flash: true,
                        justify: 'center',
                        highlightRegex: '@ui_text_highlight'
                    }} />;

            template1Cells.push(randomNumCell);
            template2Cells.push(randomNumCell);
        }
    }

    return (
        <>
            <RowTemplate name='ui_body_tpl1'
                style='body'
                height={C.s_USE_AUTO_HEIGHT_OTHER_BODY_ROWS ? 'auto' : '1x'}>
                {/*crix*/}
                <Cell factory='label' />
                <PermIdxColumn />
                <Cell factory='label'
                    set={{
                        text: '@ui_text_security',
                        preText: '@ui_text_pre',
                        postText: '@ui_text_post',
                        preBold: true,
                        postBold: true,
                        postItalic: true,
                        postJustify: 'right',
                        preColor: 'updated',
                        postColor: 'updated',
                        color: 'security-identifier',
                        bold: true,
                        highlightRegex: '@ui_text_highlight',
                        highlightIntensity: 1,
                        ellipsis: false,
                        wordWrap: true
                    }} />
                {template1Cells}
            </RowTemplate>

            <RowTemplate name='ui_body_tpl2'
                style='body'>
                {/*crix*/}
                <Cell factory='label' />
                <PermIdxColumn />
                <Cell factory='label'
                    config={{ backgroundColor: 'source' }}
                    set={{
                        text: '@ui_text_security',
                        preText: '@ui_text_pre',
                        postText: '@ui_text_post',
                        preJustify: 'right',
                        postJustify: 'left',
                        color: 'updated',
                        justify: 'center',
                        italic: true,
                        bold: true,
                        ellipsis: true
                    }} />

                {template2Cells}
            </RowTemplate>
        </>
    );
});

function Columns({ colVisibility }: { colVisibility: boolean }) {
    const extraCols = [];
    const idxSpecialVizCol = 4;
    for (let colIdx = 0; colIdx < C.s_NUM_EXTRA_COLS; ++colIdx) {
        extraCols.push(
            <Column name={'ui_col' + colIdx}
                key={colIdx}
                minWidth={C.s_USE_AUTO_WIDTH_OTHER_COLS ? 'auto' : 60}
                maxWidth='400'
                visible={colIdx === idxSpecialVizCol ? colVisibility : true}
                flex={C.s_USE_FLEX_COLS ? 1 : 0} />
        );
    }

    return (
        <>
            <Column name='ui_crix_col'
                width={C.s_USE_AUTO_WIDTH_CRIX_COL ? 'auto' : 30}
                resizable={false}
                identity={true} />
            <Column name='ui_index_col'
                width={C.s_USE_AUTO_WIDTH_OTHER_COLS ? 'auto' : 120}
                identity={true} />
            <Column name='ui_security_col'
                width={C.s_USE_AUTO_WIDTH_OTHER_COLS ? 'auto' : 100}
                identity={true} />
            {extraCols}
        </>
    );
}

export default function TKSTable({ options, dataSources, moveRowHandler, scrollTestDone, setScrollTestLabel, colVisibility }:
    { options: TableOptions, dataSources: DLSources, moveRowHandler: FnObject | undefined, scrollTestDone: ()=>void, setScrollTestLabel: (_:string)=>void, colVisibility: boolean }) {

    const tableRef = React.useRef<UI.Table>(null);

    const colStateAccessoryMenu = new UI.MenuList();
    colStateAccessoryMenu.dataSource = [
        { content: "Option 1", checked: true },
        { content: "Option 2", checked: false },
        { content: "Option 3", enabled: false },
        {
            content: "More...", children: [
                { content: "Sub Option 1", checked: true },
                { content: "Sub Option 2", checked: false }
            ]
        }
    ];

    const titleDataSource = [
        { ui_title_tpl1: {} },
        { ui_title_tpl2: {} }
    ];

    // store prop in a ref so that performMoveRows can check current state, not the closure
    const moveRowHandlerRef = React.useRef(moveRowHandler);
    moveRowHandlerRef.current = moveRowHandler;
    performMoveRows();

    function performMoveRows() {
        if (!moveRowHandlerRef.current || !tableRef.current) {
            return;
        }

        moveRowHandlerRef.current.fn();
        tableRef.current.rendered.then(performMoveRows);
    }

    const alternateCellPadding = {
        top: 1,
        left: 5,
        bottom: 1,
        right: 5
    };

    const data = {
        d_scrollTestActive: false,
        d_scrollTestViewportStartTime: null,
        d_curPassNum: 0,
        d_scrollTestResults: [],
        d_scrollIncr: 0
    }

    const d_targetNumPasses = 4;
    const d_data = React.useRef(data);


    function onViewportScrolled() {
        d_data.current.d_curPassNum++;
        var curTime = new Date();
        // @ts-ignore
        var elapsedTime = curTime - d_data.current.d_scrollTestViewportStartTime;
        d_data.current.d_scrollTestViewportStartTime = curTime;

        d_data.current.d_scrollTestResults.push(elapsedTime);
    }

    function performScroll() {

        if (!d_data.current.d_scrollTestActive) return;

        if (d_data.current.d_scrollTestActive &&
            d_data.current.d_curPassNum >= d_targetNumPasses) {
            finishScrollTest();
            return;
        }

        var maxScrollTop = tableRef.current.scrollHeight - tableRef.current.viewportHeight;
        maxScrollTop = Math.max(maxScrollTop, 0);

        var newScrollTop = tableRef.current.scrollTop + d_data.current.d_scrollIncr;
        if (newScrollTop > maxScrollTop) {
            newScrollTop = maxScrollTop;
            d_data.current.d_scrollIncr *= -1;
            onViewportScrolled();
        }
        else if (newScrollTop < 0) {
            newScrollTop = 0;
            d_data.current.d_scrollIncr *= -1;
            onViewportScrolled();
        }

        tableRef.current.setScrollTop(newScrollTop).then(performScroll);
    }

    function scrollTestHandler() {
        if (d_data.current.d_scrollTestActive) {
            finishScrollTest();
            return;
        }

        d_data.current.d_scrollTestActive = true;

        d_data.current.d_scrollTestViewportStartTime = new Date();
        tableRef.current.scrollTop = 0;
        d_data.current.d_scrollIncr = d_data.current.d_scrollIncr >= 0 ? 500: -500;
        performScroll();
    };

    function finishScrollTest() {
        scrollTestDone();
        if (d_data.current.d_scrollTestActive === false) return;

        d_data.current.d_scrollTestActive = false;
        var results = d_data.current.d_scrollTestResults;
        var avgElapsedTime = results.reduce(function(total: any, curTime: any) {
            return total + curTime;
        }, 0) / results.length;

        var timeStrings = results.map(function(curTime: any) {
            return (curTime / 1000).toFixed(4);
        });
        var label = `${(avgElapsedTime/1000).toFixed(4)} (${timeStrings.join(' ')})`;
        setScrollTestLabel(label);

        var elapsedStr = results.reduce(function(str: any, curTime: any, curIdx: any) {
            return str + 'Pass ' + curIdx + ' time: ' + (curTime / 1000).toFixed(4) + '\n';
        }, '');

        window.alert( elapsedStr +
                     'Average time: ' + (avgElapsedTime / 1000).toFixed(4));

        d_data.current.d_scrollTestViewportStartTime = null;
        d_data.current.d_scrollTestResults = [];
        d_data.current.d_curPassNum = 0;
    }


    React.useEffect(() => {
        if (options.toggleScrollTest) {
            scrollTestHandler();
        }
        else {
            finishScrollTest();
        }


    }, [options.toggleScrollTest])


    return (
        <RUI.AnchorPanel height={1000}>
            <Table _top='0' _left='0' _bottom='0' _right='0'
                dataSource={dataSources.main[0]}
                contentZoom={0.5}
                numPanes={5}
                titleDataSource={titleDataSource}
                horGridLines={options.horGridLines}
                vertGridLines={options.vertGridLines}
                colResizersInBody={options.colResizersInBody}
                numFixedStartPanes={options.fixedFirstPane ? 1 : 0}
                numFixedEndPanes={options.fixedLastPane ? 1 : 0}
                // cellPadding={options.altRowHeightsAndPaddings ? alternateCellPadding : null}
                defaultRowHeight={options.altRowHeightsAndPaddings ? 36 : null as any as undefined}
                defaultTitleRowHeight={options.altRowHeightsAndPaddings ? 30 : null as any as undefined}
                displayWholeRows={options.displayWholeRows}
                startingIndex={options.startIndicesAtOne ? 1 : 0}
                border={options.border}
                numFixedRightCols={options.fixedRightCol ? 1 : 0}
                numFixedTopRows={options.fixedRows ? 5 : 0}
                numFixedBottomRows={options.fixedRows ? 1 : 0}
                keepColResizerEdgeInView={options.keepColResizerEdgeInView}
                ref={tableRef}>
                <_.columns>
                    <Columns colVisibility={colVisibility} />
                </_.columns>

                <_.rowTemplates>
                    <TitleRowTemplates colStateAccessoryMenu={colStateAccessoryMenu} />
                    <HeaderRowTemplates />
                    <BodyRowTemplates />
                </_.rowTemplates>

                <_.widgetFactories>
                    <WidgetFactories />
                </_.widgetFactories>

                <_.actions>
                    <Action name='summary_cell_action1'
                        // handler={(e) => { logger.info(`Cell Action ${e.targetCtx} ${e.actionName}`) }}
                        merge='true' />
                    <Action name='summary_cell_action2'
                        // handler={(e) => { logger.info(`Cell Action ${e.targetCtx} ${e.actionName}`) }}
                        merge='false' />
                </_.actions>

            </Table>
        </RUI.AnchorPanel>
    );
}
