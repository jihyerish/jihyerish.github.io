import UI from '@bbkit/sys-ui-web/ui';

var DetailsLabel = UI.UserWidget.define({

    init: function() {

        this.styles = 'sys-table-multiline-layout';

        var flowPanel = new UI.FlowPanel();
        flowPanel.orientation = 'vertical';
        this.__content = flowPanel;

        var mainLabel = new UI.Label();
        mainLabel.wordWrapPolicy = 'word';
        flowPanel.addChild(mainLabel);
        this.d_mainLabel = mainLabel;

        var detailsLabel = new UI.Label();
        detailsLabel.wordWrapPolicy = 'word';
        detailsLabel.styles = 'sys-instruction';
        flowPanel.addChild(detailsLabel);
        detailsLabel.visible = false;
        this.d_detailsLabel = detailsLabel;

        this.on('click', function(e) {
            e.stopPropagation();
            this.toggleDetails();
        }.bind(this));
    },

    public: {

        set text(val) {
            this.d_mainLabel.text = val;
        },

        get text() {
            return this.d_mainLabel.text;
        },
        
        set detailsText(val) {
            this.d_detailsLabel.text = val;
        },

        get detailsText() {
            return this.d_detailsLabel.text;
        },

        set wordWrap(val) {
            this.d_mainLabel.wordWrap = val;
            this.d_detailsLabel.wordWrap = val;
        },

        get wordWrap() {
            return this.d_mainLabel.wordWrap;
        }
    },

    protected: {

        toggleDetails: function() {

            this.d_detailsLabel.visible = !this.d_detailsLabel.visible;
            this.__fireEvent('layoutchanged');
        }
    }
});

export default DetailsLabel;

