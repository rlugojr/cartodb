var $ = require('jquery');
var Backbone = require('backbone');
var ConfigModel = require('../../../../../../javascripts/cartodb3/data/config-model');
var QuerySchemaModel = require('../../../../../../javascripts/cartodb3/data/query-schema-model');
var WidgetsFormContentView = require('../../../../../../javascripts/cartodb3/editor/widgets/widgets-form/widgets-form-content-view');
var WidgetDefinitionModel = require('../../../../../../javascripts/cartodb3/data/widget-definition-model');

describe('editor/widgets/widgets-form/widgets-form-content-view', function () {
  beforeEach(function () {
    var configModel = new ConfigModel({
      base_url: '/u/pepe'
    });

    var querySchemaModel = new QuerySchemaModel({
      query: 'SELECT * FROM foobar',
      status: 'fetched'
    }, {
      configModel: configModel
    });
    querySchemaModel.columnsCollection.reset([
      { name: 'cartodb_id', type: 'number' },
      { name: 'created_at', type: 'date' }
    ]);

    var userModel = {
      featureEnabled: function () {
        return true;
      }
    };

    var dfd = $.Deferred();
    dfd.resolve();
    spyOn(querySchemaModel, 'fetch').and.returnValue(dfd.promise());

    this.analysisDefinitionNodesCollection = new Backbone.Collection();
    var nodeDefModel = this.analysisDefinitionNodesCollection.add({id: 'a0'});
    nodeDefModel.querySchemaModel = querySchemaModel;

    this.layerDefinitionsCollection = new Backbone.Collection({
      id: 'l1',
      color: 'red',
      name: 'layerrr'
    });
    var l = this.layerDefinitionsCollection.at(0);
    l.getName = function () {
      return this.get('name');
    };

    this.widgetDefinitionModel = new WidgetDefinitionModel({
      id: 'w-456',
      title: 'some title',
      type: 'formula',
      layer_id: 'l1',
      source: 'a0',
      column: 'hello',
      operation: 'sum',
      prefix: 'my-prefix'
    }, {
      configModel: configModel,
      mapId: 'm-123'
    });

    this.stackLayoutModel = jasmine.createSpyObj('stackLayoutModel', ['prevStep']);

    this.view = new WidgetsFormContentView({
      userActions: {},
      modals: {},
      widgetDefinitionModel: this.widgetDefinitionModel,
      layerDefinitionsCollection: this.layerDefinitionsCollection,
      analysisDefinitionNodesCollection: this.analysisDefinitionNodesCollection,
      stackLayoutModel: this.stackLayoutModel,
      stackLayoutPrevStep: 0,
      userModel: userModel,
      configModel: configModel
    });
    this.view.render();
  });

  it('should generate the right tabs', function () {
    expect(this.view.$el.text()).toContain('editor.widgets.widgets-form.data.title');
    expect(this.view.$el.text()).toContain('editor.widgets.widgets-form.style.title');
  });

  it('should get back to the previous step if arrow is clicked', function () {
    this.view.$('.js-back').click();
    expect(this.stackLayoutModel.prevStep).toHaveBeenCalledWith('widgets');
  });

  it('should not have leaks', function () {
    expect(this.view).toHaveNoLeaks();
  });
});
