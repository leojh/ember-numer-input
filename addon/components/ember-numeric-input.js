import Ember from 'ember';

export default Ember.TextField.extend({
  willInsertElement: function() {
    this.$().on("keypress", e => {
      if(!this.isValidValue(e)) {
        e.preventDefault();
      }
    });
  },

  numberValue: Ember.computed('value', {
    get() {
      let value = this.get('value');

      if (value === ".") {return 0;}

      return Number(value);
    },
    set(key, value) {
      if (this.get('value') === ".") {
        value = ".";
      }

      this.set('value', value ? value : null);
    }
  }),

  getNewValue: function(e) {
    let keyCode = e.keyCode || e.which;
    let newChar = String.fromCharCode(keyCode);
    let value = (this.get('value') || "").toString().replace(this.getSelectionText(), "");
    let position = this.$()[0].selectionStart;
    return [value.slice(0, position), newChar, value.slice(position)].join('');
  },

  moreThanTwoDecimals: function(e) {
    return this.getNewValue(e).countDecimals() > 2;
  },

  isNewValueAPeriod: function(e) {
    return this.getNewValue(e) === ".";
  },

  isValidValue: function(e) {
    if (this.isNewValueAPeriod(e)) { return true; }

    if (e.altKey || e.metaKey || e.shiftKey || e.ctrlKey) { return true;}
    if (e.which === 0) {return true;} //arrow keys, etc, in FF
    if (e.which === 8) {return true;} //backspace

    let value = this.getNewValue(e);

    return !isNaN(value) && value.countDecimals() <= 2;
  },

  getSelectionText: function() {
    let element = this.$()[0];
    if(element.tagName === "TEXTAREA" ||
      (element.tagName === "INPUT" && element.type === "text")) {
       return element.value.substring(element.selectionStart, element.selectionEnd);
   }
   return null;
  }
});
