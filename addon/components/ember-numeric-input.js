import Ember from 'ember';

export default Ember.TextField.extend({
  willInsertElement: function() {
    this.$().on("keypress", e => {
      if(this.isInvalidValue(e)) {
        e.preventDefault();
      }
    });
  },


  numberValue: Ember.computed('value', {
    get() {
      return Number(this.get('value'));
    },
    set(key, value) {
      this.set('value', value ? value : null);
    }
  }),

  getNewValue: function(e) {
    let keyCode = e.keyCode || e.which;
    let newChar = String.fromCharCode(keyCode);
    return Ember.$(e.currentTarget).val() + newChar;
  },

  moreThanTwoDecimals: function(e) {
    return this.getNewValue(e).countDecimals() > 2;
  },

  isInvalidValue: function(e) {
    if (e.altKey || e.metaKey || e.shiftKey || e.ctrlKey) { return false;}
    if (e.which === 0) {return false;} //arrow keys, etc, in FF
    if (e.which === 8) {return false;} //backspace

    let value = this.getNewValue(e);

    return isNaN(value) || value.countDecimals() > 2;
  }
});
