/*!
 * jQuery a11yCheckboxHack plugin
 * Author: @kpboucher
 * Use this plugin to make LABEL tags focusable when using
 * the 'checkbox hack' to hide/show menus and content.
 * (Replaces the LABEL with an A tag and toggles the checked
 * state of the associated checkbox programatically.)
 */

;(function ( $, window, document, undefined ) {

    'use strict';

    // Create the defaults once
    var pluginName = "a11yCheckboxHack",
        defaults = {};

    // The actual plugin constructor
    function A11yCheckboxHack( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    A11yCheckboxHack.prototype = {

        init: function() {
            // You have access to the DOM element and the
            // options via the instance, e.g. this.element
            // and this.options
            var ckbId = this.element.getAttribute('for'),
                checkbox, newToggle;

            if (ckbId && ckbId.replace(' ', '').length === 0) {
                throw new Error(
                    'Label element must have a for attribute with a value corresponding to the relvant checkbox\'s id.'
                );
            }

            // reference the relevant checkbox
            checkbox = document.getElementById(ckbId);

            // create new toggle element
            newToggle = document.createElement('a');
            newToggle.setAttribute('href', 'javascript:void()'); // href required for focus
            $.each(this.element.attributes, function (index, value) {
                if (value.name !== 'for') { // Don't transfer the for attribute
                    newToggle.setAttribute(value.name, value.value ? value.value : value.name);
                }
            });
            newToggle.innerHTML = this.element.innerHTML;

            // setup new toggle event handler
            $(newToggle).on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                
                checkbox.checked = !checkbox.checked;
            });

            // replace LABEL tag with A tag
            $(this.element).replaceWith(newToggle);

        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new A11yCheckboxHack( this, options ));
            }
        });
    };

})( jQuery, window, document );
