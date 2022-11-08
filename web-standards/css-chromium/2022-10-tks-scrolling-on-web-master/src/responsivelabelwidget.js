import UI from '@bbkit/sys-ui-web/ui';

var ResponsiveLabel = UI.UserWidget.define({

    init: function() {

        var panel = new UI.OverflowPanel();
        this.d_panel = panel;
        panel.justify = 'center';
        panel.relayoutHandler = this.relayoutHandler.bind(this);

        var label = new UI.Label();
        panel.content = label;

        this.__content = panel;
    },

    public: {

        set text(val) {

            this.d_text = val;
            this.d_layouts = val.split('|').reverse();
            this.d_panel.forceRelayout();
        },

        get text() {

            return this.d_text;
        },
    },

    protected: {

        relayoutHandler: function(label, direction, isIncrease) {

            if (direction !== 'horizontal') {
                return false;
            }

            var curLayoutIdx = this.d_curLayoutIdx;
            var layouts = this.d_layouts;

            if ((!isIncrease && curLayoutIdx === 0) ||
                (isIncrease && curLayoutIdx >= layouts.length - 1)) {
                return false;
            }

            curLayoutIdx = isIncrease ? curLayoutIdx + 1 :
                                        curLayoutIdx - 1;

            var haveMoreLayouts =
                (isIncrease && curLayoutIdx < layouts.length - 1) ||
                (!isIncrease && curLayoutIdx > 0);

            label.text = layouts[curLayoutIdx];
            this.d_curLayoutIdx = curLayoutIdx;

            return haveMoreLayouts;
        }
    },

    private: {

        d_panel: null,
        d_text: '',
        d_layouts: [],
        d_curLayoutIdx: -1
    }
});

export default ResponsiveLabel;
