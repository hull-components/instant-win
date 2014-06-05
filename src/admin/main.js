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
      var self = this;
      var data = this.sandbox.dom.getFormData(e.currentTarget)
      this.api.post('app/achievements', data).then(function () {
        self.template = 'main';
        self.data.error = undefined;
        self.refresh();
      }, function (err) {
        self.data.error = err.message;
        self.refresh();
      });
    }
  },

  actions: {
    showRaw: function () {
      var rawContainer = this.$el.find('pre.raw');
      rawContainer.removeClass('hidden');
      rawContainer.html(JSON.stringify(this.data.achievement, null, 2));
    },
    createAchievement: function () {
      this.template = 'form';
      this.refresh();
    },
    selectAchievement: function(event, action) {
      var self = this;
      this.api(action.data.id).then(function(achievement) {
        self.template = 'form';
        self.data.achievement = achievement;
        self.refresh();
      });
    }
  },

  afterRender: function() {
    this.$formContainer = this.$('[data-hull-achievement-form]');
  }
});
