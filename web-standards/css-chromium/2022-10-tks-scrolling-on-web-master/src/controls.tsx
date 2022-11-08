import RBLPUI from "@bbkit/sys-ui-web/rblpui";
import RUI from '@bbkit/sys-ui-web/rui';
import type { Modifiers } from "./controller-react";

const { React, Renderer } = RUI;
const _ = Renderer.Assign;


const {
    Button,
    CheckBox,
    ComboBox,
    DropdownButton,
    Label,
    MenuList,
    MenuListItem,
    StackPanel,
} = RUI;

const Separator = RUI.Separator as any;
const Slider = RUI.Slider as any;

const {
    ControlRegionTab
} = RBLPUI;

type MoveRowStatus = "NONE" | "DOWN" | "RANDOMLY";

function opRowIdxToNumRows(idx: number): number {
    if (idx > 4 || idx < 0) {
        throw new Error("opRowIdxToNumRows called with invalid index");
    }
    const idxNumMap = [1, 100, 1000, 10000, 100000];

    return idxNumMap[idx];
}

function DataSourceTab({ tableModifiers, scrollTestLabel }: { tableModifiers: Modifiers, scrollTestLabel: string }) {
    const [opRowIdx, setOpRowIdx] = React.useState(1);
    const [moveRows, setMoveRows] = React.useState("NONE" as MoveRowStatus);

    return (
        <ControlRegionTab title='Data Source'>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>

                <ComboBox name='d_numOpRowsCombo'
                    onChanged={(e) => { setOpRowIdx(e.target.selectedIndex || 0); }}
                    restrictTextToItems={false}
                    dataSource={["1 rows (x10 groups)",
                        "100 rows (x10 groups)",
                        "1000 rows (x10 groups)",
                        "10000 rows (x10 groups)",
                        "100000 rows (x10 groups)"]}
                    selectedIndex={opRowIdx} />
                <StackPanel styles='sys-spaced'>
                    <Button text='Insert'
                        image='add'
                        _grow='1'
                        tabIndex={1}
                        onClick={() => { tableModifiers.insertRowsHandler(opRowIdxToNumRows(opRowIdx)); }} />
                    <Button text='Delete'
                        minWidth={120}
                        image='delete'
                        _grow='1'
                        tabIndex={3}
                        onClick={() => { tableModifiers.deleteRowsHandler(opRowIdxToNumRows(opRowIdx)); }} />
                </StackPanel>
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <Button name='d_moveRowsDownBtn'
                    image='down-next'
                    text='Move Rows Down'
                    tabIndex={2}
                    toggleable={true}
                    toggled={moveRows === "DOWN"}
                    onClick={(e) => {
                        tableModifiers.moveRowsDownHandler(e.source.toggled);
                        setMoveRows(e.source.toggled ? "DOWN" : "NONE");
                    }} />
                <Button name='d_moveRowsRandomlyBtn'
                    image='refresh'
                    text='Move Rows Randomly'
                    toggleable={true}
                    toggled={moveRows === "RANDOMLY"}
                    onClick={(e) => {
                        tableModifiers.moveRowsRandomlyHandler(e.source.toggled);
                        setMoveRows(e.source.toggled ? "RANDOMLY" : "NONE");
                    }} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <Button text='Update Cell Values'
                    image='play'
                    toggleable={true}
                    onClick={tableModifiers.updateRowsHandler} />
                <Button text='Change Long Text'
                    onClick={tableModifiers.changeLongTextHandler} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <Button name='d_addRemoveRows'
                    image='refresh'
                    text='Add/Remove Rows'
                    tabIndex={2}
                    toggleable={true}
                    onClick={tableModifiers.addRemoveRowsHandler} />
                <Button name='d_scrambleRows'
                    image='refresh'
                    text='Reverse Rows'
                    toggleable={true}
                    onClick={tableModifiers.reverseRowsHandler} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <Button text='Reconfigure'
                    image='refresh'
                    enabled={false} />
                <Button text='Reload'
                    image='refresh'
                    enabled={false} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <Button text='Toggle Col Visibility'
                    image='copy'
                    onClick={tableModifiers.toggleColVisibility} />
                <Button text='Snapshot'
                    image='copy'
                    enabled={false} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <CheckBox text='Use True Random Strings'
                    checked={false}
                    onClick={(e) => { tableModifiers.useTrueRandomHandler(e.target.checked); }} />
                <Button text={scrollTestLabel}
                    onClick={tableModifiers.toggleScrollTest}
                />
            </StackPanel>

        </ControlRegionTab>
    );
}

