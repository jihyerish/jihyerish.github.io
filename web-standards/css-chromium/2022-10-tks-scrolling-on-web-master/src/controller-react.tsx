import Controls from "./controls";
import TKSTable from "./tkstable"
import DLManager from "./dlmanager";
import RUI from '@bbkit/sys-ui-web/rui';

const { React, Renderer } = RUI;
const _ = Renderer.Assign;
const render = Renderer.render;

// necessary for state variables that are functions because setX behaves differently when
// passed a value vs a function
export interface FnObject {
    fn: () => void
}

type CheckboxHandler = (active: boolean) => void;

export interface Modifiers {
    toggleScrollTest: () => void;
    changeHorLinesHandler: CheckboxHandler;
    changeVertLinesHandler: CheckboxHandler;
    toggleColResizersInBody: CheckboxHandler;
    toggleFixedFirstPane:  CheckboxHandler;
    toggleFixedLastPane: CheckboxHandler;
    changeAltRowHeightsAndPaddingsHandler: CheckboxHandler;
    changeDisplayWholeRowsHandler: CheckboxHandler;
    changeStartIndicesAtOneHandler: CheckboxHandler;
    changeBorderHandler: CheckboxHandler;
    changeFixedRightColHandler: CheckboxHandler;
    changeFixedRowsHandler: CheckboxHandler;
    changeKeepColResizerEdgeInViewHandler: CheckboxHandler;
    useTrueRandomHandler: (active: boolean) => void;
    changeLongTextHandler: () => void;
    updateRowsHandler: () => void;
    insertRowsHandler: (numRows: number) => void;
    deleteRowsHandler: (numRows: number) => void;
    moveRowsDownHandler: (on: boolean) => void;
    moveRowsRandomlyHandler: (on: boolean) => void;
    addRemoveRowsHandler: () => void;
    reverseRowsHandler: () => void;
    toggleColVisibility: () => void;
}

