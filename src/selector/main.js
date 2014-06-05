Hull.component({
  templates: ['main'],
  datasources: {
    achievements: {
      path: 'app/achievements',
      params: { where: { _type: "InstantWin" }}
    }
  },
  actions: {
    selectGame: function () {
      debugger
      var data = this.$el.find('option[selected]').value();
      this.data.selectedId = data;
      this.refresh();
    }
  }
})