function TableOptionsTab({ tableModifiers }: { tableModifiers: Modifiers }) {
    return (
        <ControlRegionTab title='Table Options'>
            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <DropdownButton name='d_numPanesBtn'
                    content='1 Panes'
                    enabled={false}>
                    {(<_.dropdownContent>
                        <MenuList>
                            <MenuListItem content='1 Panes' />
                            <MenuListItem content='2 Panes' />
                            <MenuListItem content='3 Panes' />
                            <MenuListItem content='4 Panes' />
                        </MenuList>
                    </_.dropdownContent>) as any}
                </DropdownButton>
                <DropdownButton name='d_numPartitionsBtn'
                    content='1 Partitions'
                    enabled={false}>
                    {(<_.dropdownContent>
                        <MenuList>
                            <MenuListItem content='1 Partitions' />
                            <MenuListItem content='2 Partitions' />
                            <MenuListItem content='3 Partitions' />
                            <MenuListItem content='4 Partitions' />
                        </MenuList>
                    </_.dropdownContent>) as any}
                </DropdownButton>
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <CheckBox text='Attached To Document'
                    checked={true}
                    enabled={false} />
                <CheckBox text='Visible'
                    checked={true}
                    enabled={false} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <CheckBox text='Fix first pane'
                    checked={false}
                    onClick={(e) => tableModifiers.toggleFixedFirstPane(e.target.checked)} />
                <CheckBox text='Fix last pane'
                    checked={false}
                    onClick={(e) => tableModifiers.toggleFixedLastPane(e.target.checked)} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <CheckBox text='Title Rows'
                    checked={true}
                    enabled={false} />
                <CheckBox text='Col Resizes in Body'
                    checked={false}
                    onClick={(e) => tableModifiers.toggleColResizersInBody(e.target.checked)} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <CheckBox text='Hor Grid Lines'
                    checked={true}
                    onClick={(e) => tableModifiers.changeHorLinesHandler(e.target.checked)} />
                <CheckBox text='Vert Grid Lines'
                    checked={true}
                    onClick={(e) => tableModifiers.changeVertLinesHandler(e.target.checked)} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <CheckBox text='Alt Row Heights and Cell Paddings'
                    checked={false}
                    onClick={(e) => tableModifiers.changeAltRowHeightsAndPaddingsHandler(e.target.checked)} />
                <CheckBox text='Display Whole Rows'
                    checked={false}
                    onClick={(e) => tableModifiers.changeDisplayWholeRowsHandler(e.target.checked)} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <CheckBox text='Start Indices at 1'
                    checked={false}
                    enabled={false}
                    onClick={(e) => tableModifiers.changeStartIndicesAtOneHandler(e.target.checked)} />
                <CheckBox text='Border'
                    checked={false}
                    onClick={(e) => tableModifiers.changeBorderHandler(e.target.checked)} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <CheckBox text='Fix right column'
                    checked={false}
                    onClick={(e) => tableModifiers.changeFixedRightColHandler(e.target.checked)} />
                <CheckBox text='Fix top and bottom rows'
                    checked={false}
                    onClick={(e) => tableModifiers.changeFixedRowsHandler(e.target.checked)} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <CheckBox text='Spreadsheet Style'
                    checked={false}
                    enabled={false} />
                <CheckBox text='Tile Style'
                    checked={false}
                    enabled={false} />
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <Button text='Print Viewport Range'
                    name='d_printViewportRangeBtn'
                    toggleable={true} />
                <StackPanel styles='sys-spaced'>
                    <Label text='Content Zoom' />
                    <Slider _grow='1'
                        _shrink='1'
                        min='25'
                        max='200'
                        value='100'
                        step='5'
                        enabled={false} />
                </StackPanel>
            </StackPanel>

            <Separator />

            <StackPanel orientation='vertical'
                styles='sys-spaced'>
                <CheckBox text='Keep Resizer in View'
                    checked={false}
                    onClick={(e) => tableModifiers.changeKeepColResizerEdgeInViewHandler(e.target.checked)} />
            </StackPanel>


        </ControlRegionTab>
    )
}

function viewSource() {
    // BLP.environment.openUrl('https://bbgithub.dev.bloomberg.com/rplus-core/rplus-examples/tree/master/example-table-kitchensink');
}

export default function Controls({ tableModifiers, scrollTestLabel }: { tableModifiers: Modifiers, scrollTestLabel: string }) {
    return (
        <RBLPUI.ControlRegion >
            <_.postTabsContent>
                <Button text="View Source"
                    styles='sys-buy'
                    onClick={viewSource}
                    marginLeft={5} />
            </_.postTabsContent>

            <DataSourceTab tableModifiers={tableModifiers} scrollTestLabel={scrollTestLabel} />
            <TableOptionsTab tableModifiers={tableModifiers} />

        </RBLPUI.ControlRegion>
    );


};