export default function Controller() {
    const [dlm, setDlm] = React.useState(() => {
        return new DLManager;
    });
    const [dataSources, setDataSources] = React.useState(() => {
        dlm.buildPipeline();
        return dlm.getSources();
    });

    const [updateRowStop, setUpdateRowStop] = React.useState(undefined as FnObject | undefined);
    function updateRowsHandler(): void {
        if (updateRowStop !== undefined) {
            updateRowStop.fn();
            setUpdateRowStop(undefined);
        }
        else {
            const intervalId = setInterval(
                () => { dlm.performUpdateRows(); },
                0);
            setUpdateRowStop({
                fn: clearInterval.bind(null, intervalId)
            });
        }
    }

    const [addRemoveStop, setAddRemoveStop] = React.useState(undefined as FnObject | undefined);
    function addRemoveRowsHandler(): void {
        if (addRemoveStop !== undefined) {
            addRemoveStop.fn();
            setAddRemoveStop(undefined);
        } else {
            const intervalId = setInterval(
                () => { dlm.performAddRemoveRows(); },
                0);
            setAddRemoveStop({
                fn: clearInterval.bind(null, intervalId)
            });
        }
    }

    const [reverseRowsStop, setReverseRowsStop] = React.useState(undefined as FnObject | undefined);
    function reverseRowsHandler(): void {
        if (reverseRowsStop !== undefined) {
            reverseRowsStop.fn();
            setReverseRowsStop(undefined);
        } else {
            const intervalId = setInterval(
                    () => { dlm.performReverseRows(); },
                    0
                );
            setReverseRowsStop({
                fn: clearInterval.bind(null, intervalId)
            });
        }
    }

    function insertRowsHandler(numRows: number): void {
        dlm.insertRows(numRows);
    }

    function deleteRowsHandler(numRows: number): void {
        dlm.deleteRows(numRows);
    }

    function useTrueRandomHandler(active: boolean) {
        dlm.useTrueRandomStrings = active;
        dlm.buildPipeline();

        setDataSources(dlm.getSources());
    }

    function changeLongTextHandler() {
        dlm.changeLongText();
    }

    const [moveRowHandler, setMoveRowHandler] = React.useState(undefined as FnObject | undefined);
    function moveRowsDownHandler(on: boolean) {
        setMoveRowHandler(on ? { fn: dlm.moveBottomRowToTop.bind(dlm) } : undefined);
    }
    function moveRowsRandomlyHandler(on: boolean) {
        setMoveRowHandler(on ? { fn: dlm.moveRandomRow.bind(dlm) } : undefined);
    }

    const [colVisibility, setColVisibility] = React.useState(true);
    function toggleColVisibility() {
        setColVisibility(!colVisibility);
    }

    const [toggleScrollTest, setToggleScrollTest] = React.useState(false);
    const [scrollTestLabel, setScrollTestLabel] = React.useState("Scroll Test");
    const [horGridLines, setHorGridLines] = React.useState(true);
    const [vertGridLines, setVertGridLines] = React.useState(true);
    const [colResizersInBody, setColResizersInBody] = React.useState(false);
    const [fixedFirstPane, setFixedFirstPane] = React.useState(false);
    const [fixedLastPane, setFixedLastPane] = React.useState(false);
    const [altRowHeightsAndPaddings, setAltRowHeightsAndPaddings] = React.useState(false);
    const [displayWholeRows, setDisplayWholeRows] = React.useState(false);
    const [startIndicesAtOne, setStartIndicesAtOne] = React.useState(false);
    const [border, setBorder] = React.useState(false);
    const [fixedRightCol, setFixedRightCol] = React.useState(false);
    const [fixedRows, setFixedRows] = React.useState(false);
    const [keepColResizerEdgeInView, setKeepColResizerEdgeInView] = React.useState(false);

    const tableModifiers: Modifiers = {
        toggleScrollTest: () => setToggleScrollTest(!toggleScrollTest) ,
        changeHorLinesHandler: setHorGridLines,
        changeVertLinesHandler: setVertGridLines,
        toggleColResizersInBody: setColResizersInBody,
        toggleFixedFirstPane: setFixedFirstPane,
        toggleFixedLastPane: setFixedLastPane,
        changeAltRowHeightsAndPaddingsHandler: setAltRowHeightsAndPaddings,
        changeDisplayWholeRowsHandler: setDisplayWholeRows,
        changeStartIndicesAtOneHandler: setStartIndicesAtOne,
        changeBorderHandler: setBorder,
        changeFixedRightColHandler: setFixedRightCol,
        changeFixedRowsHandler: setFixedRows,
        changeKeepColResizerEdgeInViewHandler: setKeepColResizerEdgeInView,
        useTrueRandomHandler,
        changeLongTextHandler,
        updateRowsHandler,
        insertRowsHandler,
        deleteRowsHandler,
        moveRowsDownHandler,
        moveRowsRandomlyHandler,
        addRemoveRowsHandler,
        reverseRowsHandler,
        toggleColVisibility
    };

    const options = {
        toggleScrollTest,
        horGridLines,
        vertGridLines,
        colResizersInBody,
        fixedFirstPane,
        fixedLastPane,
        altRowHeightsAndPaddings,
        displayWholeRows,
        startIndicesAtOne,
        border,
        fixedRightCol,
        fixedRows,
        keepColResizerEdgeInView
    };

    return (
        <RUI.StackPanel orientation='vertical' width={1500}>
            <Controls tableModifiers={tableModifiers}
                scrollTestLabel={scrollTestLabel} />
            <TKSTable options={options}
                dataSources={dataSources}
                moveRowHandler={moveRowHandler}
                scrollTestDone={() => setToggleScrollTest(false)}
		setScrollTestLabel={setScrollTestLabel}
                colVisibility={colVisibility} />
        </RUI.StackPanel>
    );
};
