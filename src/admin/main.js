Hull.component({
  templates: ['main', 'form'],
  datasources: {
    achievements: {
      path: 'app/achievements',
      params: { where: { _type: "InstantWin" }}
    }
  },

  events: {
    'submit form' : function(e) {
      e && e.preventDefault();
      var data = this.sandbox.dom.getFormData(e.currentTarget)
      console.warn("YEAH !", data);
    }
  },

  actions: {
    selectAchievement: function(event, action) {
      var self = this;
      this.api(action.data.id).then(function(achievement) {
        var res = self.renderTemplate('form', { achievement: achievement });
        self.$formContainer.html(res);
      });
    }
  },

  beforeRender: function(data) {
    console.warn(data)
  },

  afterRender: function() {
    this.$formContainer = this.$('[data-hull-achievement-form]');
  }
});